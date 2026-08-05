import { BUSINESS, CANONICAL_HOST, PROFILES } from '@/config/site';
import { CURRENCY, PRICE_RANGE, type PriceUnit } from '@/config/pricing';
import { canonicalUrl } from '@/lib/url';

/**
 * JSON-LD builders. Every builder returns a plain object; pages compose the
 * ones that accurately describe their content and render them via <JsonLd>.
 */

const ORG_ID = `${CANONICAL_HOST}/#organization`;
const SITE_ID = `${CANONICAL_HOST}/#website`;
const FOUNDER_ID = `${CANONICAL_HOST}/#founder`;

export function organizationSchema() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: BUSINESS.name,
    description:
      'Healthcare-focused web design and digital growth studio. Websites, local SEO, and Google Business Profile management for doctors and clinics.',
    url: `${CANONICAL_HOST}/`,
    // No email: WhatsApp and the phone are the only two routes the site offers.
    telephone: BUSINESS.phone,
    logo: `${CANONICAL_HOST}/logo.svg`,
    image: `${CANONICAL_HOST}/og-default.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: BUSINESS.hours.days,
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    // One studio, in Mehsana. `areaServed` lists places served, never staffed.
    areaServed: BUSINESS.serviceAreas.map((name) => ({ '@type': 'City', name })),
    founder: { '@id': FOUNDER_ID },
    sameAs: PROFILES,
    knowsAbout: [
      'Healthcare website design',
      'Local SEO for clinics',
      'Google Business Profile management',
      'Website maintenance',
    ],
    slogan: 'Websites, local search, and Google presence for healthcare practices.',
    priceRange: PRICE_RANGE,
    currenciesAccepted: CURRENCY,
  };
}

export function founderSchema(imageUrl?: string) {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: BUSINESS.founder,
    jobTitle: 'Founder',
    worksFor: { '@id': ORG_ID },
    ...(imageUrl ? { image: imageUrl } : {}),
    description:
      'Technologist and founder of CareInflow. Studied IT and web development in Gujarat, cybersecurity in Canada, and worked at Microsoft before returning to India to build CareInflow.',
    knowsAbout: ['Web development', 'Cybersecurity', 'Local SEO', 'Healthcare digital presence'],
  };
}

export function webSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${CANONICAL_HOST}/`,
    name: BUSINESS.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  };
}

export function webPageSchema(opts: { path: string; title: string; description: string; type?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${canonicalUrl(opts.path)}#webpage`,
    url: canonicalUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/**
 * A published starting price. `from` prices are modelled as `minPrice` on a
 * price specification rather than a flat `price`, because that is what they
 * honestly are — the real figure is fixed in writing after the free review.
 */
export interface PriceOffer {
  from: number;
  unit: PriceUnit;
}

/**
 * `month` and `page` are both *rates*, so they need a unit — published as a
 * flat figure, a ₹3,499-per-page rate reads as the whole price of the work.
 */
const UNIT_TEXT: Partial<Record<PriceUnit, string>> = { month: 'MONTH', page: 'PAGE' };

function priceSpecification({ from, unit }: PriceOffer) {
  const unitText = UNIT_TEXT[unit];
  return {
    '@type': unitText ? 'UnitPriceSpecification' : 'PriceSpecification',
    priceCurrency: CURRENCY,
    minPrice: from,
    valueAddedTaxIncluded: false,
    ...(unitText ? { unitText } : {}),
    ...(unit === 'month' ? { billingDuration: 1, billingIncrement: 1 } : {}),
  };
}

function offer(opts: PriceOffer & { name?: string; description?: string; url?: string }) {
  return {
    '@type': 'Offer',
    ...(opts.name ? { name: opts.name } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.url ? { url: canonicalUrl(opts.url) } : {}),
    priceCurrency: CURRENCY,
    priceSpecification: priceSpecification(opts),
    availability: 'https://schema.org/InStock',
    seller: { '@id': ORG_ID },
  };
}

/**
 * `id` is the service slug. It gives every Service node a stable `@id`, so the
 * five listed on /services and the one on each detail page resolve to the same
 * entity instead of six unrelated ones.
 */
export function serviceSchema(opts: {
  id: string;
  name: string;
  description: string;
  path: string;
  offer?: PriceOffer;
}) {
  return {
    '@type': 'Service',
    '@id': `${CANONICAL_HOST}/#service-${opts.id}`,
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    provider: { '@id': ORG_ID },
    areaServed: BUSINESS.serviceAreas.map((name) => ({ '@type': 'City', name })),
    serviceType: opts.name,
    ...(opts.offer ? { offers: offer({ ...opts.offer, url: opts.path }) } : {}),
  };
}

/**
 * The published price list, as one catalog. Rendered on /pricing only — it
 * must describe exactly what that page shows, so search engines and AI
 * assistants quote the same numbers a visitor reads.
 */
export function offerCatalogSchema(opts: {
  name: string;
  path: string;
  offers: Array<{ name: string; description: string; from: number; unit: PriceUnit }>;
}) {
  return {
    '@type': 'OfferCatalog',
    '@id': `${canonicalUrl(opts.path)}#offers`,
    name: opts.name,
    url: canonicalUrl(opts.path),
    provider: { '@id': ORG_ID },
    itemListElement: opts.offers.map((o, i) => ({
      '@type': 'Offer',
      position: i + 1,
      name: o.name,
      description: o.description,
      priceCurrency: CURRENCY,
      priceSpecification: priceSpecification(o),
      availability: 'https://schema.org/InStock',
      seller: { '@id': ORG_ID },
      itemOffered: {
        '@type': 'Service',
        name: o.name,
        provider: { '@id': ORG_ID },
        areaServed: BUSINESS.serviceAreas.map((name) => ({ '@type': 'City', name })),
      },
    })),
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** An ImageObject with real dimensions — what Article rich results ask for. */
export interface SchemaImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

const imageObject = (img: SchemaImage) => ({
  '@type': 'ImageObject',
  url: img.url,
  width: img.width,
  height: img.height,
  ...(img.alt ? { caption: img.alt } : {}),
});

/**
 * Case studies. Previously these carried only WebPage + BreadcrumbList, which
 * made the site's strongest proof pages its least described ones. `Article`
 * with an `image` is what earns them a result with a picture attached.
 */
export function caseStudySchema(opts: {
  path: string;
  title: string;
  description: string;
  client: string;
  year: number;
  image: SchemaImage;
  liveUrl?: string;
  /**
   * A demonstration build has no client. `mentions` would assert to a search
   * engine that the practice named in it is a real Organization, which is the
   * one claim a demo must never make, so it is dropped.
   */
  demo?: boolean;
}) {
  return {
    '@type': 'Article',
    '@id': `${canonicalUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: canonicalUrl(opts.path),
    image: imageObject(opts.image),
    datePublished: `${opts.year}-01-01`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: canonicalUrl(opts.path),
    inLanguage: 'en-IN',
    about: {
      '@type': 'CreativeWork',
      name: opts.title,
      creator: { '@id': ORG_ID },
      ...(opts.liveUrl ? { url: opts.liveUrl } : {}),
    },
    ...(opts.demo ? {} : { mentions: { '@type': 'Organization', name: opts.client } }),
  };
}

/** An ordered list of pages — what a collection page is actually listing. */
export function itemListSchema(opts: {
  path: string;
  name: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    '@type': 'ItemList',
    '@id': `${canonicalUrl(opts.path)}#list`,
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: canonicalUrl(item.path),
    })),
  };
}

export function articleSchema(opts: {
  path: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: SchemaImage;
}) {
  return {
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: canonicalUrl(opts.path),
    datePublished: opts.publishDate.toISOString().slice(0, 10),
    dateModified: (opts.updatedDate ?? opts.publishDate).toISOString().slice(0, 10),
    ...(opts.image ? { image: imageObject(opts.image) } : {}),
    author: { '@id': FOUNDER_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: canonicalUrl(opts.path),
    inLanguage: 'en-IN',
  };
}

/** Wrap composed schema objects into one @graph document. */
export function graph(...schemas: object[]) {
  return { '@context': 'https://schema.org', '@graph': schemas };
}
