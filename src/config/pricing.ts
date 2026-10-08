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
 * - No discounts, no offers, no countdowns — with one published exception,
 *   the content packages' introductory rate for a new client's first three
 *   billed months (see CONTENT_PACKAGES). It is a rule every new client gets,
 *   whenever they start, and it is always shown beside the regular price.
 * - Every package says what the studio is responsible for and what it is not.
 *   That is the point of the ladder below: the price buys a stated amount of
 *   the local-search problem, not a promise about where a practice ranks.
 * - Competitive, never "the cheapest". The list was set on 2026-10-08 as the
 *   owner's final price list; change a figure here and nowhere else.
 */

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,10,000. Indian digit grouping, which is how clients here read money. */
export const rupees = (amount: number): string => `₹${inr.format(amount)}`;

/**
 * The words that go above every published figure on the site.
 *
 * A bare "FROM" reads as a footnote. Every number here is a floor for a stated
 * scope, fixed in writing only after the free review, and a reader who takes
 * ₹18,999 for the whole price and later hears another number has been
 * ambushed — which is exactly where trust is lost. One constant, so the seven
 * places that display a price cannot drift apart.
 */
export const PRICE_PREFIX = 'Starting from';

export const CURRENCY = 'INR';

export type PriceUnit = 'project' | 'month' | 'page' | 'once' | 'piece';

/** How a unit is written after a figure, in prose. */
export const unitSuffix: Record<PriceUnit, string> = {
  project: '',
  month: ' a month',
  page: ' a page',
  once: ' once',
  piece: ' each',
};

/**
 * How a unit is written beside a large figure, in the mono caption style.
 * One function, because three pages had three ternaries that each knew about
 * two units and printed "one-time" under a ₹699 reel.
 */
export const unitLabel = (unit: PriceUnit): string =>
  ({ project: 'one-time', once: 'one-time', month: '/ month', page: '/ page', piece: 'each' })[unit];

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
  /**
   * The four or five things a buyer most wants to see on the card itself.
   * The full answer is the comparison table below; a card that makes someone
   * scroll to a table to learn what they are buying has not done its job.
   */
  highlights: string[];
  /**
   * What this rung's search work actually buys, in one plain sentence.
   *
   * "SEO" against "Full SEO" means nothing to a clinic owner reading in their
   * second language, and an unanswered question is not asked, it is abandoned.
   * Every card decodes its own level here.
   */
  seoLine: string;
  /**
   * The three components every package is built from, for the icon row.
   *
   * A value string means included and says how much; `null` means not in this
   * package. Rendering the absent one dimmed rather than hiding it is what
   * makes the next rung read as something gained instead of something charged.
   */
  stack: {
    website: string;
    listing: string;
    seo: string | null;
  };
  /** Stated with the same weight as what is included. */
  excludes: string;
  /** Our recommendation. Not a claim about what other practices chose. */
  recommended?: boolean;
}

/**
 * The ladder, repriced 2026-08-19 and renamed 2026-10-08.
 *
 * The names used to list what was inside ("Website (10 pages) + Local SEO +
 * Google Business Optimisation"). They are now names a doctor can say aloud —
 * Foundation, Practice, Growth, Multi-Doctor — because the card already shows
 * the contents underneath: the page count, the three-part stack row, and the
 * highlights. Prices did not move.
 *
 * The entry package now starts at ₹18,999 and carries the Google listing
 * setup and the SEO foundations, which the old ₹24,999 entry explicitly
 * excluded. That is deliberately more for less: a practice cannot judge a
 * website in isolation, and sending one out of the door without its listing
 * set up produced exactly the outcome this studio says it exists to prevent.
 *
 * The steps are 18,999 / 34,999 / 59,999, which works out at roughly ₹3,800,
 * ₹3,500 and ₹3,333 a page. Cost per page falls as the ladder climbs, so the
 * middle rung is the best value on its own arithmetic rather than because a
 * badge says so. It still carries the badge, because it is also the one most
 * practices actually need.
 */
export const BUILDS: Build[] = [
  {
    id: 'practice-website',
    name: 'Foundation Website',
    suits: 'A doctor or small clinic that needs a professional starting website.',
    from: 18999,
    typicalTo: 24999,
    timeline: '3 weeks',
    pages: 'Up to 5 pages',
    responsibility:
      'We build the website, set your Google listing up properly, and make the two say the same thing.',
    highlights: [
      'Up to 5 pages, designed around your practice, never a template',
      'Google Business Profile claimed, verified and set up',
      'The words patients in your town actually type, researched first',
      'WhatsApp, tap-to-call and directions on every page',
      'Search Console set up and handed over, in your name',
    ],
    excludes:
      'Does not include us looking after your listing every month, a page for every treatment, or any promise about where you rank.',
    seoLine:
      'Found when someone searches your clinic by name, or looks for a clinic in your town.',
    stack: { website: '5 pages', listing: 'Set up and verified', seo: null },
  },
  {
    id: 'practice-website-google',
    name: 'Practice Website',
    suits: 'Most practices here. You want a website, and you want patients to find it.',
    from: 34999,
    typicalTo: 44999,
    timeline: '4–5 weeks',
    pages: 'Up to 10 pages',
    responsibility:
      'We build the website and rebuild your Google listing in full, so the two work as one.',
    // "Our recommendation", never "most popular": that is a fact about what
    // buyers chose, and there is no sales record behind it yet. Switch the
    // wording only when there is.
    recommended: true,
    highlights: [
      'Everything in the Foundation Website',
      'Up to 10 pages, including a page for each treatment you offer',
      'Google listing rebuilt: categories, services, hours, photos, questions',
      'A way to ask happy patients for reviews, set up and explained',
      'We look at the practices ranking above you, and tell you what we find',
      '90 days of support after launch',
    ],
    excludes:
      'Does not include monthly work after the first 90 days, a Gujarati version, or more than one location.',
    seoLine:
      'Local SEO: found when someone searches a treatment you offer, in your town.',
    stack: { website: '10 pages', listing: 'Rebuilt in full', seo: 'Local SEO' },
  },
  {
    id: 'healthcare-seo',
    name: 'Growth Website',
    suits: 'An established practice that wants to be found for particular treatments.',
    from: 59999,
    typicalTo: 74999,
    timeline: '6–7 weeks',
    pages: 'Up to 18 pages',
    responsibility:
      'We work out what patients search for, then build the site to answer it.',
    highlights: [
      'Everything in the Practice Website',
      'Up to 18 pages, including a page for each doctor',
      'We choose which treatments you should compete for, and why',
      'A page for each town you serve',
      'Keyword and competitor research in depth, written up for you',
      '90 days of support after launch',
    ],
    excludes:
      'Does not include paid ads, apps or more than one location. We do not offer the first two at all.',
    seoLine:
      'Complete SEO: found for every treatment you offer, in every town you serve.',
    stack: { website: '18 pages', listing: 'Rebuilt in full', seo: 'Complete SEO' },
  },
  {
    id: 'multi-specialty',
    name: 'Multi-Doctor / Multi-Location Website',
    suits: 'Several doctors or departments, a diagnostic centre, or more than one branch.',
    from: 89999,
    custom: true,
    timeline: 'Agreed with the scope',
    pages: 'As many as it needs',
    responsibility: 'We plan and build the whole thing, department by department.',
    highlights: [
      'Everything in the Growth Website',
      'A section for each department',
      'Pages for more than one branch, each with its own local groundwork',
      'As many treatment and doctor pages as the practice needs',
      'Scope, timeline and price agreed in writing before anything starts',
    ],
    excludes:
      'The price depends on how many doctors, departments, treatments and branches you have. We quote it after the free review.',
    seoLine: 'Complete SEO, across every department and every branch you run.',
    stack: { website: 'As many as needed', listing: 'Rebuilt in full', seo: 'Complete SEO' },
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
      { label: 'Your listing claimed, verified and set up', values: [true, true, true, true] },
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
 * After launch: two monthly plans
 *
 * Until 2026-10-08 there was one plan, and the website-care page sold it too,
 * so "care" and "Google care" were one product under two names. They are now
 * two products that answer two different practices:
 *
 *   - Local SEO & Google Care: the listing, local search and the website, kept
 *     improving every month. A published figure.
 *   - Website Care: the website alone, kept current and working. Priced to the
 *     site, because a five-page site and a thirty-page one are not the same
 *     month of work, and publishing one figure for both would be invented.
 *
 * A practice on Google Care does not need Website Care as well: website
 * updates are already inside it. Both pages say so.
 *
 * Each plan publishes exactly the work the owner listed and nothing more. The
 * site used to promise weekly uptime monitoring and quarterly written reviews;
 * neither is in either list, so neither is promised anywhere.
 * ---------------------------------------------------------------------- */

export interface Plan {
  id: string;
  name: string;
  /** Absent when the plan is priced to scope (`custom`). */
  monthly?: number;
  /** Priced after the free review. No figure is published, and no Offer is emitted. */
  custom?: boolean;
  summary: string;
  includes: string[];
  /** What the plan does not cover, stated with the same weight. */
  excludes: string;
  suits: string;
  /** Shown under the figure. */
  priceNote: string;
  recommended?: boolean;
}

export const GOOGLE_CARE: Plan & { monthly: number } = {
  id: 'local-seo-google-care',
  name: 'Local SEO & Google Care',
  monthly: 8999,
  summary:
    'We look after your Google listing, your local search and your website every month, and keep improving them.',
  includes: [
    'Your Google Business Profile maintained',
    'Services, hours and photos kept up to date',
    'Every review answered. We draft the reply, you approve it before it goes',
    'The searches patients use to find you, watched and acted on',
    'Changes to your website whenever you need them',
    'One new treatment page written and published every month',
    'Speed checked, so the site stays quick',
    'A report every month, in plain language, saying what we did',
  ],
  excludes:
    'No plan can guarantee a ranking, a position on Google Maps, enquiries, appointments, patient numbers or revenue, and this one does not.',
  suits: 'For any practice that wants the work to carry on after the site goes live.',
  priceNote: 'Month to month, no lock-in',
  recommended: true,
};

export const WEBSITE_CARE: Plan = {
  id: 'website-care',
  name: 'Website Care',
  custom: true,
  summary: 'Your website kept current and working, on a monthly plan priced to what your site needs.',
  includes: [
    'Updates to your website',
    'Doctor and clinic information changes',
    'Treatment information updates',
    'Image changes',
    'Basic technical maintenance',
    'Backups, where your hosting supports them',
    'Minor fixes we agree on',
    'New small sections or pages, within the agreed scope',
  ],
  excludes:
    'Major redesigns, complete rebuilds, large new functionality and SEO campaigns are quoted separately.',
  suits:
    'For a practice that wants its website looked after without the Google and local search work. On Local SEO & Google Care, website updates are already included.',
  priceNote: 'Custom monthly plan, quoted after the free review',
};

/** Both monthly plans, in the order they are shown. */
export const PLANS: Plan[] = [GOOGLE_CARE, WEBSITE_CARE];

/* -------------------------------------------------------------------------
 * Healthcare content
 *
 * Replaces the 14,999-a-month "social media" plan, whose scope was a strategy
 * and "up to four pieces a week". That was a volume with no edges, which for a
 * studio of one person is unbounded work at a fixed price. Everything here is
 * a count: so many reels, so many posts, so many carousels, one revision each.
 *
 * The product is not "video editing". It is a doctor's own knowledge and
 * footage turned into publish-ready, patient-facing content, and the standard
 * reel below says exactly what that means.
 * ---------------------------------------------------------------------- */

export interface LineItem {
  item: string;
  price: number;
  unit: PriceUnit;
  /** True when the figure is a starting point rather than the whole price. */
  from?: boolean;
  note: string;
}

export interface ContentPiece extends LineItem {
  /** Stable key for prices.ts tokens. */
  id: string;
}

/** Single pieces, bought one at a time. The "+" items are quoted from the figure. */
export const CONTENT_PIECES: ContentPiece[] = [
  {
    id: 'reel',
    item: 'Standard healthcare reel',
    price: 699,
    unit: 'piece',
    note: 'Up to 3 minutes, captioned in Gujarati or English, with graphics, a cover and the Instagram caption written. One revision. Usually 1–2 working days.',
  },
  {
    id: 'reelAdvanced',
    item: 'Advanced reel',
    price: 999,
    unit: 'piece',
    from: true,
    note: 'Substantially more animation, a restructured story, several source videos or unusually long footage.',
  },
  {
    id: 'reelComplex',
    item: 'Highly complex reel',
    price: 1499,
    unit: 'piece',
    from: true,
    note: 'Heavy motion graphics, advanced animation or a story rebuilt from a lot of material. Quoted on the footage before we start.',
  },
  {
    id: 'post',
    item: 'Instagram post',
    price: 399,
    unit: 'piece',
    note: 'An educational graphic, an announcement or a clinic update, with the caption written.',
  },
  {
    id: 'flyer',
    item: 'Clinic flyer or promotional design',
    price: 499,
    unit: 'piece',
    note: 'A clinic package, a health camp or an announcement, designed to share or print.',
  },
  {
    id: 'carousel',
    item: 'Carousel, up to 6 slides',
    price: 699,
    unit: 'piece',
    note: 'One topic explained across several slides.',
  },
  {
    id: 'carouselResearch',
    item: 'Research-heavy carousel',
    price: 899,
    unit: 'piece',
    from: true,
    note: 'A medically technical topic, or more slides. Quoted on the research, the slide count and the complexity.',
  },
];

/** Everything a standard healthcare reel includes, in the order a doctor asks. */
export const STANDARD_REEL_INCLUDES: string[] = [
  'A final video up to 3 minutes long',
  'Editing and pacing, so it is clear and holds attention',
  'Captions in Gujarati or English',
  'Audio cleanup',
  'Basic colour correction',
  'Graphics that support what you are saying',
  'Transitions and an end card',
  'A cover image for the reel',
  'The Instagram caption, written for you',
  'One revision',
  'Usually delivered in 1–2 working days',
];

/** When a reel stops being standard. Agreed before the edit starts, never after. */
export const ADVANCED_REEL_WHEN: string[] = [
  'Substantially more animation',
  'Restructuring the story',
  'Several source videos',
  'Unusually long raw footage',
  'Complex storytelling',
];

export interface ContentPackage {
  id: string;
  name: string;
  /** The regular monthly price — always the headline figure. */
  monthly: number;
  /** A new client's first three billed months. Never shown without `monthly`. */
  intro: number;
  reels: number;
  posts: number;
  carousels: number;
  suits: string;
  /** Our recommendation. Not a claim about what other practices chose. */
  recommended?: boolean;
}

export const CONTENT_PACKAGES: ContentPackage[] = [
  {
    id: 'content-starter',
    name: 'Content Starter',
    monthly: 5499,
    intro: 4999,
    reels: 6,
    posts: 4,
    carousels: 0,
    suits: 'Consistent content without a large monthly commitment.',
  },
  {
    id: 'content-growth',
    name: 'Content Growth',
    monthly: 7999,
    intro: 7499,
    reels: 8,
    posts: 6,
    carousels: 1,
    suits: 'About two reels a week, with posts and a carousel around them.',
    recommended: true,
  },
  {
    id: 'content-plus',
    name: 'Content Plus',
    monthly: 10999,
    intro: 9999,
    reels: 10,
    posts: 8,
    carousels: 2,
    suits: 'For a clinic that wants a stronger, steady presence every week.',
  },
];

/** How many months the introductory rate runs. */
export const CONTENT_INTRO_MONTHS = 3;

/** The introductory rule, as it is published. */
export const CONTENT_INTRO_RULE =
  'For a new client, the first three billed months are at the introductory rate. From the fourth month, the regular price applies. It is the same for everyone, whenever you start.';

/**
 * Why a package costs less than its parts, which CLAUDE.md requires a page to
 * say wherever that is true. At the published single prices Starter's pieces
 * come to 5,790, Growth's to 8,685 and Plus's to 11,580.
 */
export const CONTENT_BATCH_REASON =
  'A package costs less than the same pieces bought one at a time because a month is planned and produced as one batch: one set of templates, one hand-over of footage, one round of approvals.';

/** The counting rules, in plain words. Published, because they are the scope. */
export const CONTENT_RULES: string[] = [
  'One revision on every reel, post, flyer and carousel. Further changes are quoted before we make them.',
  'Packages are built from standard reels. If a month needs an advanced reel, we quote it before we start.',
  'A carousel is up to 6 slides. A research-heavy one is quoted on its own.',
  'You send the footage and tell us the topics. We do not film, and we do not post for you.',
];

/** Not part of any content package. "Not included", never "never". */
export const CONTENT_EXCLUDES: string[] = [
  'Filming or photography at your clinic. An on-site shoot is quoted as a custom project',
  'Posting, scheduling and day-to-day account management',
  'Replying to comments and messages',
  'Paid advertising, and ad spend',
  'Extensive scriptwriting',
  'Unlimited revisions, or unlimited motion graphics',
  'Same-day or emergency turnaround',
  'A researched content strategy or calendar',
];

/* -------------------------------------------------------------------------
 * Quoted to scope
 *
 * No published figure, on purpose: there is not yet enough of this work
 * behind the studio to know what it costs to do well, and an arbitrary number
 * would be the one invented thing on a page of real ones.
 * ---------------------------------------------------------------------- */

export const CUSTOM_PROJECTS: Array<{ item: string; note: string }> = [
  {
    item: 'On-site video or photography',
    note: 'At your clinic. Quoted on what has to be captured.',
  },
  {
    item: 'Doctor or clinic video production',
    note: 'Filmed and produced, rather than edited from your own footage.',
  },
  {
    item: 'Complex medical content, or a large creative project',
    note: 'Quoted after we have seen the material.',
  },
  {
    item: 'Anything else digital',
    note: 'Quoted after we have looked at what it involves.',
  },
];

/* -------------------------------------------------------------------------
 * Website and Google work, bought on its own
 * ---------------------------------------------------------------------- */

export const ONE_TIME_ITEMS: LineItem[] = [
  {
    item: 'Google Business Profile rebuild',
    price: 8999,
    unit: 'once',
    note: 'Set up or rebuilt: categories, services, business information, hours, photos and profile sections, questions, a review-reply workflow and local-search groundwork. The profile stays yours. For a practice that wants the listing fixed without a website.',
  },
  {
    item: 'Website takeover audit',
    price: 6999,
    unit: 'once',
    note: 'For a site someone else built, before we agree to maintain it. Written, with a plan, including the plain answer if the site is beyond saving.',
  },
  {
    item: 'Extra treatment or area page',
    price: 3999,
    unit: 'page',
    note: 'After launch, per page: researched, written, designed and published. This is how a site grows past its package without renegotiating it.',
  },
  {
    item: 'Gujarati version of an existing site',
    price: 6999,
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
  'A first look at a video you send: what the edit would involve, how long it takes and what it costs.',
  'Your domain and hosting. You pay for those directly and you own them. A domain runs about ₹1,000 a year, and hosting a site built the way we build them usually costs nothing at all.',
];

export const PRICE_NOTES: string[] = [
  'Prices are in Indian rupees and exclude GST where it applies.',
  'Published figures are starting points for the scope described. Your number is fixed in writing after the free review, and it does not move unless the scope does.',
  'Monthly plans run month to month, with no lock-in. Paid monthly or yearly the price is the same. We do not charge extra for the flexibility, or less for the commitment.',
  'Content packages start at an introductory rate for a new client\'s first three billed months, then move to the regular price. It applies to every new client, whenever you start, and it is the only reduced figure we publish.',
];

/**
 * A promise about the future rather than a deadline. No count, no countdown,
 * and nothing taken off for deciding sooner. The value is that it holds.
 *
 * The content packages' introductory rate does not break it: the step from
 * the introductory figure to the regular one is written into the agreement on
 * day one, so it is part of the price that holds rather than a change to it.
 */
export const PRICE_PROMISE = {
  headline: 'The price we agree is the price that holds.',
  body: 'Whatever we agree in writing stays fixed for as long as we work together, even after the studio\'s rates move. On a content package, that agreement already includes the step from the introductory rate to the regular one. Monthly plans run month to month with no lock-in. No deadline is ever attached to a quote, and nothing comes off the number for deciding this week instead of next.',
};

/**
 * Range used for `priceRange` in structured data: from a standard healthcare
 * reel, which is what a practice most often starts with now, to the floor of
 * the largest website. Not the single post, which describes the price of one
 * graphic rather than the price level of the business.
 */
export const PRICE_RANGE = `${rupees(CONTENT_PIECES.find((p) => p.id === 'reel')!.price)}–${rupees(BUILDS[3]!.from)}+`;
