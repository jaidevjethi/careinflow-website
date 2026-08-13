/**
 * Single source of truth for business facts, URLs, and navigation.
 * Canonical URLs always use CANONICAL_HOST, including on the GitHub Pages
 * mirror, so search engines treat one host as the one real site.
 *
 * That host is the **www** subdomain. Cloudflare serves the site there and
 * 301s the apex to it, so a canonical on the bare domain pointed every page
 * at a URL that redirects — telling Google the preferred address is one it
 * has to be forwarded away from. Change this and the canonicals, `og:url`,
 * sitemap, robots.txt, llms.txt and every JSON-LD `@id` move with it.
 */

export const CANONICAL_HOST = 'https://www.careinflow.com';

/**
 * True only for the build that is actually served on CANONICAL_HOST.
 *
 * The GitHub Pages mirror publishes the same 37 pages on a second host. Their
 * canonicals point here, which is most of the defence, but a canonical is a
 * hint and a second crawlable copy of a small site is a liability with no
 * upside — the mirror exists as a deploy fallback, not as an audience. On a
 * non-canonical build every page goes out `noindex, follow` and robots.txt
 * disallows everything, so production is the only copy that can be indexed.
 *
 * `import.meta.env.SITE` is whatever `site` was set to in astro.config, which
 * the mirror workflow overrides via the SITE environment variable.
 */
export const IS_CANONICAL_HOST = import.meta.env.SITE === CANONICAL_HOST;

export const BUSINESS = {
  name: 'CareInflow',
  legalName: 'CareInflow',
  tagline:
    'Healthcare-focused web design and digital growth studio in Mehsana, Gujarat',
  founder: 'Jaidev Jethi',
  /**
   * WhatsApp and the phone are the two routes the site actually pushes — they
   * are how clinic owners here reach a supplier, and a message on WhatsApp
   * gets answered faster than an inbox ever does. BOOKING_URL below is the
   * third and quietest: a time in the diary for anyone who would rather talk
   * than type. If you add another route, search for "two" first — several
   * pages state the count as a fact.
   */
  /** E.164, displayed as +91 97734 56668 */
  phone: '+919773456668',
  phoneDisplay: '+91 97734 56668',
  /**
   * The mailbox behind the Google account that owns the Business Profile.
   *
   * Published in structured data and in llms.txt, because a LocalBusiness that
   * declares no way to write to it is a thinner entity than one that does, and
   * because directories that hold a different address need a source to be
   * corrected against. Deliberately NOT promoted as a contact route in the
   * page copy: the funnel is WhatsApp first by design, and an inbox competing
   * with it would slow the one thing that gets answered same-day.
   */
  email: 'careinflow.support@gmail.com',
  address: {
    street: 'F-27, Platinum Plaza, Radhanpur Rd',
    locality: 'Mehsana',
    region: 'Gujarat',
    postalCode: '384005',
    country: 'IN',
  },
  /**
   * Studio coordinates, taken from the Google Business Profile pin itself so
   * the schema and the listing agree. They were 23.5985, 72.3693 until the
   * listing existed to check against — 2.9km out, which is a different part
   * of Mehsana. A `LocalBusiness` whose geo disagrees with its own listing is
   * publishing a contradiction about the one fact local search is built on.
   */
  geo: { latitude: 23.6174258, longitude: 72.3491067 },
  /**
   * Published hours. Stated because a LocalBusiness without them is a weaker
   * local-search entity, and because a doctor deciding when to ring should
   * not have to guess.
   */
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '11:00',
    closes: '19:30',
  },
  /**
   * Areas served, Mehsana first (home base), then roughly outward.
   *
   * Rajkot is last and deliberately so: it is Saurashtra rather than North
   * Gujarat and around 250km out, which makes it the one name here a reader
   * might reasonably query. Its page says so in the opening line.
   *
   * Every name in this list must have a page at `/areas/<lowercased>` — the
   * footer links all of them unconditionally, so a name added here before its
   * page exists is a dead link on every page of the site. `check-areas.mjs`
   * fails the build on exactly that.
   */
  serviceAreas: [
    'Mehsana',
    'Ahmedabad',
    'Gandhinagar',
    'Visnagar',
    'Unjha',
    'Patan',
    'Kalol',
    'Siddhpur',
    'Palanpur',
    'Rajkot',
  ],
} as const;

/**
 * Opening hours as a reader sees them, derived from `BUSINESS.hours` rather
 * than written out again.
 *
 * The day range used to be the string "Monday to Saturday", typed by hand into
 * the footer, /contact and llms.txt while the times came from config. So when
 * the hours changed, three pages kept the old days and the schema had the new
 * ones — the same drift the address had, and the reason a listing and a site
 * stop agreeing. Both now come from one place.
 *
 * 24-hour values stay in `BUSINESS.hours` because that is what schema.org's
 * `openingHoursSpecification` requires. These are for prose only.
 */
const clock = (t: string): string => {
  const [h = '0', m = '00'] = t.split(':');
  const hour = Number(h);
  const suffix = hour < 12 ? 'am' : 'pm';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${m === '00' ? '' : `:${m}`}${suffix}`;
};

/** "Monday to Friday" — first and last of the open days. */
export const HOURS_DAYS = `${BUSINESS.hours.days[0]} to ${BUSINESS.hours.days.at(-1)}`;

/** "11am to 7:30pm" */
export const HOURS_TIMES = `${clock(BUSINESS.hours.opens)} to ${clock(BUSINESS.hours.closes)}`;

/** "11am to 7:30pm, Monday to Friday" */
export const HOURS_LABEL = `${HOURS_TIMES}, ${HOURS_DAYS}`;

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.phone.replace('+', '')}`;

/**
 * The studio's Instagram. A profile, not a contact route — it is deliberately
 * kept out of the "Reach us" list, which states three ways to reach the studio
 * and is quoted as a count elsewhere.
 */
export const INSTAGRAM_URL = 'https://www.instagram.com/careinflowindia/';
export const INSTAGRAM_HANDLE = '@careinflowindia';

/**
 * Scheduling link, for visitors who would rather book a time than send a
 * message. Linked, never embedded: an embed would load third-party scripts,
 * which the CSP forbids and which /privacy promises the site does not do.
 */
export const BOOKING_URL = 'https://calendly.com/careinflow';

/**
 * The Google Business Profile listing.
 *
 * This is the `cid` form rather than the `maps.app.goo.gl` short link or the
 * long `/maps/place/…` URL. The short link is a redirect that Google can
 * retire; the long one carries a session token and a viewport that change
 * every time it is copied. The CID is the listing's permanent identifier, so
 * it is the form that belongs in structured data.
 */
export const GBP_URL = 'https://www.google.com/maps?cid=4850821887290042955';

/** Place feature id, for the embed and anything else that needs the pin. */
export const GBP_PLACE_ID = '0x395c43110e8cd923:0x435194ce449cea4b';

/**
 * The Open Location Code the listing itself publishes. Read off the profile
 * rather than derived, so it is the same string Google prints — a second,
 * independent way to state where this studio is that does not depend on the
 * street address being parsed correctly.
 */
export const PLUS_CODE = 'J88X+XJ Mehsana, Gujarat';

/**
 * Profiles published in `sameAs`. Only list a profile that exists and has real
 * content on it. An empty page costs more trust than an absent one, and a
 * studio that sells Google Business Profile management is judged on its own.
 *
 * `sameAs` is for pages that *are* the entity somewhere else — a listing, a
 * profile, a page a search engine can reconcile against this one. It held a
 * wa.me link once, which is a click-to-chat handoff rather than a page about
 * CareInflow, and asserted an identity that did not exist at that URL.
 *
 * Instagram qualifies on that test — it is a page about the studio, not a
 * handoff — and it was checked live (HTTP 200) before being added here.
 */
export const PROFILES: string[] = [GBP_URL, INSTAGRAM_URL];

export const whatsappWithMessage = (text: string): string =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

/**
 * Context-specific WhatsApp prefills. Each page opens the conversation with
 * the message that matches what the visitor was just reading.
 */
export const PREFILLS = {
  default:
    "Hi CareInflow. I would like a free written review of my practice's online presence. Clinic name: ",
  website:
    "Hi CareInflow. I would like the free review, with a focus on my clinic's website. Clinic name: ",
  gbp:
    "Hi CareInflow. I would like the free review, with a focus on my Google listing. Clinic name: ",
  seo:
    "Hi CareInflow. I would like the free review, with a focus on how patients find my clinic in search. Clinic name: ",
  care:
    "Hi CareInflow. My clinic already has a website and I would like to talk about maintaining it. Clinic name: ",
  pricing:
    "Hi CareInflow. I would like a quote in writing, starting with the free review. Clinic name: ",
  work:
    "Hi CareInflow. I saw your work and I would like a free written review for my own practice. Clinic name: ",
  social:
    "Hi CareInflow. I would like to talk about social media content for my practice. Clinic name: ",
} as const;

export type PrefillKey = keyof typeof PREFILLS;

export const whatsappFor = (key: PrefillKey = 'default'): string =>
  whatsappWithMessage(PREFILLS[key]);

export const NAV_ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Method', href: '/process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
] as const;

export const FOOTER_GROUPS = [
  {
    title: 'Services',
    links: [
      { label: 'Healthcare websites', href: '/services/healthcare-websites' },
      { label: 'Local SEO', href: '/services/local-seo' },
      { label: 'Google Business Profile', href: '/services/google-business-profile' },
      { label: 'Ongoing website care', href: '/services/website-care' },
      { label: 'Social media', href: '/services/social-media' },
    ],
  },
  {
    title: 'Specialties',
    links: [
      { label: 'Dental clinics', href: '/specialties/dental-clinics' },
      { label: 'Physiotherapy', href: '/specialties/physiotherapy-clinics' },
      { label: 'Dermatology', href: '/specialties/dermatology-clinics' },
      { label: 'All specialties', href: '/specialties' },
    ],
  },
  {
    title: 'Where we work',
    /*
     * Four markets and the index, deliberately — not all ten. The "Towns we
     * serve" band lower in the footer links every one of them, so repeating
     * the full list here would say the same thing twice and leave this column
     * more than twice the length of the four beside it.
     *
     * Rajkot joins the three because it is the newest market and the one with
     * the least internal linking pointing at it; a nav slot is worth more to
     * it than to Patan, which the band and the neighbouring area pages already
     * carry. Five links matches the Services and Answers columns either side.
     */
    links: [
      { label: 'Mehsana', href: '/areas/mehsana' },
      { label: 'Ahmedabad', href: '/areas/ahmedabad' },
      { label: 'Gandhinagar', href: '/areas/gandhinagar' },
      { label: 'Rajkot', href: '/areas/rajkot' },
      { label: 'All service areas', href: '/areas' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Method', href: '/process' },
      { label: 'Work', href: '/work' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Answers',
    links: [
      { label: 'Free review', href: '/contact' },
      { label: 'Resources', href: '/resources' },
      { label: 'Questions', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
] as const;
