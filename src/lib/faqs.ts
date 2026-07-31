/**
 * FAQ loading, in one place.
 *
 * Seven pages used to repeat the same getCollection → map → sort chain, which
 * is how two answers ended up quoting prices the pricing page contradicted.
 * Everything now routes through here, so price tokens are resolved once and
 * the same answer text reaches the page body and the FAQPage schema.
 */

import { getCollection } from 'astro:content';
import { resolvePrices } from '@/lib/prices';

export interface Faq {
  question: string;
  answer: string;
}

/**
 * FAQs routed to a page key ("home", "pricing", "faq", …), in `order`, with
 * price tokens resolved.
 */
export async function getFaqsFor(page: string): Promise<Faq[]> {
  const entries = await getCollection('faqs', ({ data }) => data.pages.includes(page));
  return entries
    .map(({ data }) => data)
    .sort((a, b) => a.order - b.order)
    .map((f) => ({ question: f.question, answer: resolvePrices(f.answer) }));
}

/** The same treatment for FAQs written into a service's MDX frontmatter. */
export function resolveFaqs(faqs: Array<{ q: string; a: string }>): Faq[] {
  return faqs.map((f) => ({ question: f.q, answer: resolvePrices(f.a) }));
}
