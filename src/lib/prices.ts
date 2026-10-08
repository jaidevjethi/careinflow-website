/**
 * Price tokens — the bridge between `src/config/pricing.ts` and any prose
 * that has to quote a figure.
 *
 * Copy lives in MDX frontmatter, `faqs.json` and page bodies, none of which
 * can import TypeScript. Before this file existed they carried literal
 * rupee figures, and a repricing commit left nine of them stale: /services
 * published ₹40,000 for the same build /pricing published at ₹28,999, and
 * the two disagreed inside the same JSON-LD graph.
 *
 * So prose writes `{{care}}`, never `₹3,499`. `resolvePrices()` substitutes
 * at build time and throws on an unknown token, which turns a typo into a
 * failed build instead of a wrong number in front of a doctor.
 *
 * Adding a price: add it to `pricing.ts`, then expose it here. Never inline.
 */

import {
  BUILDS,
  CONTENT_PACKAGES,
  CONTENT_PIECES,
  GOOGLE_CARE,
  ONE_TIME_ITEMS,
  rupees,
  type PriceUnit,
} from '@/config/pricing';

const build = (id: string) => BUILDS.find((b) => b.id === id)!;
const oneTime = (item: string) => ONE_TIME_ITEMS.find((i) => i.item.startsWith(item))!;
const piece = (id: string) => CONTENT_PIECES.find((p) => p.id === id)!;
const pack = (id: string) => CONTENT_PACKAGES.find((p) => p.id === id)!;

/**
 * Every figure prose is allowed to name. Values are numbers, not strings, so
 * they format through `rupees()` once and read identically everywhere.
 *
 * Removing a token is how a repricing finds its own stale copy:
 * `resolvePrices()` throws on an unknown one, so a page still quoting a
 * product that no longer exists fails the build rather than the client.
 * `{{social}}` went that way on 2026-10-08, with the plan it named.
 */
export const PRICE_TOKENS = {
  /* The four website packages */
  buildPractice: build('practice-website').from,
  buildGoogle: build('practice-website-google').from,
  buildSeo: build('healthcare-seo').from,
  buildMulti: build('multi-specialty').from,

  /* Monthly */
  careGoogle: GOOGLE_CARE.monthly,

  /* Healthcare content: single pieces */
  reel: piece('reel').price,
  reelAdvanced: piece('reelAdvanced').price,
  reelComplex: piece('reelComplex').price,
  post: piece('post').price,
  flyer: piece('flyer').price,
  carousel: piece('carousel').price,
  carouselResearch: piece('carouselResearch').price,

  /* Healthcare content: monthly packages, regular and introductory */
  contentStarter: pack('content-starter').monthly,
  contentStarterIntro: pack('content-starter').intro,
  contentGrowth: pack('content-growth').monthly,
  contentGrowthIntro: pack('content-growth').intro,
  contentPlus: pack('content-plus').monthly,
  contentPlusIntro: pack('content-plus').intro,

  /* One-time */
  gbpRebuild: oneTime('Google Business Profile rebuild').price,
  takeoverAudit: oneTime('Website takeover audit').price,
  extraPage: oneTime('Extra treatment').price,
  gujarati: oneTime('Gujarati version').price,
} as const satisfies Record<string, number>;

export type PriceToken = keyof typeof PRICE_TOKENS;

const TOKEN_PATTERN = /\{\{(\w+)\}\}/g;

/**
 * Replace `{{token}}` with its formatted figure. Throws on an unknown token
 * so the build fails loudly rather than shipping `{{cre}}` to a client.
 */
export function resolvePrices(text: string): string {
  return text.replace(TOKEN_PATTERN, (_match, token: string) => {
    const value = PRICE_TOKENS[token as PriceToken];
    if (value === undefined) {
      throw new Error(
        `Unknown price token "{{${token}}}" in copy. Known tokens: ${Object.keys(PRICE_TOKENS).join(', ')}`,
      );
    }
    return rupees(value);
  });
}

/**
 * The published starting price for each service page, keyed by the `ref` its
 * MDX frontmatter carries. The figure itself is never written in the MDX —
 * only the key — so a service page cannot disagree with /pricing.
 *
 * Each page quotes its own product, the thing a visitor arriving there could
 * actually buy: the Google page the one-time rebuild, the local SEO page the
 * monthly plan that does the work. Website Care has no entry, because it is
 * priced to the site; its page says so instead of naming a figure.
 */
export const SERVICE_PRICES = {
  /** Healthcare websites — the Foundation Website. */
  build: { from: PRICE_TOKENS.buildPractice, unit: 'project' },
  /** Local SEO — the monthly plan that does it, Local SEO & Google Care. */
  seo: { from: PRICE_TOKENS.careGoogle, unit: 'month' },
  /** Google Business Profile — the one-time rebuild. */
  gbp: { from: PRICE_TOKENS.gbpRebuild, unit: 'once' },
  /** Healthcare content — the smallest monthly package, at its regular price. */
  content: { from: PRICE_TOKENS.contentStarter, unit: 'month' },
  /** Reel editing — one standard healthcare reel. */
  reel: { from: PRICE_TOKENS.reel, unit: 'piece' },
} as const satisfies Record<string, { from: number; unit: PriceUnit }>;

export type PriceRef = keyof typeof SERVICE_PRICES;

/** The keys, for the zod enum in `content.config.ts`. */
export const PRICE_REFS = Object.keys(SERVICE_PRICES) as [PriceRef, ...PriceRef[]];
