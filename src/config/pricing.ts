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
  /** Upper end of the usual range for this shape of practice. */
  typicalTo: number;
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
    from: 28999,
    typicalTo: 44999,
    timeline: '3 weeks',
    pages: 'Up to 7 pages',
    includes: [
      'The path planned first: where a patient lands, what they read, how they message you',
      'Every page written to answer what the patient came worried about',
      'Designed to match how your practice already looks and sounds',
      'Home, about, three treatment pages, contact, one area page',
      'WhatsApp enquiry with the message part-written, tap-to-call and directions',
      'Speed measured on a mid-range Android — REF <1.2s',
      'Schema, Search Console and analytics configured at launch',
    ],
    excludes:
      'Excludes ongoing Google Business Profile management, Gujarati, and more than one location.',
  },
  {
    id: 'established-clinic',
    name: 'Established clinic',
    suits: 'Several treatments, each worth its own page. The common case.',
    from: 58999,
    typicalTo: 89999,
    timeline: '4–5 weeks',
    pages: 'Up to 14 pages',
    includes: [
      'Everything in Single practice',
      'A page for every treatment, written to what patients search and worry about',
      'A separate enquiry path per treatment — an implant is not the same decision as a cleaning',
      'Three area pages for the towns you actually serve',
      'Google Business Profile rebuilt, verified and matched to the site',
      'A review flow set up for genuinely happy patients',
      'A photography shot list, so the pictures match the words',
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
    from: 109999,
    typicalTo: 179999,
    timeline: '6–8 weeks',
    pages: '20+ pages',
    includes: [
      'Everything in Established clinic',
      'Structured by department, so a patient lands where they meant to',
      'A profile page for each doctor, written to earn trust before the first visit',
      'English and Gujarati, both written properly rather than translated by machine',
      'A page and a listing for each location you run',
      'Search Console and reporting split by department',
    ],
    excludes:
      'Excludes paid advertising and app development. We do not offer either, and we will say so plainly.',
  },
];

/**
 * Why the build prices are what they are. The sites are hand-built and
 * static — there is no application to maintain — so the studio does not
 * charge like a software project. What is actually being sold, and what
 * decides whether a clinic site earns anything, is the layer above the code.
 */
export const WHERE_RETURN_COMES_FROM = {
  headline: 'The build is the cheap part. The thinking is what earns.',
  lede:
    'A clinic website does not earn its money by being built well. It earns it by taking a worried patient from a search to a message without losing them. That is where our work actually goes, and it is why the build itself does not cost what agencies usually charge for it.',
  points: [
    {
      title: 'The path from landing to enquiry',
      text: 'A patient arrives in a hurry, usually at night, usually worried. What they see first, what they read next, and how few taps it takes to reach you decides everything. We plan that path before a single screen is designed.',
    },
    {
      title: 'The words on the page',
      text: 'Most clinic websites describe the clinic. Yours has to answer what the patient came with — what this costs, whether it hurts, how long it takes, when to come in urgently. Writing that honestly is the bulk of the work, and it is included.',
    },
    {
      title: 'Brand alignment',
      text: 'A site that feels like a different practice from the one a patient walks into breaks trust quietly. We match the site to your signage, your reception and the way you already speak to patients, so it is the same practice in both places.',
    },
    {
      title: 'What happens after they message',
      text: 'A good site with no follow-through earns nothing. The enquiry arrives on WhatsApp where you will actually see it, already carrying what the patient was reading, so you are not starting the conversation cold.',
    },
  ],
  closing:
    'The sites themselves are hand-built and static — nothing to break, nearly nothing to host. We do not price them like software, because they are not software. You are paying for the decisions, not the code.',
};

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
  care: 3499,
  gbp: 5499,
  seo: 12999,
  social: 7999,
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
    monthly: 7999,
    summary: 'Both places a patient actually looks, handled together.',
    includes: [
      'Everything in Care',
      'Google Business Profile managed: categories, services, hours, photos',
      'Every review answered — drafted for your approval, never posted blind',
      'Questions on your listing watched and answered',
      'Listing details kept matched to your website, month after month',
      'Page wording and enquiry messages adjusted when something is not landing',
    ],
    suits: 'Suits most practices, and it is where we suggest starting.',
    recommended: true,
    combines: [STANDALONE_MONTHLY.care, STANDALONE_MONTHLY.gbp],
  },
  {
    id: 'full-visibility',
    name: 'Full visibility',
    monthly: 17999,
    summary: 'The whole presence, growing every month.',
    includes: [
      'Everything in Care + Google',
      'A new treatment or area page every month, researched and written',
      'The path from landing to enquiry reviewed quarterly, and changed where patients drop off',
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
    price: 11999,
    unit: 'once',
    note: 'Claimed or verified, categories and services rebuilt, hours, photos, questions seeded, review flow set up. No monthly commitment attached.',
  },
  {
    item: 'Website takeover audit',
    price: 6999,
    unit: 'once',
    note: 'For a site someone else built, before we agree to maintain it. Written, with a plan — including the plain answer if the site is beyond saving.',
  },
  {
    item: 'Extra treatment or area page',
    price: 3499,
    unit: 'page',
    note: 'After launch, per page: researched, written, designed and published.',
  },
  {
    item: 'Gujarati version of an existing site',
    price: 14999,
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
      'The largest single factor, and it is a writing cost rather than a building one. The design repeats; the words cannot, because each treatment answers a different worry.',
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
 * A promise about the future rather than a deadline. No count, no countdown,
 * and nothing taken off for deciding sooner — the value is that it holds.
 */
export const PRICE_PROMISE = {
  headline: 'The price we agree is the price that holds.',
  body: 'Whatever we agree in writing stays fixed for as long as we work together, even after the studio\'s rates move. Monthly plans run month to month with no lock-in, and no deadline is ever attached to a quote — nothing is taken off the number for deciding this week instead of next.',
};

/** Range used for `priceRange` in structured data. */
export const PRICE_RANGE = `${rupees(STANDALONE_MONTHLY.care)}–${rupees(BUILDS[2]!.typicalTo)}`;
