/**
 * Published prices. The single source of truth.
 *
 * Every number a visitor can read on the site comes from this file, so the
 * pricing page, the service pages, the homepage strip, the FAQs and the
 * JSON-LD offers can never drift apart. Change a number here and it changes
 * everywhere, including in structured data.
 *
 * Positioning rules that these numbers must keep honouring:
 * - Published figures are *starting points* for a described scope. The real
 *   number is fixed in writing after the free review.
 * - No discounts, no offers, no countdowns.
 * - Every package says what the studio is responsible for and what it is not.
 *   That is the point of the ladder below: the price buys a stated amount of
 *   the local-search problem, not a promise about where a practice ranks.
 */

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,10,000. Indian digit grouping, which is how clients here read money. */
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
 * Website packages. One-time, fixed price
 *
 * Four steps of one ladder, and the step is defined by how much the studio
 * does rather than by page count. Each one says so in a sentence a doctor can
 * read, because the failure mode this replaces is a client buying a website
 * and reading it as a promise about rankings.
 * ---------------------------------------------------------------------- */

export interface Build {
  id: string;
  name: string;
  /** Who this shape of practice actually is. */
  suits: string;
  from: number;
  /** Upper end of the usual range. Absent when the package is quoted. */
  typicalTo?: number;
  /**
   * A floor rather than a range: the price depends on doctors, specialties,
   * locations and content, so the card says "from" and stops. Publishing a
   * fake upper bound on a genuinely custom project is the one dishonest thing
   * this page could do.
   */
  custom?: boolean;
  timeline: string;
  pages: string;
  /** One line naming what the studio takes on. Written for a doctor, not a marketer. */
  responsibility: string;
  /** Stated with the same weight as what is included. */
  excludes: string;
  /** Our recommendation. Not a claim about what other practices chose. */
  recommended?: boolean;
}

export const BUILDS: Build[] = [
  {
    id: 'practice-website',
    name: 'Practice Website',
    suits: 'One doctor, one place, and a market where you are not fighting ten others.',
    from: 24999,
    typicalTo: 34999,
    timeline: '3 weeks',
    pages: 'Up to 5 pages',
    responsibility: 'We build the website and set it up so Google can find it.',
    excludes:
      'Does not include us looking after your Google listing every month, a page for every treatment, or any promise about where you rank.',
  },
  {
    id: 'practice-website-google',
    name: 'Practice Website + Google',
    suits: 'Most practices here. You want a website, and you want patients to find it.',
    from: 39999,
    typicalTo: 54999,
    timeline: '4–5 weeks',
    pages: 'Up to 10 pages',
    responsibility: 'We build the website and fix your Google listing to match it.',
    recommended: true,
    excludes:
      'Does not include monthly work after the first 90 days, a Gujarati version, or more than one location.',
  },
  {
    id: 'healthcare-seo',
    name: 'Healthcare Website + Local SEO',
    suits: 'An established practice that wants to be found for particular treatments.',
    from: 64999,
    typicalTo: 84999,
    timeline: '6–7 weeks',
    pages: 'Up to 18 pages',
    responsibility: 'We work out what patients search for, then build the site to answer it.',
    excludes:
      'Does not include paid ads, apps or more than one location. We do not offer the first two at all.',
  },
  {
    id: 'multi-specialty',
    name: 'Multi-Specialty + Local SEO',
    suits: 'Several doctors or departments, a diagnostic centre, or more than one branch.',
    from: 89999,
    custom: true,
    timeline: 'Agreed with the scope',
    pages: 'As many as it needs',
    responsibility: 'We plan and build the whole thing, department by department.',
    excludes:
      'The price depends on how many doctors, departments, treatments and branches you have. We quote it after the free review.',
  },
];

/* -------------------------------------------------------------------------
 * What is in each package
 *
 * One table, not four lists. Four lists made a reader hold ten lines in their
 * head to work out what the next package added; a row read across answers it
 * at a glance, which is the whole job of this section.
 *
 * It is also the single source: `llms.txt` builds each package's inclusion
 * list from these rows, so the page a person reads and the file an AI quotes
 * cannot drift apart.
 *
 * A cell is `true` (included), `false` (not included) or a short string where
 * the answer is a quantity rather than a yes.
 * ---------------------------------------------------------------------- */

export interface MatrixRow {
  label: string;
  /** One value per package, in BUILDS order. */
  values: Array<boolean | string>;
}

export interface MatrixGroup {
  group: string;
  rows: MatrixRow[];
}

export const PACKAGE_MATRIX: MatrixGroup[] = [
  {
    group: 'The website',
    rows: [
      { label: 'Designed around your practice, never a template', values: [true, true, true, true] },
      { label: 'How many pages', values: ['Up to 5', 'Up to 10', 'Up to 18', 'As many as it needs'] },
      { label: 'Works properly on a phone', values: [true, true, true, true] },
      { label: 'Words written for worried patients, not for us', values: [true, true, true, true] },
      { label: 'WhatsApp, tap-to-call and directions on every page', values: [true, true, true, true] },
      { label: 'A page for each treatment you offer', values: [false, true, true, true] },
      { label: 'Answers to the questions patients keep asking', values: [false, true, true, true] },
      { label: 'A page for each doctor', values: [false, false, true, true] },
      { label: 'A section for each department', values: [false, false, false, true] },
      { label: 'Pages for more than one branch', values: [false, false, false, true] },
    ],
  },
  {
    group: 'Being found on Google',
    rows: [
      { label: 'We check your Google listing before we start', values: [true, true, true, true] },
      { label: 'We find the words patients type', values: ['Your town', 'Town and treatments', 'In depth', 'In depth'] },
      { label: 'Your listing rebuilt: categories, services, hours, photos', values: [false, true, true, true] },
      { label: 'Listing and website made to say the same thing', values: [true, true, true, true] },
      { label: 'We look at the practices ranking above you', values: [false, true, true, true] },
      { label: 'We choose which treatments you should compete for', values: [false, false, true, true] },
      { label: 'A page for the towns you serve', values: [false, false, true, true] },
      { label: 'A way to ask happy patients for reviews', values: [false, true, true, true] },
      { label: 'Set up so Google can read and quote your pages', values: [true, true, true, true] },
    ],
  },
  {
    group: 'Speed, and after launch',
    rows: [
      { label: 'Timed on a mid-range Android before it goes live', values: [true, true, true, true] },
      { label: 'Google Search Console set up and handed over', values: [true, true, true, true] },
      { label: 'How long it takes', values: ['3 weeks', '4–5 weeks', '6–7 weeks', 'Agreed with you'] },
      { label: 'Help after launch, included', values: [false, '90 days', '90 days', '90 days'] },
    ],
  },
];

/** Every row, flattened — for `llms.txt` and anything else that wants prose. */
export const matrixFor = (index: number): string[] =>
  PACKAGE_MATRIX.flatMap((g) =>
    g.rows
      .filter((r) => r.values[index])
      .map((r) => (typeof r.values[index] === 'string' ? `${r.label}: ${r.values[index]}` : r.label)),
  );

/**
 * Why the build prices are what they are. The sites are hand-built and
 * static, with no application to maintain, so the studio does not charge
 * like a software project. What is actually being sold, and what
 * decides whether a clinic site earns anything, is the layer above the code.
 */
export const WHERE_RETURN_COMES_FROM = {
  headline: 'Building the site is the easy part. Deciding what goes on it is not.',
  lede:
    'A clinic website does not pay for itself by being built well. It pays for itself by taking a worried patient from a search to a message without losing them on the way. That is where most of our time goes, and it is why our prices are lower than an agency charging for the same work.',
  points: [
    {
      title: 'The path from landing to enquiry',
      text: 'A patient arrives in a hurry, usually at night, usually worried. What they see first, what they read next, and how few taps it takes to reach you decides everything. We plan that path before a single screen is designed.',
    },
    {
      title: 'The words on the page',
      text: 'Most clinic websites describe the clinic. Yours has to answer what the patient arrived worrying about. What this costs. Whether it hurts. How long it takes. When to come in urgently. Writing that honestly is the bulk of the work, and it is included.',
    },
    {
      title: 'Deciding what to be found for',
      text: 'A page exists because someone is searching for what is on it. Working out which treatments those are, and which ones a nearby practice already answers better, is research rather than design. It is the main thing that separates our packages.',
    },
    {
      title: 'What happens after they message',
      text: 'A good site with no follow-through earns nothing. The enquiry arrives on WhatsApp where you will actually see it, already carrying what the patient was reading, so you are not starting the conversation cold.',
    },
    {
      title: 'Brand alignment',
      text: 'A site that feels like a different practice from the one a patient walks into breaks trust quietly. We match the site to your signage, your reception and the way you already speak to patients, so it is the same practice in both places.',
    },
    {
      title: 'Build quality you can measure',
      text: 'Built by hand and timed on an ordinary Android phone, not on our own fast laptops. Every claim we make is one you can check on the site you are reading right now.',
    },
  ],
  closing:
    'The sites are hand-built and static. Nothing to break, and nearly nothing to host. We do not price them like software, because they are not software. You are paying for the decisions, not the code.',
};

/* -------------------------------------------------------------------------
 * The Google audit that starts every project
 *
 * Mandatory, whether or not the practice ever buys monthly management. You
 * cannot sensibly build a site for a practice whose listing is unverified,
 * duplicated or pointing at the wrong address, and finding that out after
 * launch is finding it out too late.
 * ---------------------------------------------------------------------- */

export const GBP_AUDIT = {
  headline: 'Every project starts with a look at your Google listing.',
  lede:
    'Before we design anything, we go through your Google listing line by line. It is part of every package, including the smallest, because for most patients your listing is the first thing they see, not your website.',
  checks: [
    'Is the profile verified?',
    'Is the business name exactly right?',
    'Is the address right?',
    'Is the phone number right?',
    'Is the primary category the correct one?',
    'Are the secondary categories sensible?',
    'Does it link to the right website?',
    'Are the hours right?',
    'Are the services listed?',
    'Are there photographs, and are they yours?',
    'What do the reviews say, and does anyone reply?',
    'Are there duplicate profiles?',
    'Is the service area configured correctly?',
    'Does the listing agree with the website?',
    'What local visibility exists today?',
    'Who are the practices competing with you?',
  ],
  /**
   * The sentence that keeps a website project from being read as a ranking
   * promise. It is the most important paragraph on the pricing page.
   */
  statement:
    'A website is only one part of local search. Your Google Business Profile, your reviews, your competition, your location and your website all influence whether patients find you. That is why every CareInflow website includes a local-search foundation. We do not guarantee rankings, and nobody honestly can. What we do is make sure the website and the Google presence are properly structured, so the practice has the strongest foundation we can actually control.',
};

/* -------------------------------------------------------------------------
 * The one ongoing service
 *
 * There used to be five monthly products: care, care + Google, full
 * visibility, and Google and SEO sold separately. Five ways to buy roughly
 * one thing, which made the page a comparison exercise rather than a
 * decision. One plan, one price, and it covers the work that actually has to
 * happen every month.
 * ---------------------------------------------------------------------- */

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  summary: string;
  includes: string[];
  suits: string;
  /** Shown under the figure. */
  priceNote?: string;
  recommended?: boolean;
}

/** Monthly prices, for anything sold by the month. */
export const STANDALONE_MONTHLY = {
  careGoogle: 8999,
  social: 14999,
} as const;

/** Content updates included each month, before anything is charged extra. */
export const CARE_EDITS_PER_MONTH = 4;

export const PLANS: Plan[] = [
  {
    id: 'local-seo-google-care',
    name: 'Local SEO & Google Care',
    monthly: STANDALONE_MONTHLY.careGoogle,
    summary: 'We look after your website and your Google listing every month, and keep improving them.',
    includes: [
      'Your Google listing kept correct: services, hours, photos, updates',
      'Every review answered. We write the reply, you approve it before it goes',
      'We watch what patients searched to find you, and act on it',
      'Changes to your website whenever you need them',
      'Pages that are not working improved, based on what the numbers show',
      'One new treatment page written and published every month',
      'The site kept fast, and checked so nothing quietly breaks',
      'A report every month, in plain language, saying what we did',
    ],
    suits: 'For any practice that wants the work to carry on after the site goes live.',
    priceNote: 'Month to month, no lock-in',
    recommended: true,
  },
];

/* -------------------------------------------------------------------------
 * Social media
 *
 * Sold on its own, which it was not before. The scope is a strategy and a
 * content volume, deliberately not a fixed count of any one format — that
 * distinction is what stops "I paid for 16 posts" becoming a demand for 16
 * identical graphics.
 * ---------------------------------------------------------------------- */

export const SOCIAL = {
  monthly: STANDALONE_MONTHLY.social,
  summary:
    'Strategy-led social media for doctors and clinics: patient education, treatment awareness and the questions people actually ask.',
  includes: [
    { group: 'Strategy', items: [
      'A monthly content strategy and calendar',
      'Themes built from your specialty, your treatments and what patients need',
      'Educational and awareness topics, and treatment-focused planning',
      'FAQ and patient-question content',
      'Decisions informed by what performed last month, not guesswork',
    ] },
    { group: 'Instagram', items: [
      'Profile optimisation: bio, positioning and call to action',
      'Contact information checked',
      'Highlight structure and profile content recommendations',
    ] },
    { group: 'Content', items: [
      'Up to 4 pieces a week, around 16 a month',
      'Static posts, educational graphics, treatment posts, patient FAQs',
      'Awareness content, and practice or doctor content where it fits',
      'Simple carousels as part of the plan where they suit the topic',
    ] },
    { group: 'Reels', items: [
      '3 reel edits a month, from footage you provide',
      'Captions and subtitles, text overlays and basic hooks',
      'Formatted for Instagram',
    ] },
    { group: 'Publishing', items: [
      'Caption writing and topic research',
      'Scheduling and publishing, with a consistent presentation',
      'A monthly review of what worked, and what next month should change',
    ] },
  ],
  /** Published verbatim. It is what makes the scope enforceable. */
  strategyClause:
    'The monthly content mix is decided by the strategy. It may include static posts, carousels, educational graphics, treatment content and other suitable formats. The package is a content volume and a strategy, not a fixed number of any one format.',
  excludes: [
    'Professional, on-site photography and video shoots',
    'Doctor filming sessions, videographer costs, travel, actors or models',
    'Advanced animation and high-end motion graphics',
    'Paid advertising spend, and Meta Ads management',
    'Influencer campaigns',
    'DM and community management, and handling patient enquiries',
    'Unlimited revisions',
    'Additional platforms beyond the one agreed',
    'Research-heavy carousels beyond the agreed content capacity',
  ],
};

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
    item: 'Healthcare social media content',
    price: STANDALONE_MONTHLY.social,
    unit: 'month',
    from: true,
    note: 'Strategy, up to 4 pieces a week and 3 reel edits a month. Sold on its own or alongside anything else.',
  },
];

export const ONE_TIME_ITEMS: LineItem[] = [
  {
    item: 'Google Business Profile rebuild',
    price: 11999,
    unit: 'once',
    note: 'Claimed or verified, categories and services rebuilt, hours, photos, questions seeded, review flow set up. For a practice that wants the listing fixed without a website.',
  },
  {
    item: 'Website takeover audit',
    price: 6999,
    unit: 'once',
    note: 'For a site someone else built, before we agree to maintain it. Written, with a plan, including the plain answer if the site is beyond saving.',
  },
  {
    item: 'Extra treatment or area page',
    price: 3499,
    unit: 'page',
    note: 'After launch, per page: researched, written, designed and published. This is how a site grows past its package without renegotiating it.',
  },
  {
    item: 'Gujarati version of an existing site',
    price: 14999,
    unit: 'once',
    from: true,
    note: 'Written properly rather than machine-translated, with the language markup search engines need.',
  },
];

/** Social add-ons, quoted as ranges because the work genuinely varies. */
export const SOCIAL_ADDONS: Array<{ item: string; price: string; note: string }> = [
  {
    item: 'Complex carousel',
    price: '₹1,000–₹2,000+',
    note: 'A research-heavy or medically technical carousel is not the same production work as a static post. Quoted on slides, research, copywriting and design.',
  },
  {
    item: 'Additional reel edit',
    price: '₹1,000–₹1,500',
    note: 'Beyond the three a month, edited from footage you provide.',
  },
  {
    item: 'Meta Ads management',
    price: 'From ₹5,000 a month',
    note: 'Management only. Your ad spend is always paid by you, directly, and is never marked up.',
  },
  {
    item: 'Shoots, photography, video',
    price: 'Custom quote',
    note: 'On-site content shoots, professional photography and video production are quoted per project.',
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
    factor: 'How competitive the treatments are locally',
    effect:
      'Deciding what to compete for is research. A practice up against ten others for implants needs more of it than one that is the only physiotherapist in town.',
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
      'A listing that has never been claimed takes longer than one that is simply out of date. The audit at the start of every project tells us which you have.',
  },
];

export const NEVER_CHARGED: string[] = [
  'The written review of your online presence.',
  'The Google Business Profile audit at the start of any website project.',
  'Questions on WhatsApp, before you are a client and after.',
  'Small edits under a monthly plan: changed hours, a new doctor, a festival closure.',
  'Your domain and hosting. You pay for those directly and you own them. A domain runs about ₹1,000 a year, and hosting a site built the way we build them usually costs nothing at all.',
];

export const PRICE_NOTES: string[] = [
  'Prices are in Indian rupees and exclude GST where it applies.',
  'Published figures are starting points for the scope described. Your number is fixed in writing after the free review, and it does not move unless the scope does.',
  'The monthly plan runs month to month, with no lock-in. Paid monthly or yearly the price is the same. We do not charge extra for the flexibility, or less for the commitment.',
];

/**
 * A promise about the future rather than a deadline. No count, no countdown,
 * and nothing taken off for deciding sooner. The value is that it holds.
 */
export const PRICE_PROMISE = {
  headline: 'The price we agree is the price that holds.',
  body: 'Whatever we agree in writing stays fixed for as long as we work together, even after the studio\'s rates move. The monthly plan runs month to month with no lock-in. No deadline is ever attached to a quote, and nothing comes off the number for deciding this week instead of next.',
};

/**
 * Range used for `priceRange` in structured data. The website packages, which
 * are what the studio is engaged for — not the cheapest add-on, which would
 * describe the price level of a single extra page rather than of the business.
 */
export const PRICE_RANGE = `${rupees(BUILDS[0]!.from)}–${rupees(BUILDS[3]!.from)}+`;
