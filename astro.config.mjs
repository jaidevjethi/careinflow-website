// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production (Cloudflare Pages, www.careinflow.com) builds at the root.
// Cloudflare serves the site on www and 301s the apex to it, so www is what
// the sitemap and every canonical must say.
// The GitHub Pages mirror sets SITE=https://jaidevjethi.github.io and
// BASE_PATH=/careinflow-website; canonical URLs always point at
// https://www.careinflow.com regardless (see src/config/site.ts).
const CANONICAL_SITE = 'https://www.careinflow.com';
const SITE = process.env.SITE ?? CANONICAL_SITE;
const BASE_PATH = process.env.BASE_PATH ?? '/';

/** True for the Cloudflare production build, false for the mirror. */
const IS_CANONICAL = SITE === CANONICAL_SITE;

/** Build date, so every sitemap entry carries a lastmod rather than none. */
const BUILD_DATE = new Date().toISOString();

/**
 * Normalise root-relative links inside rendered Markdown/MDX: add the trailing
 * slash `trailingSlash: 'always'` requires, then prefix BASE_PATH for the
 * GitHub Pages mirror. Component links go through lib/url's href(), which does
 * both; this covers links authored by hand in content files, where half were
 * written with a trailing slash and half without, and the half without each
 * cost a redirect.
 */
function rehypeInternalLinks() {
  const base = BASE_PATH.replace(/\/$/, '');
  /** Files keep their exact path — /favicon.svg/ is a 404. */
  const withSlash = (route) =>
    /\.[a-z0-9]+$/i.test(route) || route.endsWith('/') ? route : `${route}/`;

  return function transform(tree) {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
          const [, route = '', rest = ''] = href.match(/^([^?#]*)([\s\S]*)$/) ?? [];
          node.properties.href = `${base}${withSlash(route)}${rest}`;
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: SITE,
  base: BASE_PATH,
  // 'always' matches canonicalUrl(), which appends a slash. Under 'ignore' every
  // internal click on Cloudflare took a 308 to the slashed form before landing
  // on the URL the page declares canonical.
  trailingSlash: 'always',
  output: 'static',
  // /free-review was a second enquiry route competing with /contact for the
  // same conversion. Its content now lives on /contact in full, and the old URL
  // still has to reach it rather than 404.
  //
  // Production gets a real 301 from public/_redirects. This entry is for the
  // mirror only, which ignores that file and can be served nothing better than
  // the meta-refresh page a static build emits. Emitting it on production too
  // would put a static /free-review/index.html in dist and leave which of the
  // two wins up to Cloudflare's asset-versus-rule precedence — so it does not.
  //
  // The target has to carry BASE_PATH itself. Astro applies `base` to links it
  // renders but not to redirect targets, so a literal '/contact/' works at the
  // root and 404s on the GitHub Pages mirror, which serves from
  // /careinflow-website. Same trap rehypeInternalLinks above exists to avoid.
  redirects: IS_CANONICAL
    ? {}
    : { '/free-review': `${BASE_PATH.replace(/\/$/, '')}/contact/` },
  integrations: [
    mdx(),
    sitemap({
      // The 404 self-canonicalises and is noindex; it does not belong in here.
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: item.lastmod ?? BUILD_DATE }),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeInternalLinks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
