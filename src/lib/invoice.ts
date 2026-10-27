/**
 * Invoices: the data model, the service catalog and the arithmetic.
 *
 * Nothing here renders and nothing here reads a file, so every figure an
 * invoice prints can be traced to one pure function. The private inputs (the
 * client profiles, the invoices themselves and the studio's payment details)
 * live in the gitignored `invoices/` folder at the repo root, because the repo
 * is public and an agreed price is a client-specific arrangement. See
 * invoices/README.md.
 *
 * Money is held in integer paise from the moment it is read, so a percentage
 * or a tax rate can never leave a float like 6299.820000001 in a total.
 *
 * Price resolution, per line, first match wins:
 *   1. the line's own `unitPrice`, a one-off figure;
 *   2. the client's agreed rate for that service, or one of the client's own
 *      custom services, from its profile in invoices/clients/;
 *   3. the published figure in src/config/pricing.ts.
 * A service priced to scope (Website Care, the multi-doctor build) has no
 * published figure, so it fails loudly without an agreed one rather than
 * printing a guess.
 */

import { z } from 'astro/zod';
import {
  BUILDS,
  CONTENT_INTRO_MONTHS,
  CONTENT_PACKAGES,
  CONTENT_PIECES,
  GOOGLE_CARE,
  ONE_TIME_ITEMS,
  WEBSITE_CARE,
  packageLabel,
  type PriceUnit,
} from '@/config/pricing';
import type { AccentName } from '@/lib/accents';

/* -------------------------------------------------------------------------
 * Schemas: what an invoice file and a client profile may contain
 * ---------------------------------------------------------------------- */

const rupeeAmount = z.number().finite().nonnegative();
const billing = z.enum(['once', 'monthly']);
const unit = z.enum(['project', 'month', 'page', 'once', 'piece']);

export const clientDetailsSchema = z.object({
  /** The practice or company, exactly as it should appear on the invoice. */
  name: z.string().min(1),
  /** The person the invoice is for, when that is not obvious from the name. */
  contact: z.string().optional(),
  /** Billing address. Line breaks are kept. */
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  /** The client's own GSTIN, when they have one and want it on the invoice. */
  gstin: z.string().optional(),
  /** An account or purchase-order reference the client asked us to quote. */
  reference: z.string().optional(),
});

const customServiceSchema = z.object({
  description: z.string().min(1),
  detail: z.string().optional(),
  billing,
  unit: unit.optional(),
  /** The agreed price, in rupees. */
  price: rupeeAmount,
});

export const clientProfileSchema = clientDetailsSchema.extend({
  /** Agreed prices for catalog services, in rupees: `{ reel: 650 }`. */
  rates: z.record(z.string(), rupeeAmount).default({}),
  /** Services this client buys that have no published equivalent. */
  services: z.record(z.string(), customServiceSchema).default({}),
});

/**
 * A discount takes exactly one of:
 *   price    the unit price after it: `{ price: 300 }` bills ₹300 a reel
 *            where the line's price is the regular ₹699
 *   units    that many units free, at the unit price reached so far
 *   percent  off what is left of the line after any earlier discount
 *   amount   a fixed sum off the line, in rupees
 * and `reason`, which is what the row says: "First-client price".
 */
const discountSchema = z
  .object({
    price: rupeeAmount.optional(),
    units: z.number().positive().optional(),
    percent: z.number().gt(0).max(100).optional(),
    amount: rupeeAmount.optional(),
    reason: z.string().optional(),
  })
  .refine((d) => [d.price, d.units, d.percent, d.amount].filter((v) => v !== undefined).length === 1, {
    message: 'a discount takes exactly one of `price`, `units`, `percent` or `amount`',
  });

const lineSchema = z
  .object({
    /** A catalog key (see CATALOG below) or one of the client's own services. */
    service: z.string().optional(),
    /** Required when there is no `service`; overrides its name when there is. */
    description: z.string().optional(),
    /** A second, smaller line under the description. */
    detail: z.string().optional(),
    billing: billing.optional(),
    unit: unit.optional(),
    /** Months, for a monthly line. Reels, posts or pages, for a piece. */
    quantity: z.number().positive().default(1),
    /** A one-off figure in rupees. Wins over the client's rate and the catalog. */
    unitPrice: rupeeAmount.optional(),
    /**
     * Content packages only. `intro` bills the introductory rate for a new
     * client's first three billed months, and says so beside the regular one.
     */
    rate: z.enum(['regular', 'intro']).optional(),
    /** One part of a project fee paid in parts: `{ part: 1, of: 2, label: 'to begin' }`. */
    instalment: z
      .object({
        part: z.number().int().positive(),
        of: z.number().int().min(2),
        label: z.string().optional(),
      })
      .refine((i) => i.part <= i.of, { message: 'instalment part cannot be greater than `of`' })
      .optional(),
    /**
     * One discount or a list of them, applied in order and each printed as its
     * own row under the line. See `discountSchema`.
     */
    discount: z.union([discountSchema, z.array(discountSchema).min(1)]).optional(),
  })
  .refine((l) => Boolean(l.service || l.description), {
    message: 'each line needs a `service` key or a `description`',
  });

export const PROMO_KEYS = ['content', 'website', 'google-care', 'gbp', 'review'] as const;
export type PromoKey = (typeof PROMO_KEYS)[number];

export const INVOICE_STATUSES = ['due', 'part-paid', 'paid', 'overdue'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const invoiceSchema = z.object({
  /** Printed exactly as written, and used as the payment reference. */
  number: z.string().min(1),
  issued: z.coerce.date(),
  /** Optional. Without it the invoice names no date to pay by. */
  due: z.coerce.date().optional(),
  /** The months or dates this invoice covers: "November 2026". */
  period: z.string().optional(),
  /** A profile id from invoices/clients/, or the client's details written out. */
  client: z.union([z.string(), clientDetailsSchema]),
  /** Overrides the profile's reference for this one invoice. */
  reference: z.string().optional(),
  lines: z.array(lineSchema).min(1),
  /** Only with the studio's GSTIN in invoices/settings.json. */
  taxes: z.array(z.object({ label: z.string(), rate: z.number().positive().max(28) })).default([]),
  /** Money already received against this invoice. */
  payments: z
    .array(z.object({ date: z.coerce.date(), amount: rupeeAmount.positive(), note: z.string().optional() }))
    .default([]),
  /** Monthly work that starts later. Listed for information, never added to the total. */
  upcoming: z
    .array(
      z
        .object({
          service: z.string().optional(),
          description: z.string().optional(),
          /** A month, in rupees. Defaults to the client's rate, then the catalog. */
          amount: rupeeAmount.optional(),
          starts: z.string(),
        })
        .refine((u) => Boolean(u.service || u.description), {
          message: 'an upcoming item needs a `service` key or a `description`',
        }),
    )
    .default([]),
  /** Extra notes for this invoice, printed above the standard terms. */
  notes: z.array(z.string()).default([]),
  /** A payment link for this invoice only, e.g. a Razorpay link with the amount set. */
  paymentLink: z.string().url().optional(),
  /** `false` hides the "Also from CareInflow" strip; a list picks what it shows. */
  promo: z.union([z.literal(false), z.array(z.enum(PROMO_KEYS))]).optional(),
  /** Only to override the derived status, e.g. to mark an invoice overdue. */
  status: z.enum(INVOICE_STATUSES).optional(),
  /** Example data. Marked as such on the page and in the toolbar. */
  sample: z.boolean().default(false),
});

/**
 * GSTIN: 2-digit state code, PAN, entity number, Z, check character.
 * Gujarat registrations start with 24.
 */
const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** The studio's private payment details, from invoices/settings.json. */
export const settingsSchema = z.object({
  /**
   * Your UPI ID. Printed under the code, and turned into each invoice's
   * tap-to-pay `upi://` link. Also generates the QR when there is no image.
   */
  upiId: z
    .string()
    .regex(/^[\w.-]{2,256}@[a-zA-Z][\w.-]{1,64}$/, 'not a UPI ID (name@bank)')
    .optional(),
  /**
   * The name on the UPI account, as a payer's app shows it. Defaults to the
   * business name; when it is a person's name the invoice says whose it is.
   */
  payeeName: z.string().optional(),
  /** File name of your own UPI QR image, saved in invoices/ (png, jpg or webp). */
  upiQrImage: z
    .string()
    .regex(/^[\w.-]+\.(png|jpe?g|webp)$/i, 'a file name in invoices/, ending .png, .jpg or .webp')
    .optional(),
  /**
   * Fill the amount due into the tap-to-pay link (and a generated QR). Off by
   * default: some UPI apps decline a link payment with a preset amount to a
   * personal UPI ID. Test it with a real payment before relying on it.
   */
  upiIncludeAmount: z.boolean().default(false),
  /** A standing payment page, used when an invoice has no `paymentLink` of its own. */
  paymentLink: z.string().url().optional(),
  bank: z
    .object({
      accountName: z.string(),
      accountNumber: z.string(),
      ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'not an IFSC code'),
      bankName: z.string(),
      branch: z.string().optional(),
    })
    .optional(),
  /** Only once the studio is registered. Without it no invoice can carry GST. */
  gstin: z.string().regex(GSTIN, 'not a GSTIN').optional(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type ClientProfile = z.infer<typeof clientProfileSchema>;
export type ClientDetails = z.infer<typeof clientDetailsSchema>;
export type InvoiceSettings = z.infer<typeof settingsSchema>;
type Line = InvoiceData['lines'][number];

/* -------------------------------------------------------------------------
 * The catalog: every published service, keyed for invoice files
 *
 * Built from pricing.ts, so no figure is written down twice. The keys are new
 * because some pricing ids are history rather than description: the Growth
 * Website is `healthcare-seo` there.
 * ---------------------------------------------------------------------- */

export type Billing = z.infer<typeof billing>;

export interface CatalogService {
  name: string;
  detail?: string;
  billing: Billing;
  unit: PriceUnit;
  /** The published figure in rupees. Absent when the service is priced to scope. */
  price?: number;
  /** Content packages: the introductory monthly figure. */
  intro?: number;
  accent: AccentName;
}

const find = <T>(list: T[], test: (item: T) => boolean, what: string): T => {
  const item = list.find(test);
  if (!item) throw new Error(`Invoice catalog: ${what} is no longer in src/config/pricing.ts`);
  return item;
};

const website = (id: string): CatalogService => {
  const b = find(BUILDS, (x) => x.id === id, `website package "${id}"`);
  const pages = /^\d/.test(b.stack.website) ? b.stack.website : 'Pages as needed';
  return {
    name: b.name,
    detail: [pages, `Google listing ${b.stack.listing.toLowerCase()}`, b.stack.seo]
      .filter(Boolean)
      .join(' · '),
    billing: 'once',
    unit: 'project',
    price: b.custom ? undefined : b.from,
    accent: 'web',
  };
};

const contentPackage = (id: string): CatalogService => {
  const p = find(CONTENT_PACKAGES, (x) => x.id === id, `content package "${id}"`);
  return {
    name: p.name,
    detail: packageLabel(p),
    billing: 'monthly',
    unit: 'month',
    price: p.monthly,
    intro: p.intro,
    accent: 'social',
  };
};

const piece = (id: string): CatalogService => {
  const p = find(CONTENT_PIECES, (x) => x.id === id, `content piece "${id}"`);
  return { name: p.item, billing: 'once', unit: 'piece', price: p.price, accent: 'social' };
};

/** Same lookup as src/lib/prices.ts: one-time items are known by their name. */
const oneTime = (prefix: string, accent: AccentName): CatalogService => {
  const i = find(ONE_TIME_ITEMS, (x) => x.item.startsWith(prefix), `one-time item "${prefix}"`);
  return { name: i.item, billing: 'once', unit: i.unit, price: i.price, accent };
};

export const CATALOG: Record<string, CatalogService> = {
  'website-foundation': website('practice-website'),
  'website-practice': website('practice-website-google'),
  'website-growth': website('healthcare-seo'),
  'website-multi': website('multi-specialty'),
  'google-care': {
    name: GOOGLE_CARE.name,
    detail: GOOGLE_CARE.priceNote,
    billing: 'monthly',
    unit: 'month',
    price: GOOGLE_CARE.monthly,
    accent: 'seo',
  },
  'website-care': {
    name: WEBSITE_CARE.name,
    billing: 'monthly',
    unit: 'month',
    accent: 'care',
  },
  'content-starter': contentPackage('content-starter'),
  'content-growth': contentPackage('content-growth'),
  'content-plus': contentPackage('content-plus'),
  reel: piece('reel'),
  'reel-advanced': piece('reelAdvanced'),
  'reel-complex': piece('reelComplex'),
  post: piece('post'),
  flyer: piece('flyer'),
  carousel: piece('carousel'),
  'carousel-research': piece('carouselResearch'),
  'gbp-rebuild': oneTime('Google Business Profile', 'gbp'),
  'takeover-audit': oneTime('Website takeover', 'care'),
  'extra-page': oneTime('Extra treatment', 'web'),
  'gujarati-version': oneTime('Gujarati version', 'web'),
};

/**
 * Which promo strip entries a billed service already covers. A website
 * package includes the listing set-up, and Google Care looks after the
 * listing, so neither invoice is the place to sell a listing rebuild.
 */
const PROMO_COVERED_BY: Partial<Record<string, PromoKey[]>> = {
  'website-foundation': ['website', 'gbp'],
  'website-practice': ['website', 'gbp'],
  'website-growth': ['website', 'gbp'],
  'website-multi': ['website', 'gbp'],
  'google-care': ['google-care', 'gbp'],
  'gbp-rebuild': ['gbp'],
  'content-starter': ['content'],
  'content-growth': ['content'],
  'content-plus': ['content'],
  reel: ['content'],
  'reel-advanced': ['content'],
  'reel-complex': ['content'],
  post: ['content'],
  flyer: ['content'],
  carousel: ['content'],
  'carousel-research': ['content'],
};

/* -------------------------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------------------- */

const inr0 = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Paise to "₹1,10,000" (or "₹1,10,000.50"), with a real minus sign. */
export const formatMoney = (paise: number, decimals: boolean): string => {
  const sign = paise < 0 ? '−' : '';
  const rupees = Math.abs(paise) / 100;
  return `${sign}₹${(decimals ? inr2 : inr0).format(rupees)}`;
};

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  // YAML dates arrive as UTC midnight. Formatting them in any other zone can
  // print the day before.
  timeZone: 'UTC',
});

/** "27 Oct 2026" */
export const formatDate = (d: Date): string => dateFormat.format(d);


const toPaise = (rupees: number): number => Math.round(rupees * 100);

/** "₹699 each", "₹8,999 / month": the suffix a unit takes beside its price. */
export const unitSuffix = (u: PriceUnit): string =>
  ({ project: '', once: '', month: '/ month', page: '/ page', piece: 'each' })[u];

/* -------------------------------------------------------------------------
 * Resolution and arithmetic
 * ---------------------------------------------------------------------- */

export interface ResolvedLine {
  description: string;
  detail?: string;
  billing: Billing;
  unit: PriceUnit;
  quantity: number;
  /** The figure per unit, in paise. For an instalment, the whole project fee. */
  unitPrice: number;
  instalment?: { part: number; of: number; label?: string };
  /** In paise. */
  gross: number;
  /** Each discount, in order, as its own row under the line. */
  discounts: ResolvedDiscount[];
  /** All of them together. */
  discount: number;
  net: number;
  accent?: AccentName;
  /** Billed at the content packages' introductory rate. */
  intro: boolean;
  /** Where the price came from, for the readiness notes. */
  priceSource: 'line' | 'client' | 'catalog';
}

export interface ResolvedDiscount {
  label: string;
  /** How the figure was reached: "₹300 each instead of the regular ₹699". */
  note?: string;
  /** In paise, as a positive number. */
  amount: number;
}

export interface ResolvedUpcoming {
  description: string;
  /** A month, in paise. */
  amount: number;
  starts: string;
}

export interface ComputedInvoice {
  client: ClientDetails;
  reference?: string;
  due?: Date;
  lines: ResolvedLine[];
  upcoming: ResolvedUpcoming[];
  /** Every amount below is in paise. Subtotals are before discounts. */
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  subtotal: number;
  discountTotal: number;
  /** Discounts summed by what they are for, in the order they first appear. */
  discountsByLabel: Array<{ label: string; amount: number }>;
  taxes: Array<{ label: string; rate: number; amount: number }>;
  total: number;
  received: number;
  balance: number;
  /** What the monthly lines on this invoice come to per month. */
  monthlyRunRate: number;
  status: InvoiceStatus;
  /** True when any figure on the invoice has paise, so all of them show two decimals. */
  decimals: boolean;
}

export class InvoiceError extends Error {
  constructor(invoiceNumber: string, message: string) {
    super(`Invoice ${invoiceNumber}: ${message}`);
    this.name = 'InvoiceError';
  }
}

/** The client a profile id or an inline block names, plus its rate card. */
export function resolveClient(
  data: InvoiceData,
  profiles: Record<string, ClientProfile>,
): { details: ClientDetails; profile?: ClientProfile } {
  if (typeof data.client !== 'string') return { details: data.client };
  const profile = profiles[data.client];
  if (!profile) {
    throw new InvoiceError(
      data.number,
      `no client profile "${data.client}". Add invoices/clients/${data.client}.yaml, or write the client's details into the invoice.`,
    );
  }
  return { details: profile, profile };
}

interface Priced {
  description: string;
  detail?: string;
  billing: Billing;
  unit: PriceUnit;
  price: number;
  accent?: AccentName;
  intro: boolean;
  source: ResolvedLine['priceSource'];
}

function priceLine(line: Line, profile: ClientProfile | undefined, number: string): Priced {
  const key = line.service;
  const custom = key ? profile?.services[key] : undefined;
  const catalog = key ? CATALOG[key] : undefined;

  if (key && !custom && !catalog) {
    throw new InvoiceError(
      number,
      `unknown service "${key}". Use a key from CATALOG in src/lib/invoice.ts, add it to the client's \`services\`, or write a \`description\` instead.`,
    );
  }

  if (custom) {
    return {
      description: line.description ?? custom.description,
      detail: line.detail ?? custom.detail,
      billing: line.billing ?? custom.billing,
      unit: line.unit ?? custom.unit ?? (custom.billing === 'monthly' ? 'month' : 'project'),
      price: line.unitPrice ?? custom.price,
      intro: false,
      source: line.unitPrice !== undefined ? 'line' : 'client',
    };
  }

  if (catalog && key) {
    const agreed = profile?.rates[key];
    if (line.rate && catalog.intro === undefined) {
      throw new InvoiceError(number, `\`rate\` only applies to a content package, not "${key}".`);
    }
    const intro = line.rate === 'intro';
    if (intro && (agreed !== undefined || line.unitPrice !== undefined)) {
      throw new InvoiceError(
        number,
        `"${key}" has an agreed price for this client, so \`rate: intro\` does not apply. Remove one of them.`,
      );
    }
    const price = line.unitPrice ?? agreed ?? (intro ? catalog.intro : catalog.price);
    if (price === undefined) {
      throw new InvoiceError(
        number,
        `"${key}" is priced to scope and has no published figure. Set \`unitPrice\` on the line, or an agreed rate in the client's profile.`,
      );
    }
    const introNote =
      intro && catalog.price !== undefined
        ? `Introductory rate for a new client's first ${CONTENT_INTRO_MONTHS} billed months. Regular rate ${formatMoney(toPaise(catalog.price), false)} a month.`
        : undefined;
    return {
      description: line.description ?? catalog.name,
      detail: [line.detail ?? catalog.detail, introNote].filter(Boolean).join('. ') || undefined,
      billing: line.billing ?? catalog.billing,
      unit: line.unit ?? catalog.unit,
      price,
      accent: catalog.accent,
      intro,
      source: line.unitPrice !== undefined ? 'line' : agreed !== undefined ? 'client' : 'catalog',
    };
  }

  if (line.unitPrice === undefined || !line.billing) {
    throw new InvoiceError(
      number,
      `the line "${line.description}" has no service key, so it needs both \`billing\` and \`unitPrice\`.`,
    );
  }
  return {
    description: line.description!,
    detail: line.detail,
    billing: line.billing,
    unit: line.unit ?? (line.billing === 'monthly' ? 'month' : 'project'),
    price: line.unitPrice,
    intro: false,
    source: 'line',
  };
}

/**
 * Split a fee into parts in whole rupees, the remainder on the last part, so
 * the parts always add back to the fee exactly. Two halves of 34,999 are
 * 17,500 and 17,499, never 17,499.50 twice.
 */
export const instalmentAmount = (feePaise: number, part: number, of: number): number => {
  const share = Math.round(feePaise / of / 100) * 100;
  return part < of ? share : feePaise - share * (of - 1);
};

type Discount = z.infer<typeof discountSchema>;

/**
 * Turn a line's discounts into rows, in order. A `price` discount lowers the
 * unit price the later ones work from, so "₹300 instead of ₹699, then the
 * first 5 reels free" frees 5 reels at ₹300, not at ₹699.
 */
function applyDiscounts(opts: {
  list: Discount[];
  gross: number;
  unitPrice: number;
  quantity: number;
  unit: PriceUnit;
  /** The line's price is the published one, so it can be called "regular". */
  regular: boolean;
  instalment: boolean;
  fail: (message: string) => Error;
}): ResolvedDiscount[] {
  const money = (paise: number) => formatMoney(paise, paise % 100 !== 0);
  const per = ({ month: 'a month', page: 'a page', piece: 'each' } as Partial<Record<PriceUnit, string>>)[opts.unit];
  let unit = opts.unitPrice;
  let left = opts.gross;
  const rows: ResolvedDiscount[] = [];

  for (const d of opts.list) {
    let row: ResolvedDiscount;
    if (d.price !== undefined) {
      if (opts.instalment) throw opts.fail('a `price` discount cannot apply to an instalment.');
      const price = toPaise(d.price);
      if (price >= unit) throw opts.fail(`the discounted price must be below ${money(unit)}.`);
      const was = `${opts.regular && unit === opts.unitPrice ? 'the regular ' : ''}${money(unit)}`;
      row = {
        label: d.reason ?? 'Reduced price',
        note: `${money(price)}${per ? ` ${per}` : ''} instead of ${was}`,
        amount: Math.round((unit - price) * opts.quantity),
      };
      unit = price;
    } else if (d.units !== undefined) {
      if (opts.instalment) throw opts.fail('a `units` discount cannot apply to an instalment.');
      if (d.units > opts.quantity) throw opts.fail(`only ${opts.quantity} can be free, not ${d.units}.`);
      row = {
        label: d.reason ?? `${d.units} free`,
        note: `${d.units} × ${money(unit)}`,
        amount: Math.round(unit * d.units),
      };
    } else if (d.percent !== undefined) {
      row = {
        label: d.reason ?? 'Discount',
        note: `${d.percent}% of ${money(left)}`,
        amount: Math.round((left * d.percent) / 100),
      };
    } else {
      row = { label: d.reason ?? 'Discount', amount: toPaise(d.amount!) };
    }
    left -= row.amount;
    if (left < 0) throw opts.fail('its discounts come to more than the line.');
    rows.push(row);
  }
  return rows;
}

export function computeInvoice(
  data: InvoiceData,
  profiles: Record<string, ClientProfile>,
  options: { gstin?: string },
): ComputedInvoice {
  const { details, profile } = resolveClient(data, profiles);

  if (data.taxes.length > 0 && !options.gstin) {
    throw new InvoiceError(
      data.number,
      'GST can only be charged with the studio\'s GSTIN. Add `gstin` to invoices/settings.json, or remove `taxes`.',
    );
  }

  const lines: ResolvedLine[] = data.lines.map((line) => {
    const priced = priceLine(line, profile, data.number);
    const unitPrice = toPaise(priced.price);
    const fee = Math.round(unitPrice * line.quantity);
    const gross = line.instalment
      ? instalmentAmount(fee, line.instalment.part, line.instalment.of)
      : fee;

    const discounts = applyDiscounts({
      list: line.discount === undefined ? [] : [line.discount].flat(),
      gross,
      unitPrice,
      quantity: line.quantity,
      unit: priced.unit,
      regular: priced.source === 'catalog',
      instalment: Boolean(line.instalment),
      fail: (message) => new InvoiceError(data.number, `"${priced.description}": ${message}`),
    });
    const discount = discounts.reduce((a, d) => a + d.amount, 0);

    return {
      description: priced.description,
      detail: priced.detail,
      billing: priced.billing,
      unit: priced.unit,
      quantity: line.quantity,
      unitPrice,
      instalment: line.instalment,
      gross,
      discounts,
      discount,
      net: gross - discount,
      accent: priced.accent,
      intro: priced.intro,
      priceSource: priced.source,
    };
  });

  const upcoming: ResolvedUpcoming[] = data.upcoming.map((u) => {
    const custom = u.service ? profile?.services[u.service] : undefined;
    const catalog = u.service ? CATALOG[u.service] : undefined;
    if (u.service && !custom && !catalog) {
      throw new InvoiceError(data.number, `unknown upcoming service "${u.service}".`);
    }
    const amount =
      u.amount ?? custom?.price ?? (u.service ? profile?.rates[u.service] : undefined) ?? catalog?.price;
    if (amount === undefined) {
      throw new InvoiceError(
        data.number,
        `the upcoming "${u.description ?? u.service}" has no price. Set \`amount\`, or an agreed rate in the client's profile.`,
      );
    }
    return {
      description: u.description ?? custom?.description ?? catalog!.name,
      amount: toPaise(amount),
      starts: u.starts,
    };
  });

  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const oneTimeSubtotal = sum(lines.filter((l) => l.billing === 'once').map((l) => l.gross));
  const monthlySubtotal = sum(lines.filter((l) => l.billing === 'monthly').map((l) => l.gross));
  const subtotal = sum(lines.map((l) => l.gross));
  const discountTotal = sum(lines.map((l) => l.discount));
  const discountsByLabel: ComputedInvoice['discountsByLabel'] = [];
  for (const d of lines.flatMap((l) => l.discounts)) {
    const same = discountsByLabel.find((x) => x.label === d.label);
    if (same) same.amount += d.amount;
    else discountsByLabel.push({ label: d.label, amount: d.amount });
  }
  const taxable = subtotal - discountTotal;
  const taxes = data.taxes.map((t) => ({ ...t, amount: Math.round((taxable * t.rate) / 100) }));
  const total = taxable + sum(taxes.map((t) => t.amount));
  const received = toPaise(sum(data.payments.map((p) => p.amount)));
  const balance = total - received;
  const monthlyRunRate = sum(
    lines.filter((l) => l.billing === 'monthly').map((l) => Math.round(l.net / l.quantity)),
  );

  if (received > total) {
    throw new InvoiceError(data.number, 'more has been received than the invoice total.');
  }

  const derived: InvoiceStatus = balance <= 0 ? 'paid' : received > 0 ? 'part-paid' : 'due';
  const everyFigure = [
    ...lines.flatMap((l) => [l.unitPrice, l.gross, l.net, ...l.discounts.map((d) => d.amount)]),
    ...taxes.map((t) => t.amount),
    total,
    received,
    ...upcoming.map((u) => u.amount),
  ];

  return {
    client: details,
    reference: data.reference ?? details.reference,
    due: data.due,
    lines,
    upcoming,
    oneTimeSubtotal,
    monthlySubtotal,
    subtotal,
    discountTotal,
    discountsByLabel,
    taxes,
    total,
    received,
    balance,
    monthlyRunRate,
    status: data.status ?? derived,
    decimals: everyFigure.some((p) => p % 100 !== 0),
  };
}

/** Which promo entries this invoice should not advertise, because it already bills them. */
export const promoCovered = (data: InvoiceData): Set<PromoKey> =>
  new Set(
    [...data.lines.map((l) => l.service), ...data.upcoming.map((u) => u.service)].flatMap(
      (key) => (key ? (PROMO_COVERED_BY[key] ?? []) : []),
    ),
  );

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  due: 'Due',
  'part-paid': 'Part paid',
  paid: 'Paid',
  overdue: 'Overdue',
};

/** A UPI payment URI, as UPI apps read it from a QR code. */
export const upiUri = (opts: {
  upiId: string;
  payee: string;
  note: string;
  amountPaise?: number;
}): string => {
  // The UPI ID goes in as written: some apps fail to match a payee whose "@"
  // arrives as %40. Everything else is encoded, spaces as %20 rather than "+",
  // which some apps show literally.
  const params = [`pa=${opts.upiId}`, `pn=${encodeURIComponent(opts.payee)}`];
  if (opts.amountPaise !== undefined) params.push(`am=${(opts.amountPaise / 100).toFixed(2)}`);
  params.push('cu=INR', `tn=${encodeURIComponent(opts.note)}`);
  return `upi://pay?${params.join('&')}`;
};
