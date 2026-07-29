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
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [mdx(), sitemap()],
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
