/**
 * Studio-wide invoice settings, and the loader for the private ones.
 *
 * Two kinds of setting, kept apart on purpose:
 *
 * - This file: wording, terms, the promo strip. Nothing in it is private, and
 *   every price it quotes comes from pricing.ts.
 * - invoices/settings.json (gitignored): the UPI ID, the payment link, bank
 *   details and the GSTIN. The repo is public, and a bank account number does
 *   not belong on GitHub. Copy invoices/examples/settings.example.json to
 *   start. Without it, every payment field prints as a marked placeholder.
 *
 * The business itself (name, address, phone, WhatsApp, website) is read from
 * site.ts and never written down again here, so an invoice and the website
 * cannot disagree about where the studio is or how to reach it.
 */

import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { CANONICAL_HOST, SERVICE_MENU, whatsappWithMessage } from '@/config/site';
import {
  BUILDS,
  CONTENT_PIECES,
  GOOGLE_CARE,
  ONE_TIME_ITEMS,
  PRICE_PREFIX,
  rupees,
} from '@/config/pricing';
import type { AccentName } from '@/lib/accents';
import { settingsSchema, type InvoiceSettings, type PromoKey } from '@/lib/invoice';

export const INVOICE = {
  /**
   * Days between issue and due date, when an invoice does not set `due`.
   * Not published anywhere on the site; seven is a working assumption.
   */
  dueDays: 7,

  /** The opening of the WhatsApp message the invoice's closing link starts. */
  whatsappPrefill: (number: string) => `Hi CareInflow. About invoice ${number}: `,

  /** The closing line. The sentence under it links WhatsApp; see InvoiceDocument. */
  closing: 'Thank you for working with CareInflow.',
} as const;

/**
 * The terms printed under the lines. Each comes from what the site already
 * publishes (the payment-schedule and GST answers in faqs.json), and each is
 * printed only when this invoice has the thing it is about.
 */
export function invoiceTerms(opts: {
  number: string;
  due: string;
  instalmentsOf?: number;
  hasMonthly: boolean;
  hasTax: boolean;
}): string[] {
  const terms = [
    `Please pay by ${opts.due}, with ${opts.number} as the payment note, so the payment can be matched to this invoice.`,
  ];
  if (opts.instalmentsOf === 2) {
    terms.push('The build is paid in two halves: one to begin, one at launch.');
  } else if (opts.instalmentsOf === 3) {
    terms.push('The build is paid in three parts: at the start, at design approval, and at launch.');
  } else if (opts.instalmentsOf) {
    terms.push(`The build is paid in ${opts.instalmentsOf} parts, as agreed in writing.`);
  }
  if (opts.hasMonthly) {
    terms.push(
      'Monthly plans are billed monthly in advance and run month to month, with no lock-in. Each later month is invoiced separately, and is not part of this amount payable.',
    );
  }
  terms.push(
    opts.hasTax
      ? 'Amounts are in Indian rupees. GST is shown separately.'
      : 'Amounts are in Indian rupees.',
  );
  return terms;
}

/* -------------------------------------------------------------------------
 * "Also from CareInflow"
 *
 * A short list of what the studio does, in order of preference. An invoice
 * shows the first two it does not already bill, so a content client hears
 * about websites and a website client hears about content. The free review
 * is last because it is the offer that suits every client.
 *
 * Notes are the Services menu's own phrases, and every figure is a published
 * starting point with the site's own prefix: the strip may not say anything
 * the website does not.
 * ---------------------------------------------------------------------- */

export interface PromoItem {
  key: PromoKey;
  title: string;
  note: string;
  price: string;
  href: string;
  accent: AccentName;
}

const menuNote = (href: string): string => {
  const item = SERVICE_MENU.flatMap((g) => [...g.items]).find((i) => i.href === href);
  if (!item) throw new Error(`Invoice promo: ${href} is not in SERVICE_MENU`);
  return item.note;
};

const page = (path: string) => `${CANONICAL_HOST}${path}`;

const reel = CONTENT_PIECES.find((p) => p.id === 'reel')!;
const gbpRebuild = ONE_TIME_ITEMS.find((i) => i.item.startsWith('Google Business Profile'))!;

export const PROMO: PromoItem[] = [
  {
    key: 'content',
    title: 'Healthcare content',
    note: menuNote('/services/healthcare-content'),
    price: `${PRICE_PREFIX} ${rupees(reel.price)} a reel`,
    href: page('/services/healthcare-content/'),
    accent: 'social',
  },
  {
    key: 'website',
    title: 'Healthcare websites',
    note: menuNote('/services/healthcare-websites'),
    price: `${PRICE_PREFIX} ${rupees(BUILDS[0]!.from)}`,
    href: page('/services/healthcare-websites/'),
    accent: 'web',
  },
  {
    key: 'google-care',
    title: GOOGLE_CARE.name,
    note: menuNote('/services/local-seo'),
    price: `${PRICE_PREFIX} ${rupees(GOOGLE_CARE.monthly)} a month`,
    href: page('/services/local-seo/'),
    accent: 'seo',
  },
  {
    key: 'gbp',
    title: gbpRebuild.item,
    note: menuNote('/services/google-business-profile'),
    price: `${PRICE_PREFIX} ${rupees(gbpRebuild.price)} once`,
    href: page('/services/google-business-profile/'),
    accent: 'gbp',
  },
  {
    key: 'review',
    title: 'Free digital review',
    note: 'Your website, Google listing and local search, looked at in writing',
    price: 'Free',
    href: page('/contact/'),
    accent: 'care',
  },
];

/** The page every price on the strip comes from, as printed and as linked. */
export const PRICING_LINK = {
  href: page('/pricing/'),
  label: `${CANONICAL_HOST.replace(/^https?:\/\//, '')}/pricing`,
};

export const invoiceWhatsapp = (number: string) => whatsappWithMessage(INVOICE.whatsappPrefill(number));

/* -------------------------------------------------------------------------
 * The private settings
 *
 * Read from disk on every render rather than imported. An import is cached in
 * the dev server's module graph, so a settings file deleted mid-session kept
 * every invoice failing until a restart; a read always sees the folder as it
 * is now, and a new QR image or payment link shows on the next reload.
 *
 * This only ever runs under `astro dev`, so Node's fs is always there.
 * ---------------------------------------------------------------------- */

const INVOICES_DIR = new URL('../../invoices/', import.meta.url);

export function loadSettings(): InvoiceSettings {
  const file = new URL('settings.json', INVOICES_DIR);
  if (!existsSync(file)) return settingsSchema.parse({});

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`invoices/settings.json is not valid JSON. ${(error as Error).message}`);
  }
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`invoices/settings.json is not valid. ${problems}`);
  }
  return parsed.data;
}

const IMAGE_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

/**
 * The UPI QR image named in settings, as a data URI. Embedded rather than
 * linked, so the saved PDF carries the code itself at full resolution.
 */
export function upiQrDataUri(settings: InvoiceSettings): string | undefined {
  if (!settings.upiQrImage) return undefined;
  const file = new URL(settings.upiQrImage, INVOICES_DIR);
  if (!existsSync(file)) {
    throw new Error(
      `invoices/settings.json names "${settings.upiQrImage}" as the UPI QR image, but invoices/${settings.upiQrImage} does not exist.`,
    );
  }
  const type = IMAGE_TYPES[extname(settings.upiQrImage).toLowerCase()];
  return `data:${type};base64,${readFileSync(file).toString('base64')}`;
}

/** What is still missing before an invoice can go to a client. */
export function settingsGaps(settings: InvoiceSettings): string[] {
  const gaps: string[] = [];
  if (!settings.upiQrImage && !settings.upiId) gaps.push('No UPI QR code yet');
  // A UPI ID gives every invoice its own tap-to-pay link, so a standing
  // payment page is only missing when there is neither.
  if (!settings.paymentLink && !settings.upiId) gaps.push('No payment link yet');
  return gaps;
}
