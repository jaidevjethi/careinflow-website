import { BUSINESS, CANONICAL_HOST, WHATSAPP_URL } from '@/config/site';
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
  };
}

export function founderSchema() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: BUSINESS.founder,
    jobTitle: 'Founder',
    worksFor: { '@id': ORG_ID },
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

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    provider: { '@id': ORG_ID },
    areaServed: BUSINESS.serviceAreas.map((name) => ({ '@type': 'City', name })),
    serviceType: opts.name,
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
