/**
 * Accent assignment. Each service, article topic and homepage surface gets a
 * stable hue so pages read as distinct rather than uniformly beige. The
 * classes are written out in full because Tailwind only emits utilities it
 * can see as literal strings.
 */
export type AccentName = 'green' | 'blue' | 'amber' | 'teal' | 'plum';

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
  green: {
    text: 'text-a-green',
    vivid: 'bg-a-green-vivid',
    tint: 'bg-a-green-tint',
    chip: 'bg-a-green-tint text-a-green',
    border: 'border-a-green',
    bar: 'bg-a-green-vivid',
  },
  blue: {
    text: 'text-a-blue',
    vivid: 'bg-a-blue-vivid',
    tint: 'bg-a-blue-tint',
    chip: 'bg-a-blue-tint text-a-blue',
    border: 'border-a-blue',
    bar: 'bg-a-blue-vivid',
  },
  amber: {
    text: 'text-a-amber',
    vivid: 'bg-a-amber-vivid',
    tint: 'bg-a-amber-tint',
    chip: 'bg-a-amber-tint text-a-amber',
    border: 'border-a-amber',
    bar: 'bg-a-amber-vivid',
  },
  teal: {
    text: 'text-a-teal',
    vivid: 'bg-a-teal-vivid',
    tint: 'bg-a-teal-tint',
    chip: 'bg-a-teal-tint text-a-teal',
    border: 'border-a-teal',
    bar: 'bg-a-teal-vivid',
  },
  plum: {
    text: 'text-a-plum',
    vivid: 'bg-a-plum-vivid',
    tint: 'bg-a-plum-tint',
    chip: 'bg-a-plum-tint text-a-plum',
    border: 'border-a-plum',
    bar: 'bg-a-plum-vivid',
  },
};

/** Service slug → accent. Websites keep the brand green. */
const SERVICE_ACCENTS: Record<string, AccentName> = {
  'healthcare-websites': 'green',
  'google-business-profile': 'amber',
  'local-seo': 'blue',
  'website-care': 'teal',
  'social-media': 'plum',
};

export const serviceAccent = (slug: string): Accent =>
  ACCENTS[SERVICE_ACCENTS[slug] ?? 'green'];

/** Resource topic → accent, matched to the service each topic belongs to. */
const TOPIC_ACCENTS: Record<string, AccentName> = {
  websites: 'green',
  'google-business-profile': 'amber',
  'local-seo': 'blue',
  performance: 'teal',
  patients: 'plum',
};

export const topicAccent = (topic: string): Accent =>
  ACCENTS[TOPIC_ACCENTS[topic] ?? 'green'];

/** Cycle for lists with no natural mapping (the protocol grid). */
const CYCLE: AccentName[] = ['green', 'amber', 'blue', 'teal', 'plum'];

export const cycleAccent = (index: number): Accent => ACCENTS[CYCLE[index % CYCLE.length]!];
