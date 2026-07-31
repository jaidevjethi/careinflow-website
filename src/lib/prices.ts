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
  ONE_TIME_ITEMS,
  PLANS,
  STANDALONE_MONTHLY,
  partsTotal,
  rupees,
  type PriceUnit,
} from '@/config/pricing';

const build = (id: string) => BUILDS.find((b) => b.id === id)!;
const plan = (id: string) => PLANS.find((p) => p.id === id)!;
const oneTime = (item: string) => ONE_TIME_ITEMS.find((i) => i.item.startsWith(item))!;

/**
 * Every figure prose is allowed to name. Values are numbers, not strings, so
 * they format through `rupees()` once and read identically everywhere.
 */
export const PRICE_TOKENS = {
  /* Builds */
  build: build('single-practice').from,
  buildTypicalTo: build('single-practice').typicalTo,
  buildEstablished: build('established-clinic').from,
  buildMulti: build('multi-specialty').from,
  buildMax: build('multi-specialty').typicalTo,

  /* Monthly, bought on its own */
  care: STANDALONE_MONTHLY.care,
  gbp: STANDALONE_MONTHLY.gbp,
  seo: STANDALONE_MONTHLY.seo,
  social: STANDALONE_MONTHLY.social,

  /* Monthly plans, and what their parts cost separately */
  careGoogle: plan('care-google').monthly,
  careGoogleParts: partsTotal(plan('care-google')),
  fullVisibility: plan('full-visibility').monthly,
  fullVisibilityParts: partsTotal(plan('full-visibility')),

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
 */
export const SERVICE_PRICES = {
  build: { from: PRICE_TOKENS.build, unit: 'project' },
  seo: { from: PRICE_TOKENS.seo, unit: 'month' },
  gbp: { from: PRICE_TOKENS.gbp, unit: 'month' },
  care: { from: PRICE_TOKENS.care, unit: 'month' },
  social: { from: PRICE_TOKENS.social, unit: 'month' },
} as const satisfies Record<string, { from: number; unit: PriceUnit }>;

export type PriceRef = keyof typeof SERVICE_PRICES;

/** The keys, for the zod enum in `content.config.ts`. */
export const PRICE_REFS = Object.keys(SERVICE_PRICES) as [PriceRef, ...PriceRef[]];
