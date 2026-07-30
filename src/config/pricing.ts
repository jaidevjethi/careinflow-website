/**
 * Published prices — the single source of truth.
 *
 * Every number a visitor can read on the site comes from this file, so the
 * pricing page, the service pages, the homepage strip, the FAQs and the
 * JSON-LD offers can never drift apart. Change a number here and it changes
 * everywhere, including in structured data.
 *
 * Positioning rules that these numbers must keep honouring:
 * - Published figures are *starting points* for a described scope. The real
 *   number is fixed in writing after the free review.
 * - No discounts, no offers, no countdowns. Where a combined plan costs less
 *   than its parts, that is because the work genuinely overlaps — and the
 *   site says so in those words.
 */

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,10,000 — Indian digit grouping, which is how clients here read money. */
export const rupees = (amount: number): string => `₹${inr.format(amount)}`;

export const CURRENCY = 'INR';

export type PriceUnit = 'project' | 'month' | 'page' | 'once';

/** How a unit is written after a figure, in prose. */
export const unitSuffix: Record<PriceUnit, string> = {
  project: '',
  month: ' a month',
  page: ' a page',
  once: ' once',
};

/* -------------------------------------------------------------------------
 * Website builds — one-time, fixed price
 * ---------------------------------------------------------------------- */

export interface Build {
  id: string;
  name: string;
  /** Who this shape of practice actually is. */
  suits: string;
  from: number;
  timeline: string;
  pages: string;
  includes: string[];
  /** Stated with the same weight as the inclusions. */
  excludes: string;
  /** Our recommendation — not a claim about what other practices chose. */
  recommended?: boolean;
}

export const BUILDS: Build[] = [
  {
    id: 'single-practice',
    name: 'Single practice',
    suits: 'One doctor, one location, a few treatments that matter most.',
    from: 55000,
    timeline: '3 weeks',
    pages: 'Up to 7 pages',
    includes: [
      'Custom design around your practice — never a template',
      'Home, about, three treatment pages, contact, one area page',
      'Words written for you, corrected by you before publishing',
      'WhatsApp enquiry, tap-to-call and directions on every page',
      'Speed measured on a mid-range Android — REF <1.2s',
      'Schema, Search Console and analytics configured at launch',
      'Two rounds of changes before we go live',
    ],
    excludes:
      'Excludes ongoing Google Business Profile management, Gujarati, and more than one location.',
  },
  {
    id: 'established-clinic',
    name: 'Established clinic',
    suits: 'Several treatments, each worth its own page. The common case.',
    from: 110000,
    timeline: '4–5 weeks',
    pages: 'Up to 14 pages',
    includes: [
      'Everything in Single practice',
      'A page for every treatment you offer, written to what patients search',
      'Three area pages for the towns you actually serve',
      'Google Business Profile rebuilt, verified and matched to the site',
      'A review flow set up for genuinely happy patients',
      'A photography shot list you can hand to your own photographer',
      'The first month of Care included, so the launch is watched',
    ],
    excludes:
      'Excludes Gujarati translation, a profile page per doctor, and SEO work beyond the launch groundwork.',
    recommended: true,
  },
  {
    id: 'multi-specialty',
    name: 'Multi-specialty',
    suits: 'Several doctors or departments, or a diagnostic centre.',
    from: 195000,
    timeline: '6–8 weeks',
    pages: '20+ pages',
    includes: [
      'Everything in Established clinic',
      'Structured by department, so a patient lands where they meant to',
      'A profile page for each doctor, with their own schema',
      'English and Gujarati, both written properly rather than translated by machine',
      'A page and a listing for each location you run',
      'Search Console and reporting split by department',
    ],
    excludes:
      'Excludes paid advertising and app development. We do not offer either, and we will say so plainly.',
  },
];

/* -------------------------------------------------------------------------
 * Monthly plans — month to month
 * ---------------------------------------------------------------------- */

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  summary: string;
  includes: string[];
  suits: string;
  recommended?: boolean;
  /** Standalone prices this plan combines, for the arithmetic note. */
  combines?: number[];
  /** Shown under the figure when the plan combines nothing, so cards align. */
  priceNote?: string;
}

/** Standalone monthly prices, for practices we did not build a site for. */
export const STANDALONE_MONTHLY = {
  care: 4500,
  gbp: 6500,
  seo: 16000,
  social: 9500,
} as const;

export const PLANS: Plan[] = [
  {
    id: 'care',
    name: 'Care',
    monthly: STANDALONE_MONTHLY.care,
    summary: 'Your website kept working, current and fast.',
    includes: [
      'Uptime and performance monitored weekly',
      'Security updates and off-site backups monthly',
      'Content edits — hours, doctors, treatments — as often as you need',
      'Speed re-measured against its reference quarterly',
      'A written quarterly review, in plain language',
    ],
    suits: 'Suits a practice whose Google listing is already handled properly.',
    priceNote: 'Month to month, no lock-in',
  },
  {
    id: 'care-google',
    name: 'Care + Google',
    monthly: 9500,
    summary: 'Both places a patient actually looks, handled together.',
    includes: [
      'Everything in Care',
      'Google Business Profile managed: categories, services, hours, photos',
      'Every review answered — drafted for your approval, never posted blind',
      'Questions on your listing watched and answered',
      'Listing details kept matched to your website, month after month',
    ],
    suits: 'Suits most practices, and it is where we suggest starting.',
    recommended: true,
    combines: [STANDALONE_MONTHLY.care, STANDALONE_MONTHLY.gbp],
  },
  {
    id: 'full-visibility',
    name: 'Full visibility',
    monthly: 22000,
    summary: 'The whole presence, growing every month.',
    includes: [
      'Everything in Care + Google',
      'A new treatment or area page every month, researched and published',
      'Technical SEO maintained as the site grows',
      'Search Console watched — you see exactly the data we see',
      'Directory and citation details corrected as they drift',
      'AI answer readiness kept current as your treatments change',
    ],
    suits:
      'Suits practices competing for patients in Ahmedabad or Gandhinagar, or growing into new towns.',
    combines: [STANDALONE_MONTHLY.care, STANDALONE_MONTHLY.gbp, STANDALONE_MONTHLY.seo],
  },
];

/** Sum of a plan's parts bought separately — used for the arithmetic note. */
export const partsTotal = (plan: Plan): number =>
  (plan.combines ?? []).reduce((sum, n) => sum + n, 0);

/* -------------------------------------------------------------------------
 * Everything bought on its own
 * ---------------------------------------------------------------------- */

export interface LineItem {
  item: string;
  price: number;
  unit: PriceUnit;
  /** True when the figure is a starting point rather than the whole price. */
  from?: boolean;
  note: string;
}

export const STANDALONE_ITEMS: LineItem[] = [
  {
    item: 'Google Business Profile management',
    price: STANDALONE_MONTHLY.gbp,
    unit: 'month',
    note: 'The full listing service, without a website from us.',
  },
  {
    item: 'Local SEO',
    price: STANDALONE_MONTHLY.seo,
    unit: 'month',
    note: 'Pages, technical work and reporting on a site someone else built.',
  },
  {
    item: 'Social media content',
    price: STANDALONE_MONTHLY.social,
    unit: 'month',
    note: 'A support service, added to a plan. We will not sell it first.',
  },
];

export const ONE_TIME_ITEMS: LineItem[] = [
  {
    item: 'Google Business Profile rebuild',
    price: 15000,
    unit: 'once',
    note: 'Claimed or verified, categories and services rebuilt, hours, photos, questions seeded, review flow set up. No monthly commitment attached.',
  },
  {
    item: 'Website takeover audit',
    price: 9500,
    unit: 'once',
    note: 'For a site someone else built, before we agree to maintain it. Written, with a plan — including the plain answer if the site is beyond saving.',
  },
  {
    item: 'Extra treatment or area page',
    price: 4500,
    unit: 'page',
    note: 'After launch, per page: researched, written, designed and published.',
  },
  {
    item: 'Gujarati version of an existing site',
    price: 18000,
    unit: 'once',
    from: true,
    note: 'Written properly rather than machine-translated, with the language markup search engines need.',
  },
];

/* -------------------------------------------------------------------------
 * The honest edges of the price
 * ---------------------------------------------------------------------- */

export const PRICE_MOVERS: Array<{ factor: string; effect: string }> = [
  {
    factor: 'How many treatments need their own page',
    effect:
      'The largest single factor. Every page is researched, written and designed, so ten treatments is not the same job as three.',
  },
  {
    factor: 'Gujarati as well as English',
    effect:
      'Roughly a third again on a build, because every page is written twice and neither version can read like a translation.',
  },
  {
    factor: 'More than one location',
    effect:
      'Each location needs its own page, its own listing and its own local groundwork.',
  },
  {
    factor: 'Whether photographs of your clinic exist',
    effect:
      'Real photographs change how a site feels. If you have none, we plan a shot list for your photographer rather than buy stock images.',
  },
  {
    factor: 'The state of your Google listing today',
    effect:
      'A listing that has never been claimed takes longer than one that is simply out of date. The free review tells us which you have.',
  },
];

export const NEVER_CHARGED: string[] = [
  'The written review of your online presence.',
  'Questions on WhatsApp — before you are a client, and after.',
  'Small edits under a care plan: changed hours, a new doctor, a festival closure.',
  'Your domain and hosting. You pay those directly and own them — a domain is around ₹1,000 a year, and hosting a site built the way we build them usually costs nothing at all.',
];

export const PRICE_NOTES: string[] = [
  'Prices are in Indian rupees and exclude GST where it applies.',
  'Published figures are starting points for the scope described. Your number is fixed in writing after the free review, and it does not move unless the scope does.',
  'Monthly plans run month to month, with no lock-in. Paid monthly or yearly the price is the same — we do not charge extra for the flexibility, or less for the commitment.',
];

/**
 * Founding terms. Deliberately a promise about the future rather than a
 * deadline: the founding-five count is real and stated plainly, never dressed
 * as pressure.
 */
export const FOUNDING_TERMS = {
  headline: 'Founding prices are held, not discounted.',
  body: 'These are founding prices. For the five founding practices they stay fixed for as long as we work together, even after the studio\'s rates move. That is the whole of it — no deadline, no countdown, and nothing taken off the number if you decide this week instead of next.',
};

/** Range used for `priceRange` in structured data. */
export const PRICE_RANGE = `${rupees(STANDALONE_MONTHLY.care)}–${rupees(BUILDS[2]!.from)}+`;
