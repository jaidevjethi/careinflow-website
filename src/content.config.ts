import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { PRICE_REFS } from './lib/prices';

/**
 * Services — the four core offerings. Long-form content lives in the MDX
 * body; structured pieces (deliverables table, FAQs) live in frontmatter so
 * they can also feed schema markup and index pages.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /**
     * The <title> tag, when it should differ from the H1. Local intent needs a
     * place name in the title; the H1 reads better without one wedged in.
     * Falls back to `title` when absent.
     */
    seoTitle: z.string().optional(),
    /** Explainer illustration. See the careinflow-images skill for the style lock. */
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
    /**
     * Published starting price — a *key* into `src/config/pricing.ts`, never a
     * figure. Drives the price line on service cards and the `Offer` in the
     * Service schema, so neither can disagree with /pricing. The real number is
     * still fixed in writing after the free review.
     */
    pricing: z
      .object({
        ref: z.enum(PRICE_REFS),
        /** What that figure buys, in the service's own terms. Use {{tokens}}. */
        note: z.string(),
      })
      .optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
    related: z.array(z.string()).default([]),
  }),
});

/**
 * Specialties — what a dental, physiotherapy or dermatology practice needs
 * that the others do not. One page per specialty, written from what those
 * patients actually search and worry about. If two of these could be swapped
 * without anyone noticing, they should not both exist.
 */
const specialties = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/specialties' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /**
     * Title for the <title> tag when it should differ from the H1.
     *
     * The H1 confirms the visitor is on the right page; the title has to win
     * the click against nine other results, so it carries the hook. Falls back
     * to `title` when absent.
     */
    seoTitle: z.string().optional(),
    navLabel: z.string(),
    description: z.string(),
    summary: z.string(),
    order: z.number(),
    /** Accent key from lib/accents. */
    accent: z.enum(['web', 'seo', 'gbp', 'care', 'social']),
    /** Editorial photograph for the hero aside. No legible text inside it. */
    image: image(),
    imageAlt: z.string(),
    /** The searches these patients actually type. Patient words, not clinical. */
    patientSearches: z.array(z.string()),
    /** Treatments that earn their own page, and the worry each one answers. */
    treatmentPages: z.array(z.object({ treatment: z.string(), answers: z.string() })),
    /** Google Business Profile categories that fit this specialty. */
    gbpCategories: z.array(z.string()),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
});

/**
 * Service areas — places served, never places staffed. One studio, in Mehsana.
 * Each page describes what that market is actually like; if it reads like the
 * last one with the town name swapped, it is not worth publishing.
 */
const areas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/areas' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /**
     * Title for the <title> tag when it should differ from the H1.
     *
     * The H1 confirms the visitor is on the right page; the title has to win
     * the click against nine other results, so it carries the hook. Falls back
     * to `title` when absent.
     */
    seoTitle: z.string().optional(),
    navLabel: z.string(),
    /** The town as it appears in BUSINESS.serviceAreas. */
    city: z.string(),
    description: z.string(),
    summary: z.string(),
    order: z.number(),
    accent: z.enum(['web', 'seo', 'gbp', 'care', 'social']),
    /** True only for Mehsana — the one place the studio actually sits. */
    isHomeBase: z.boolean().default(false),
    /** Editorial photograph for the hero aside. No legible text inside it. */
    image: image(),
    imageAlt: z.string(),
    /** Honest, checkable facts about the market. No invented statistics. */
    marketNotes: z.array(z.object({ label: z.string(), note: z.string() })),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
});

/** Case studies — real projects only. */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /**
     * Title for the <title> tag when it should differ from the H1.
     *
     * The H1 confirms the visitor is on the right page; the title has to win
     * the click against nine other results, so it carries the hook. Falls back
     * to `title` when absent.
     */
    seoTitle: z.string().optional(),
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
    /**
     * A demonstration build with no client behind it — a complete, deployed
     * site made to show what a practice receives, whose copy and every figure
     * in it are invented.
     *
     * This exists because /work leads with "everything on it is real" and the
     * homepage promises "not mockups", and those lines are worth keeping true.
     * A demo is excluded from the homepage's featured slot, labelled wherever
     * it appears, and drops the `mentions` Organization from its schema so no
     * search engine is told the practice exists.
     */
    demo: z.boolean().default(false),
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
    /** What the practice was up against before the build. */
    problem: z.object({ heading: z.string(), body: z.string() }).optional(),
    /**
     * Screenshots of the live site with the reasoning attached. A case study
     * that only says "we built a website" and shows one homepage proves
     * nothing; each shot here has to carry the decision it illustrates, which
     * is the part a clinic owner is actually buying.
     */
    gallery: z
      .array(
        z.object({
          src: image(),
          alt: z.string(),
          title: z.string(),
          caption: z.string(),
          /** Phone captures render narrow; everything else fills the column. */
          phone: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

/** Resources — educational articles (teach, don't promote). */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/resources' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    /**
     * Title for the <title> tag when it should differ from the H1.
     *
     * The H1 confirms the visitor is on the right page; the title has to win
     * the click against nine other results, so it carries the hook. Falls back
     * to `title` when absent.
     */
    seoTitle: z.string().optional(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topic: z.enum(['websites', 'local-seo', 'google-business-profile', 'performance', 'patients']),
    minutesRead: z.number(),
    order: z.number(),
    /**
     * Lead image. A photograph where a person or a moment is the subject, a
     * device render where the subject is the thing we build. These are the
     * longest reads on the site and they used to open on nothing at all.
     */
    image: image().optional(),
    imageAlt: z.string().optional(),
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
 * Testimonials — ships empty until real ones exist. We never fabricate
 * feedback; sections render only when there are genuine entries.
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

export const collections = {
  services,
  specialties,
  areas,
  caseStudies,
  resources,
  faqs,
  testimonials,
};
