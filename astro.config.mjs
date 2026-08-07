// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production (Cloudflare Pages, careinflow.com) builds at the root.
// The GitHub Pages mirror sets SITE=https://jaidevjethi.github.io and
// BASE_PATH=/careinflow-website; canonical URLs always point at
// https://careinflow.com regardless (see src/config/site.ts).
const SITE = process.env.SITE ?? 'https://careinflow.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';

/** Build date, so every sitemap entry carries a lastmod rather than none. */
const BUILD_DATE = new Date().toISOString();

/**
 * Rewrite root-relative links inside rendered Markdown/MDX so they respect
 * BASE_PATH on the GitHub Pages mirror. Component links use lib/url's href();
 * this covers links authored in content files.
 */
function rehypeBasePath() {
  const base = BASE_PATH.replace(/\/$/, '');
  return function transform(tree) {
    if (!base) return;
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
          node.properties.href = `${base}${href}`;
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
  // same conversion. Its content now lives on /contact in full. The old URL
  // keeps working — a static build emits a meta-refresh page here — so any
  // existing link or indexed result lands on the merged page rather than a 404.
  //
  // The target has to carry BASE_PATH itself. Astro applies `base` to links it
  // renders but not to redirect targets, so a literal '/contact/' works at the
  // root and 404s on the GitHub Pages mirror, which serves from
  // /careinflow-website. Same trap rehypeBasePath above exists to avoid.
  redirects: {
    '/free-review': `${BASE_PATH.replace(/\/$/, '')}/contact/`,
  },
  integrations: [
    mdx(),
    sitemap({
      // The 404 self-canonicalises and is noindex; it does not belong in here.
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: item.lastmod ?? BUILD_DATE }),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeBasePath],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
