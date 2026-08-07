import { CANONICAL_HOST } from '@/config/site';

/**
 * Prefix an internal path with the build's base path. All internal links go
 * through this so the GitHub Pages mirror (BASE_PATH=/careinflow-website)
 * resolves them correctly.
 *
 * It also appends the trailing slash that `trailingSlash: 'always'` requires.
 * Without it every internal click cost a redirect — 308 on Cloudflare, 301 on
 * GitHub Pages — on the way to the URL the page already declares canonical.
 * `canonicalUrl()` below had always added the slash; this did not, so the two
 * disagreed on every link on the site.
 */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path === '/' || path === '') return `${base}/`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  // Split the route off any ?query or #hash, so the slash lands on the path
  // rather than after the fragment: /pricing#estimate → /pricing/#estimate.
  const [, route = '', rest = ''] = clean.match(/^([^?#]*)([\s\S]*)$/) ?? [];
  // A path ending in an extension is a file, not a directory index. The
  // favicon, manifest, RSS feed and sitemap all come through here, and
  // /favicon.svg/ is a 404.
  const isFile = /\.[a-z0-9]+$/i.test(route);
  const withSlash = isFile || route.endsWith('/') ? route : `${route}/`;
  return `${base}${withSlash}${rest}`;
}

/**
 * Canonical URL for a page path — always on CANONICAL_HOST, with a trailing
 * slash to match how static hosts serve directory indexes.
 */
export function canonicalUrl(path: string): string {
  if (path === '/' || path === '') return `${CANONICAL_HOST}/`;
  const clean = path.replace(/\/+$/, '');
  return `${CANONICAL_HOST}${clean}/`;
}
