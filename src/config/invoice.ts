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
import jsQR from 'jsqr';
import sharp from 'sharp';
import { BUSINESS, CANONICAL_HOST, SERVICE_MENU, whatsappWithMessage } from '@/config/site';
import {
  BUILDS,
  CONTENT_PIECES,
  GOOGLE_CARE,
  ONE_TIME_ITEMS,
  PRICE_PREFIX,
  rupees,
} from '@/config/pricing';
import type { AccentName } from '@/lib/accents';
import {
  readUpiPayload,
  settingsSchema,
  upiTransactionRef,
  upiUri,
  type InvoiceSettings,
  type PromoKey,
} from '@/lib/invoice';

export const INVOICE = {
  /** The opening of the WhatsApp message the invoice's closing link starts. */
  whatsappPrefill: (number: string) => `Hi CareInflow. About invoice ${number}: `,

  /** The closing line. The sentence under it links WhatsApp; see InvoiceDocument. */
  closing: 'Thank you for working with CareInflow.',
} as const;

/**
 * The terms printed under the lines. Each comes from what the site already
 * publishes (the payment-schedule and GST answers in faqs.json), and each is
 * printed only when this invoice has the thing it is about.
 *
 * No invoice names a date to pay by unless its file sets `due`: the owner
 * does not put a deadline on a client by default. The payment note is in the
 * payment panel, so it is not repeated here.
 */
export function invoiceTerms(opts: {
  due?: string;
  instalmentsOf?: number;
  hasMonthly: boolean;
  hasTax: boolean;
}): string[] {
  const terms = opts.due ? [`Please pay by ${opts.due}.`] : [];
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

/** A QR image from settings: the picture, and what it was read to contain. */
export interface QrImage {
  dataUri: string;
  /** The decoded text, when a code could be read at all. */
  payload?: string;
  /** The UPI ID it pays, when the code is a UPI payment code. */
  upiId?: string;
  payee?: string;
}

/**
 * The QR image named in settings (a Google Pay code, say), read back as well
 * as embedded. Reading it is how the invoice knows where the image actually
 * pays: whether it is the same UPI ID as `upiId`, and so a duplicate of the
 * generated code, or a different destination that deserves its own place.
 *
 * Embedded as a data URI, so the saved PDF carries the code itself at full
 * resolution.
 */
export async function readUpiQrImage(settings: InvoiceSettings): Promise<QrImage | undefined> {
  if (!settings.upiQrImage) return undefined;
  const file = new URL(settings.upiQrImage, INVOICES_DIR);
  if (!existsSync(file)) {
    throw new Error(
      `invoices/settings.json names "${settings.upiQrImage}" as the UPI QR image, but invoices/${settings.upiQrImage} does not exist.`,
    );
  }
  const bytes = readFileSync(file);
  const type = IMAGE_TYPES[extname(settings.upiQrImage).toLowerCase()];
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const code = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height);
  const upi = code ? readUpiPayload(code.data) : undefined;
  return {
    dataUri: `data:${type};base64,${bytes.toString('base64')}`,
    payload: code?.data,
    upiId: upi?.upiId,
    payee: upi?.payee,
  };
}

/** How an invoice is paid by UPI: the link, the code to print, and the details. */
export interface UpiPayment {
  /** The `upi://` link behind the pay button. Absent without a UPI ID, or when nothing is owed. */
  link?: string;
  /** The code to print: your own image, or one generated from the link. */
  qr?: { kind: 'generated'; value: string } | { kind: 'image'; dataUri: string };
  /** Scanning the code fills in the amount (only a generated code does). */
  qrHasAmount: boolean;
  /** The settings image as well, only when it pays a different UPI ID from `upiId`. */
  otherQr?: { dataUri: string; upiId: string; payee?: string };
  upiId?: string;
  payee: string;
  /** Says whose name the payer will see, when it is not the business's. */
  payeeNote?: string;
}

/**
 * The UPI side of one invoice.
 *
 * The link and the generated code carry the same payee, amount and note, so
 * the button and the code always agree. The amount is what is still owed:
 * the total after discounts and tax, less anything already received.
 *
 * One code per destination. A Google Pay image that pays the same UPI ID as
 * `upiId` is the same destination as a generated code, so only one of them
 * is printed: the image by default, because it is the code clients know
 * (`upiQrSource` in settings). The button carries the amount either way.
 * An image that pays a different UPI ID is printed beside the generated code.
 *
 * Nothing here can mark an invoice paid. Status comes only from `payments`
 * in the invoice file, written once the money is seen in the account.
 */
export function upiPayment(
  settings: InvoiceSettings,
  qrImage: QrImage | undefined,
  invoice: { number: string; balance: number },
): UpiPayment {
  const payee = settings.payeeName ?? BUSINESS.name;
  const payeeNote =
    payee === BUSINESS.name
      ? undefined
      : payee === BUSINESS.founder
        ? `Shows as ${payee}, CareInflow's founder.`
        : `Shows as ${payee} in your UPI app.`;
  const owed = invoice.balance > 0;

  if (!settings.upiId) {
    return {
      qr: owed && qrImage ? { kind: 'image', dataUri: qrImage.dataUri } : undefined,
      qrHasAmount: false,
      upiId: qrImage?.upiId,
      payee: qrImage?.payee ?? payee,
    };
  }

  const link = owed
    ? upiUri({
        upiId: settings.upiId,
        payee,
        note: `Invoice ${invoice.number}`,
        amountPaise: settings.upiIncludeAmount ? invoice.balance : undefined,
        ref: settings.upiTransactionRef ? upiTransactionRef(invoice.number) : undefined,
      })
    : undefined;
  const same =
    qrImage?.upiId !== undefined && qrImage.upiId.toLowerCase() === settings.upiId.toLowerCase();
  const differs = qrImage?.upiId !== undefined && !same;
  const useImage = owed && same && settings.upiQrSource === 'image';

  return {
    link,
    qr: useImage ? { kind: 'image', dataUri: qrImage!.dataUri } : link ? { kind: 'generated', value: link } : undefined,
    qrHasAmount: !useImage && Boolean(link) && settings.upiIncludeAmount,
    otherQr:
      owed && differs ? { dataUri: qrImage!.dataUri, upiId: qrImage!.upiId!, payee: qrImage!.payee } : undefined,
    upiId: settings.upiId,
    payee,
    payeeNote,
  };
}

/** What is still missing, or wrong, before an invoice can go to a client. */
export function settingsGaps(settings: InvoiceSettings, qrImage: QrImage | undefined): string[] {
  const gaps: string[] = [];
  if (!settings.upiId) gaps.push(qrImage ? 'No UPI ID: the pay button is off' : 'No UPI ID or QR code: payment is off');
  if (qrImage && !qrImage.payload) gaps.push(`No QR code found in invoices/${settings.upiQrImage}`);
  else if (qrImage && !qrImage.upiId) gaps.push(`invoices/${settings.upiQrImage} is not a UPI payment code`);
  return gaps;
}
