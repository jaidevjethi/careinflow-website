import { BUSINESS, CANONICAL_HOST, WHATSAPP_URL } from '@/config/site';
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
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: BUSINESS.serviceAreas.map((name) => ({ '@type': 'City', name })),
    founder: { '@id': FOUNDER_ID },
    sameAs: [WHATSAPP_URL, 'https://github.com/jaidevjethi'],
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
    inLanguage: 'en',
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
    inLanguage: 'en',
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

function priceSpecification({ from, unit }: PriceOffer) {
  const recurring = unit === 'month';
  return {
    '@type': recurring ? 'UnitPriceSpecification' : 'PriceSpecification',
    priceCurrency: CURRENCY,
    minPrice: from,
    valueAddedTaxIncluded: false,
    ...(recurring
      ? { unitText: 'MONTH', billingDuration: 1, billingIncrement: 1 }
      : {}),
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

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  offer?: PriceOffer;
}) {
  return {
    '@type': 'Service',
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

export function articleSchema(opts: {
  path: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
}) {
  return {
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: canonicalUrl(opts.path),
    datePublished: opts.publishDate.toISOString().slice(0, 10),
    dateModified: (opts.updatedDate ?? opts.publishDate).toISOString().slice(0, 10),
    author: { '@id': FOUNDER_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: canonicalUrl(opts.path),
    inLanguage: 'en',
  };
}

/** Wrap composed schema objects into one @graph document. */
export function graph(...schemas: object[]) {
  return { '@context': 'https://schema.org', '@graph': schemas };
}
