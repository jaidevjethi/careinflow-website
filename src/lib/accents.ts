/**
 * Accent assignment. Each service, article topic and homepage surface gets a
 * stable hue so pages read as distinct rather than uniformly beige. The
 * classes are written out in full because Tailwind only emits utilities it
 * can see as literal strings.
 */
export type AccentName = 'web' | 'seo' | 'gbp' | 'care' | 'social';

export interface Accent {
  /** AA-safe hue for text, icons and labels on light backgrounds. */
  text: string;
  /** Vivid fill — colour blocks, top rules, dots. Never text on light. */
  vivid: string;
  /** Large light area — panels behind illustrations, chips. */
  tint: string;
  /** Chip: tint background with the saturated hue as text. */
  chip: string;
  /** Left rule / underline for section accents. */
  border: string;
  /** Vivid fill for thin rules and card top bars. */
  bar: string;
}

export const ACCENTS: Record<AccentName, Accent> = {
  web: {
    text: 'text-a-web',
    vivid: 'bg-a-web-vivid',
    tint: 'bg-a-web-tint',
    chip: 'bg-a-web-tint text-a-web',
    border: 'border-a-web',
    bar: 'bg-a-web-vivid',
  },
  seo: {
    text: 'text-a-seo',
    vivid: 'bg-a-seo-vivid',
    tint: 'bg-a-seo-tint',
    chip: 'bg-a-seo-tint text-a-seo',
    border: 'border-a-seo',
    bar: 'bg-a-seo-vivid',
  },
  gbp: {
    text: 'text-a-gbp',
    vivid: 'bg-a-gbp-vivid',
    tint: 'bg-a-gbp-tint',
    chip: 'bg-a-gbp-tint text-a-gbp',
    border: 'border-a-gbp',
    bar: 'bg-a-gbp-vivid',
  },
  care: {
    text: 'text-a-care',
    vivid: 'bg-a-care-vivid',
    tint: 'bg-a-care-tint',
    chip: 'bg-a-care-tint text-a-care',
    border: 'border-a-care',
    bar: 'bg-a-care-vivid',
  },
  social: {
    text: 'text-a-social',
    vivid: 'bg-a-social-vivid',
    tint: 'bg-a-social-tint',
    chip: 'bg-a-social-tint text-a-social',
    border: 'border-a-social',
    bar: 'bg-a-social-vivid',
  },
};

/** Service slug → accent. Each service owns one hue, permanently. */
const SERVICE_ACCENTS: Record<string, AccentName> = {
  'healthcare-websites': 'web',
  'google-business-profile': 'gbp',
  'local-seo': 'seo',
  'website-care': 'care',
  'social-media': 'social',
};

export const serviceAccent = (slug: string): Accent =>
  ACCENTS[SERVICE_ACCENTS[slug] ?? 'web'];

/** Resource topic → accent, matched to the service each topic belongs to. */
const TOPIC_ACCENTS: Record<string, AccentName> = {
  websites: 'web',
  'google-business-profile': 'gbp',
  'local-seo': 'seo',
  performance: 'care',
  patients: 'social',
};

export const topicAccent = (topic: string): Accent =>
  ACCENTS[TOPIC_ACCENTS[topic] ?? 'web'];

/** Cycle for lists with no natural mapping (the protocol grid). */
const CYCLE: AccentName[] = ['web', 'gbp', 'seo', 'care', 'social'];

export const cycleAccent = (index: number): Accent => ACCENTS[CYCLE[index % CYCLE.length]!];
