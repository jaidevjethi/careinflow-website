import { CANONICAL_HOST } from '@/config/site';

/**
 * Prefix an internal path with the build's base path. All internal links go
 * through this so the GitHub Pages mirror (BASE_PATH=/careinflow-website)
 * resolves them correctly.
 */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Canonical URL for a page path — always on careinflow.com, with a trailing
 * slash to match how static hosts serve directory indexes.
 */
export function canonicalUrl(path: string): string {
  if (path === '/' || path === '') return `${CANONICAL_HOST}/`;
  const clean = path.replace(/\/+$/, '');
  return `${CANONICAL_HOST}${clean}/`;
}
