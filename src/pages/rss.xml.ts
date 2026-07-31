/**
 * RSS for the resources articles.
 *
 * Five dated guides with no feed meant nothing could subscribe to them —
 * not a reader, not an aggregator, not the newsletter tools clinic owners
 * and referral partners actually use. Cheap to publish, and it gives the
 * articles a second surface besides search.
 */

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUSINESS, CANONICAL_HOST } from '@/config/site';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('resources')).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: `${BUSINESS.name} — guides for clinic owners`,
    description:
      'Plain-language guides on how patients find and judge clinics online: Google Business Profile, local SEO, website speed, and what a clinic website actually needs.',
    // Canonical host, not the build target — the mirror should not advertise itself.
    site: CANONICAL_HOST,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishDate,
      link: `/resources/${article.id}/`,
    })),
    customData: '<language>en-IN</language>',
  });
};
