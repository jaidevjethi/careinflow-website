import type { APIRoute } from 'astro';
import { CANONICAL_HOST } from '@/config/site';

/**
 * `Astro.site` excludes `base`, so `new URL('sitemap-index.xml', site)` pointed
 * the GitHub Pages mirror at jaidevjethi.github.io/sitemap-index.xml — a 404,
 * one directory above where the file actually lives.
 *
 * The sitemap that matters is the production one either way: careinflow.com is
 * the canonical host every page declares, so that is the sitemap to advertise.
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${CANONICAL_HOST}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
