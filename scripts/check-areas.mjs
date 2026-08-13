/**
 * Service-area guard.
 *
 * Every town on this site is named in two places at once: `BUSINESS.serviceAreas`
 * in src/config/site.ts, which feeds `areaServed` in the JSON-LD on every page,
 * and src/content/areas/*.mdx, which is where the page actually lives. Nothing
 * kept the two in step, and three things had gone wrong at the same time:
 *
 *   - Footer.astro carried its own hand-typed map of three towns, so six of the
 *     nine area pages rendered as plain text instead of links, on every page of
 *     the site. It now derives the slug from the town name instead, which moves
 *     the fragility rather than removing it: the config must never name a town
 *     the content has not written, or the footer links nowhere sitewide.
 *   - /areas computed `alsoServed` — towns served but not yet written — which
 *     had become empty once the ninth page shipped. The section rendered
 *     anyway: a heading reading "The towns without a page yet" above an empty
 *     list, on the page whose whole argument is that we do not overstate where
 *     we work.
 *
 * All three were the same bug: a hand-typed list of towns sitting next to a
 * computed one. The repo has solved this class twice before — check-prices.mjs
 * for rupee figures, and the HOURS_* derivations in site.ts for the days and
 * times that had three pages disagreeing with the schema. Both times the fix
 * was a single source plus a guard. This is the guard.
 *
 * Checks, against source rather than the build, because that is where the
 * duplication lives:
 *   1. every area page's `city` is a name in BUSINESS.serviceAreas
 *   2. exactly one `isHomeBase: true`, and it is the town the studio is in
 *   3. no two area pages share an `order`
 *   4. every /areas/<slug> link in site.ts resolves to a real area page
 *   5. every name in serviceAreas has a page, because the footer links them all
 *   6. /areas still renders the alsoServed fallback, so a town added to the
 *      config without a page is disclosed rather than silently claimed
 *   7. every `nearby` slug resolves, and no page lists more than four
 *
 * Run: node scripts/check-areas.mjs        (no build required)
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** fileURLToPath, not URL.pathname — the repo path contains a space. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const AREAS_DIR = join(ROOT, 'src', 'content', 'areas');

/** The most any one page may list as nearby: two clean rows of two. */
const NEARBY_MAX = 4;

const problems = [];

/* ---- the config side ----------------------------------------------------- */

const siteConfig = readFileSync(join(ROOT, 'src', 'config', 'site.ts'), 'utf8');

const serviceAreasBlock = siteConfig.match(/serviceAreas:\s*\[([\s\S]*?)\]/)?.[1];
const locality = siteConfig.match(/locality:\s*'([^']+)'/)?.[1];
if (!serviceAreasBlock || !locality) {
  console.error('\n✗ could not read serviceAreas or the studio locality from src/config/site.ts\n');
  process.exit(1);
}

const serviceAreas = [...serviceAreasBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]);

/* ---- the content side ---------------------------------------------------- */

/**
 * Frontmatter only. The body is prose and may legitimately contain any of the
 * words below; matching against it would report the page for describing itself.
 */
const frontmatter = (text) => text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

const scalar = (fm, key) => fm.match(new RegExp(`^${key}:\\s*'([^']*)'`, 'm'))?.[1];
const number = (fm, key) => {
  const raw = fm.match(new RegExp(`^${key}:\\s*(-?\\d+)`, 'm'))?.[1];
  return raw === undefined ? undefined : Number(raw);
};
const flag = (fm, key) => fm.match(new RegExp(`^${key}:\\s*(true|false)`, 'm'))?.[1] === 'true';

/** Handles both `nearby: ['a', 'b']` and a YAML block list of `- 'a'`. */
const list = (fm, key) => {
  const inline = fm.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, 'm'))?.[1];
  if (inline !== undefined) return [...inline.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const block = fm.match(new RegExp(`^${key}:\\s*\\r?\\n((?:\\s+-\\s.*\\r?\\n?)+)`, 'm'))?.[1];
  if (block === undefined) return undefined;
  return [...block.matchAll(/-\s*'?([^'\r\n]+?)'?\s*$/gm)].map((m) => m[1]);
};

const pages = readdirSync(AREAS_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const fm = frontmatter(readFileSync(join(AREAS_DIR, file), 'utf8'));
    return {
      file: `src/content/areas/${file}`,
      slug: file.replace(/\.mdx$/, ''),
      city: scalar(fm, 'city'),
      order: number(fm, 'order'),
      isHomeBase: flag(fm, 'isHomeBase'),
      nearby: list(fm, 'nearby'),
    };
  });

const slugs = new Set(pages.map((p) => p.slug));
const written = new Set(pages.map((p) => p.city));

/* ---- 1. every page's city is a served area ------------------------------- */

for (const page of pages) {
  if (!page.city) {
    problems.push(`${page.file}  no city in frontmatter`);
  } else if (!serviceAreas.includes(page.city)) {
    problems.push(
      `${page.file}  city "${page.city}" is not in BUSINESS.serviceAreas — ` +
        `the page would publish a town the schema never claims`,
    );
  }
}

/* ---- 2. exactly one home base, and it is where the studio is ------------- */

const homeBases = pages.filter((p) => p.isHomeBase);
if (homeBases.length !== 1) {
  problems.push(
    `${homeBases.length} area pages set isHomeBase: true, expected exactly 1 ` +
      `(${homeBases.map((p) => p.slug).join(', ') || 'none'})`,
  );
} else if (homeBases[0].city !== locality) {
  problems.push(
    `${homeBases[0].file}  isHomeBase but city is "${homeBases[0].city}" — ` +
      `the studio address says ${locality}`,
  );
}

/* ---- 3. no duplicate order ----------------------------------------------- */

const byOrder = new Map();
for (const page of pages) {
  if (page.order === undefined) {
    problems.push(`${page.file}  no order in frontmatter`);
    continue;
  }
  if (byOrder.has(page.order)) {
    problems.push(`${page.file}  order ${page.order} already used by ${byOrder.get(page.order)}`);
  } else {
    byOrder.set(page.order, page.slug);
  }
}

/* ---- 4. every /areas link in the config resolves -------------------------- */

for (const [, slug] of siteConfig.matchAll(/'\/areas\/([a-z-]+)'/g)) {
  if (!slugs.has(slug)) {
    problems.push(`src/config/site.ts  links /areas/${slug}/, which has no page`);
  }
}

/* ---- 5. every town the footer links resolves to a page ------------------- */

/*
 * Footer.astro links every name in `serviceAreas`, deriving the slug as
 * `city.toLowerCase()`. That is the right shape — the hand-kept map of which
 * towns had pages is exactly what went stale — but it moves the fragility to
 * the config: a town added to `serviceAreas` before its page is written puts a
 * dead link in the footer of every page on the site. Its comment states the
 * assumption ("every town in serviceAreas has a page"). This enforces it.
 */
for (const city of serviceAreas) {
  const slug = city.toLowerCase();
  if (!slugs.has(slug)) {
    problems.push(
      `src/config/site.ts  serviceAreas names "${city}" with no page at ` +
        `src/content/areas/${slug}.mdx — the footer links every town it names, ` +
        `so this is a dead link on every page of the site`,
    );
  }
}

/* ---- 6. the honest fallback on /areas ------------------------------------ */

const areasIndex = readFileSync(join(ROOT, 'src', 'pages', 'areas', 'index.astro'), 'utf8');
if (!areasIndex.includes('alsoServed')) {
  problems.push(
    'src/pages/areas/index.astro  no longer computes alsoServed — a town in ' +
      'serviceAreas without a page would be claimed with nothing to show for it',
  );
}

/* ---- 7. nearby resolves and stays within the grid ------------------------ */

for (const page of pages) {
  if (page.nearby === undefined) continue;
  if (page.nearby.length > NEARBY_MAX) {
    problems.push(
      `${page.file}  lists ${page.nearby.length} nearby towns (max ${NEARBY_MAX}) — ` +
        `the grid is two columns and an odd card is left stranded`,
    );
  }
  for (const slug of page.nearby) {
    if (!slugs.has(slug)) problems.push(`${page.file}  nearby "${slug}" has no page`);
    if (slug === page.slug) problems.push(`${page.file}  lists itself as nearby`);
  }
}

/* ---- report -------------------------------------------------------------- */

if (problems.length) {
  console.error(`\n✗ ${problems.length} service-area problem${problems.length > 1 ? 's' : ''}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nTowns come from BUSINESS.serviceAreas and the areas collection, together.\n');
  process.exit(1);
}

const unwritten = serviceAreas.filter((city) => !written.has(city));
console.log(
  `✓ areas: ${pages.length} pages across ${serviceAreas.length} served towns` +
    (unwritten.length ? `, ${unwritten.length} disclosed as not yet written` : ''),
);
