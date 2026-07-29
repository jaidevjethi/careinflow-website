import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Services — the four core offerings. Long-form content lives in the MDX
 * body; structured pieces (deliverables table, FAQs) live in frontmatter so
 * they can also feed schema markup and index pages.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /** Explainer illustration — see the careinflow-images skill for the style lock. */
    illustration: image(),
    illustrationAlt: z.string(),
    /** Short label used in navigation and cards. */
    navLabel: z.string(),
    /** Meta description, unique per page. */
    description: z.string(),
    /** Protocol code from the design system, e.g. "CI-01". */
    code: z.string(),
    order: z.number(),
    /** One-line promise shown on cards. */
    summary: z.string(),
    /** Deliverables table rows: label → cadence/status (pass-green value). */
    deliverables: z.array(
      z.object({ item: z.string(), status: z.string() }),
    ),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
    related: z.array(z.string()).default([]),
  }),
});

/** Case studies — real projects only. */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /** Real screenshot of the live site — captured by scripts/capture-work-shots.mjs. */
    cover: image(),
    coverAlt: z.string(),
    /** Optional second shot (e.g. the mobile view). */
    coverMobile: image().optional(),
    coverMobileAlt: z.string().optional(),
    client: z.string(),
    location: z.string(),
    sector: z.string(),
    /** True only for healthcare projects; non-healthcare work is labeled. */
    healthcare: z.boolean(),
    year: z.number(),
    url: z.string().url().optional(),
    description: z.string(),
    summary: z.string(),
    order: z.number(),
    highlights: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        /** Reference range, lab-report style (e.g. "REF <1.2S"). */
        ref: z.string().optional(),
      }),
    ),
  }),
});

/** Resources — educational articles (teach, don't promote). */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topic: z.enum(['websites', 'local-seo', 'google-business-profile', 'performance', 'patients']),
    minutesRead: z.number(),
    order: z.number(),
  }),
});

/**
 * FAQs — one shared pool. Each entry lists the pages it appears on, so the
 * same answer is never duplicated with drift.
 */
const faqs = defineCollection({
  loader: file('./src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    /** Page keys this FAQ renders on ("faq" = the FAQ page itself). */
    pages: z.array(z.string()),
    order: z.number(),
  }),
});

/**
 * Testimonials — intentionally ships empty. CareInflow is a new studio and
 * does not fabricate feedback; sections render only when real entries exist.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    practice: z.string(),
    quote: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { services, caseStudies, resources, faqs, testimonials };
