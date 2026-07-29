/**
 * Single source of truth for business facts, URLs, and navigation.
 * Canonical URLs always use CANONICAL_HOST — including on the GitHub Pages
 * mirror — so search engines treat careinflow.com as the one real site.
 */

export const CANONICAL_HOST = 'https://careinflow.com';

export const BUSINESS = {
  name: 'CareInflow',
  legalName: 'CareInflow',
  tagline:
    'Healthcare-focused web design and digital growth studio in Mehsana, Gujarat',
  founder: 'Jaidev Jethi',
  email: 'jaydevjethi123@gmail.com',
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
  founding: {
    totalPlaces: 5,
    filledPlaces: 1,
  },
} as const;

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.phone.replace('+', '')}`;

export const whatsappWithMessage = (text: string): string =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

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
      { label: 'Resources', href: '/resources' },
      { label: 'Questions', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
] as const;
