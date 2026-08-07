/**
 * Single source of truth for business facts, URLs, and navigation.
 * Canonical URLs always use CANONICAL_HOST, including on the GitHub Pages
 * mirror, so search engines treat careinflow.com as the one real site.
 */

export const CANONICAL_HOST = 'https://careinflow.com';

export const BUSINESS = {
  name: 'CareInflow',
  legalName: 'CareInflow',
  tagline:
    'Healthcare-focused web design and digital growth studio in Mehsana, Gujarat',
  founder: 'Jaidev Jethi',
  /**
   * No email. WhatsApp and the phone are the only two contact routes on the
   * site. They are how clinic owners here reach a supplier, and a message on
   * WhatsApp gets answered faster than an inbox ever does.
   */
  /** E.164, displayed as +91 97734 56668 */
  phone: '+919773456668',
  phoneDisplay: '+91 97734 56668',
  address: {
    street: 'Shop F-27, Platinum Plaza Complex, Radhanpur Road',
    locality: 'Mehsana',
    region: 'Gujarat',
    postalCode: '384002',
    country: 'IN',
  },
  /** Studio coordinates, for LocalBusiness geo and the map link. */
  geo: { latitude: 23.5985, longitude: 72.3693 },
  /**
   * Published hours. Stated because a LocalBusiness without them is a weaker
   * local-search entity, and because a doctor deciding when to ring should
   * not have to guess.
   */
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' },
  /** Areas served, Mehsana first (home base). */
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
  ],
} as const;

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.phone.replace('+', '')}`;

/**
 * Profiles published in `sameAs`. Only list a profile that exists and has real
 * content on it. An empty page costs more trust than an absent one, and a
 * studio that sells Google Business Profile management is judged on its own.
 *
 * Uncomment each line the day that profile is live:
 *   'https://www.google.com/maps/place/?q=place_id:…'  ← the GBP listing
 *   'https://www.instagram.com/careinflow/'            ← once the handle moves
 */
export const PROFILES: string[] = [WHATSAPP_URL];

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
    links: [
      { label: 'Mehsana', href: '/areas/mehsana' },
      { label: 'Ahmedabad', href: '/areas/ahmedabad' },
      { label: 'Gandhinagar', href: '/areas/gandhinagar' },
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
