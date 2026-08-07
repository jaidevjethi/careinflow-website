/**
 * Metadata, link and structured-data guard.
 *
 * CLAUDE.md has always said titles run to 62 characters and descriptions to
 * 158, that every page has one H1, and that internal links are real HTML links
 * to real pages. Nothing enforced any of it, and two things had quietly gone
 * wrong: one resource title had grown to 64, and every internal link on the
 * site pointed at the unslashed form of its URL under `trailingSlash: 'always'`
 * — 2,471 references each taking a 308 on the way to the address the same page
 * declared canonical.
 *
 * This runs against the built output rather than the source, because that is
 * where a title is finally assembled from a frontmatter field plus a suffix,
 * and where a link is finally a string.
 *
 * It checks, per page:
 *   1. <html lang> present
 *   2. exactly one <title>, ≤62 characters after entity decoding, unique
 *   3. one meta description, ≤158 characters, unique
 *   4. exactly one <h1>
 *   5. one canonical, absolute, on CANONICAL_HOST
 *   6. a robots directive that matches the build target
 *   7. og:image and og:url absolute
 *
 * and across the build:
 *   8. every internal href/src resolves to an emitted file, with the trailing
 *      slash `trailingSlash: 'always'` requires (files keep their exact path)
 *   9. every JSON-LD block parses, every @id sits on CANONICAL_HOST, and no
 *      Review or AggregateRating node exists anywhere — the site has no
 *      genuine reviews and must never claim any
 *
 * Run: node scripts/check-meta.mjs        (after `astro build`)
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** fileURLToPath, not URL.pathname — the repo path contains a space. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

const TITLE_MAX = 62;
const DESCRIPTION_MAX = 158;

if (!existsSync(DIST)) {
  console.error('\n✗ dist/ not found. Run `astro build` first.\n');
  process.exit(1);
}

/* ---- what this build is -------------------------------------------------- */

/** Read CANONICAL_HOST from its one source rather than restating it here. */
const siteConfig = readFileSync(join(ROOT, 'src', 'config', 'site.ts'), 'utf8');
const CANONICAL_HOST = siteConfig.match(/CANONICAL_HOST\s*=\s*'([^']+)'/)?.[1];
if (!CANONICAL_HOST) {
  console.error('\n✗ could not read CANONICAL_HOST from src/config/site.ts\n');
  process.exit(1);
}

const home = readFileSync(join(DIST, 'index.html'), 'utf8');
/** Assets are emitted under `${base}/_astro/`, which is where base is legible. */
const BASE = home.match(/(?:href|src)="(\/[^"]*?)\/_astro\//)?.[1] ?? '';
/** Production advertises the sitemap; the mirror deliberately does not. */
const IS_CANONICAL = readFileSync(join(DIST, 'robots.txt'), 'utf8').includes('Sitemap:');

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');

const attr = (html, re) => html.match(re)?.[1];

const problems = [];

/**
 * Google Search Console's HTML verification file. It is a single line of text
 * with an .html extension and none of the structure a page has, so it is
 * excluded from the page checks below and asserted separately instead.
 *
 * Deleting it un-verifies the property, which loses the Search Console history
 * with it. The build fails rather than let that happen quietly.
 */
const GSC_VERIFICATION = 'google86e87b3d4788a10e.html';
const gscFile = join(DIST, GSC_VERIFICATION);
if (!existsSync(gscFile)) {
  problems.push(
    `${GSC_VERIFICATION} is missing from the build — it lives in public/ and must never be removed`,
  );
} else if (!readFileSync(gscFile, 'utf8').includes('google-site-verification')) {
  problems.push(`${GSC_VERIFICATION} no longer contains its verification token`);
}

const pages = walk(DIST)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !f.endsWith(GSC_VERIFICATION));
const id = (file) => relative(DIST, file).split(sep).join('/');

const titles = new Map();
const descriptions = new Map();

/* ---- per page ------------------------------------------------------------ */

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = id(file);
  const fail = (msg) => problems.push(`${page}  ${msg}`);

  // A redirect stub is a <meta refresh> and nothing else. It has no H1 and no
  // description by design, and is not a page anyone reads.
  if (/<meta http-equiv="refresh"/i.test(html)) continue;

  if (!/<html[^>]+\blang="[^"]+"/i.test(html)) fail('no <html lang>');

  const titleTags = html.match(/<title>([\s\S]*?)<\/title>/g) ?? [];
  if (titleTags.length !== 1) {
    fail(`${titleTags.length} <title> tags, expected 1`);
  } else {
    const title = decode(attr(html, /<title>([\s\S]*?)<\/title>/) ?? '');
    if (title.length > TITLE_MAX) fail(`title ${title.length} chars (max ${TITLE_MAX}): ${title}`);
    if (titles.has(title)) fail(`title duplicates ${titles.get(title)}: ${title}`);
    else titles.set(title, page);
  }

  const description = attr(html, /<meta name="description" content="([^"]*)"/);
  if (description === undefined) {
    fail('no meta description');
  } else {
    const text = decode(description);
    if (text.length > DESCRIPTION_MAX) {
      fail(`description ${text.length} chars (max ${DESCRIPTION_MAX})`);
    }
    if (descriptions.has(text)) fail(`description duplicates ${descriptions.get(text)}`);
    else descriptions.set(text, page);
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(`${h1s} <h1>, expected exactly 1`);

  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) fail('no canonical');
  else if (!canonical.startsWith(`${CANONICAL_HOST}/`)) fail(`canonical off-host: ${canonical}`);

  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  if (!robots) {
    fail('no robots directive');
  } else {
    const isNoindex = robots.includes('noindex');
    // Everything on a mirror build stays out of the index; on production only
    // the 404 does, which self-canonicalises and would otherwise be a soft 404.
    const shouldBeNoindex = !IS_CANONICAL || page === '404.html';
    if (isNoindex !== shouldBeNoindex) {
      fail(`robots "${robots}" — expected ${shouldBeNoindex ? 'noindex' : 'index'} on this build`);
    }
  }

  for (const [, prop, value] of html.matchAll(
    /<meta property="(og:image|og:url)" content="([^"]*)"/g,
  )) {
    if (!/^https:\/\//.test(value)) fail(`${prop} is not an absolute https URL: ${value}`);
  }
}

/* ---- internal links ------------------------------------------------------ */

const resolves = (route) => {
  const target = join(DIST, decodeURIComponent(route.slice(BASE.length)));
  return existsSync(target) || existsSync(join(target, 'index.html'));
};

let refCount = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = id(file);

  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('//')) continue;
    refCount++;

    if (BASE && !(url === BASE || url.startsWith(`${BASE}/`))) {
      problems.push(`${page}  link misses base ${BASE}: ${url}`);
      continue;
    }

    const route = url.split(/[?#]/)[0];
    const isFile = /\.[a-z0-9]+$/i.test(route);
    if (!isFile && !route.endsWith('/')) {
      problems.push(`${page}  link without trailing slash, costs a redirect: ${url}`);
      continue;
    }
    if (!resolves(route)) problems.push(`${page}  link resolves to nothing: ${url}`);
  }
}

/* ---- the studio address -------------------------------------------------- */

/*
 * The footer and the JSON-LD render the address from BUSINESS.address, but two
 * FAQ answers spell it out by hand — content collections are MDX and JSON and
 * cannot import the config. When the address changed in August 2026 those two
 * were still publishing the old building name and the old postcode, on pages a
 * patient might use to find the place.
 *
 * So: any street line anywhere in the build must be the configured one, letter
 * for letter. NAP consistency is the whole basis of local search, and a second
 * version of the address is worth less than no address at all.
 */
const street = siteConfig.match(/street:\s*'([^']+)'/)?.[1];
const postcode = siteConfig.match(/postalCode:\s*'([^']+)'/)?.[1];
if (!street || !postcode) {
  console.error('\n✗ could not read the address from src/config/site.ts\n');
  process.exit(1);
}

/** Matches any "<unit>, <building>, <road>" shaped line for this address. */
const STREET_SHAPE = /(?:Shop\s+)?F-?\s?27\s*,[^,<]{0,40},\s*Radhanpur\s+(?:Road|Rd)/gi;
/** Any Mehsana postcode: 384 followed by three digits. */
const POSTCODE_SHAPE = /\b384\d{3}\b/g;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = id(file);
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&#8377;/g, '₹').replace(/\s+/g, ' ');

  for (const [match] of [...text.matchAll(STREET_SHAPE)].map((m) => [m[0]])) {
    if (match.trim() !== street) {
      problems.push(`${page}  address "${match.trim()}" — config says "${street}"`);
    }
  }
  for (const [match] of [...text.matchAll(POSTCODE_SHAPE)].map((m) => [m[0]])) {
    if (match !== postcode) {
      problems.push(`${page}  postcode ${match} — config says ${postcode}`);
    }
  }
}

/* ---- structured data ----------------------------------------------------- */

/** Claims the site has no evidence for and must never emit. */
const BANNED_TYPES = new Set(['Review', 'AggregateRating']);

const walkJson = (node, visit) => {
  if (Array.isArray(node)) return node.forEach((n) => walkJson(n, visit));
  if (node && typeof node === 'object') {
    visit(node);
    Object.values(node).forEach((v) => walkJson(v, visit));
  }
};

let blockCount = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = id(file);

  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    blockCount++;
    let data;
    try {
      data = JSON.parse(json);
    } catch (error) {
      problems.push(`${page}  JSON-LD does not parse: ${error.message}`);
      continue;
    }

    walkJson(data, (node) => {
      const types = [node['@type']].flat().filter(Boolean);
      for (const type of types) {
        if (BANNED_TYPES.has(type)) problems.push(`${page}  JSON-LD contains ${type}`);
      }
      const nodeId = node['@id'];
      if (typeof nodeId === 'string' && /^https?:\/\//.test(nodeId)) {
        if (!nodeId.startsWith(`${CANONICAL_HOST}/`)) {
          problems.push(`${page}  JSON-LD @id off-host: ${nodeId}`);
        }
      }
    });
  }
}

/* ---- report -------------------------------------------------------------- */

if (problems.length) {
  console.error(`\n✗ ${problems.length} metadata problem${problems.length > 1 ? 's' : ''}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

const target = IS_CANONICAL ? CANONICAL_HOST : `mirror at ${BASE || '/'}`;
console.log(
  `✓ meta: ${pages.length} pages, ${refCount} internal links, ${blockCount} JSON-LD blocks — ${target}`,
);
