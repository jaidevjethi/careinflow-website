import type { APIRoute } from 'astro';
import { CANONICAL_HOST, IS_CANONICAL_HOST } from '@/config/site';

/**
 * `Astro.site` excludes `base`, so `new URL('sitemap-index.xml', site)` pointed
 * the GitHub Pages mirror at jaidevjethi.github.io/sitemap-index.xml — a 404,
 * one directory above where the file actually lives.
 *
 * The sitemap that matters is the production one either way: CANONICAL_HOST is
 * what every page declares, so that is the sitemap to advertise — and only
 * from the host that serves it. A `Sitemap:` line on the mirror points at a
 * file on another host, which Google ignores unless that host is verified in
 * the same property, so it is noise there and is left out.
 *
 * Crawling stays allowed on the mirror. Its pages carry `noindex, follow`
 * (see SEO.astro), and a `noindex` a crawler is not allowed to fetch is a
 * `noindex` that never gets read — blocking here would keep the mirror out of
 * the index less reliably, not more.
 */
export const GET: APIRoute = () => {
  const lines = ['User-agent: *', 'Allow: /', ''];

  if (IS_CANONICAL_HOST) {
    lines.push(`Sitemap: ${CANONICAL_HOST}/sitemap-index.xml`, '');
  } else {
    lines.push(
      '# Deploy mirror. Every page here is noindex and canonicalises to',
      `# ${CANONICAL_HOST}, which is where the sitemap is advertised.`,
      '',
    );
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
