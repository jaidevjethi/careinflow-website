# Invoices

CareInflow's invoice template: one YAML file per invoice, rendered as a
branded A4 page you can check on screen and save as a PDF.

**Everything in this folder stays on your machine except this README and
`examples/`.** The repo is public, and client details, agreed prices and
payment details are private. `.gitignore` keeps them out. Back the folder up
the way you back up anything else that matters, because git will not.

The invoice pages exist only while `npm run dev` is running. No build of the
website can contain an invoice.

## Make an invoice

1. If this is a regular client, give them a profile once:
   `invoices/clients/<client-id>.yaml`. Start from
   `examples/clients/your-practice.yaml`. It holds their billing details and
   the prices you agreed with them.
2. Copy a sample from `examples/` to `invoices/2026/CI-2026-004.yaml` (any
   year folder works, and so does `invoices/` itself). The file name becomes
   the address: `/invoices/ci-2026-004/`.
3. Change the number, dates, client and lines, and delete `sample: true`.
4. Run `npm run dev` and open <http://localhost:4321/invoices/>. Every invoice
   is listed there. Open yours and check every figure.
5. Save it as a PDF, either way:
   - **In the browser:** click **Print or save as PDF**, choose *Save as PDF*,
     and leave paper at A4 and margins at Default. The page sets both.
   - **From the terminal:** `npm run invoice:pdf -- ci-2026-004` writes
     `invoices/pdf/CI-2026-004.pdf`. `npm run invoice:pdf -- --all` does every
     invoice. It uses your installed Chrome or Edge. If it cannot find one,
     set `CHROME_PATH`.

A mistake in a file (an unknown service, a missing price, a client with no
profile) stops that invoice with a message saying exactly what is wrong. The
list still shows the others.

## Prices: what an invoice bills

For each line, the first of these that exists wins:

1. `unitPrice` on the line itself, for a one-off figure.
2. The client's agreed price: `rates` in their profile, or one of their own
   `services`.
3. The published price in `src/config/pricing.ts`.

So a client with agreed rates needs nothing on the line but the service and
the quantity. The invoice prints only the agreed figure, never the published
one beside it.

Website Care and the multi-doctor build have no published price, so they
need `unitPrice` or an agreed rate. Without one, the invoice refuses to
render rather than guess.

## Payment details

Copy `examples/settings.example.json` to `invoices/settings.json` and fill in
what you have. Delete any line you do not use. The `REPLACE` values in the
example are invalid on purpose, so a forgotten one fails loudly instead of
printing.

| Setting | What it does |
|---|---|
| `upiId` | The UPI ID payments go to. Every invoice turns it into a **Pay with any UPI app** button and a QR code, both carrying the same payee, the amount still owed and the invoice number as the note. Without it the button is shown switched off and labelled, and the toolbar warns you. |
| `payeeName` | The name on that UPI account, as a payer's app shows it. Defaults to CareInflow. When it is a person's name, the invoice adds "Shows as …, CareInflow's founder", so a client paying a business invoice is not surprised by it. |
| `upiIncludeAmount` | On by default: the button and the QR carry the amount still owed. Some UPI apps decline a preset amount sent to a personal UPI ID; if a test payment fails for that reason, set this to `false` and the payer types the amount. |
| `upiTransactionRef` | Off by default. Adds the invoice number as the UPI transaction reference (`tr`). That field belongs to merchant payments, and on a personal UPI ID it can make an app decline the payment, so turn it on only for a merchant (business) UPI ID. The invoice number is in the payment note either way. |
| `upiQrImage` | Optional: the file name of a QR image you already have (a Google Pay code), saved in `invoices/`. The invoice reads it to see where it pays. If it pays the same UPI ID as `upiId`, it is not printed, because the generated code goes to the same place and also carries the amount. If it pays a different UPI ID, both codes are printed, each labelled. With no `upiId`, it is the only code shown and the button stays off. |
| `paymentLink` | Optional: an HTTPS payment page from a payment gateway (a Razorpay or Instamojo payment link). Printed as **Or pay online**. A browser opens an https link everywhere, which a `upi://` link cannot promise. An invoice can set its own `paymentLink`, e.g. a gateway link made for that amount. |
| `bank` | Account name, number, IFSC, bank and branch, for clients who pay by transfer. Printed in one line under the payment options. |
| `gstin` | Only once the studio is registered for GST. Without it, no invoice can carry tax lines. With it, the GSTIN prints in the header and an invoice with `taxes` is titled "Tax invoice". |

Nothing is ever filled in with an example. A missing detail prints as a
labelled placeholder, and the toolbar says what is missing.

WhatsApp is a link in the closing line ("Questions about any line? WhatsApp
us at …"), never a QR code, so the only codes on an invoice are ones that pay.

## The pay button: what it does, and where it works

The button is a real link inside the PDF (a link annotation, not styled
text), pointing at a standard UPI payment address:

```
upi://pay?pa=<UPI ID>&pn=<payee name>&am=<amount owed>&cu=INR&tn=Invoice%20<number>
```

The amount is what is still owed: the total after discounts and tax, less
anything already received. The QR code is generated from the same link, so
scanning and tapping always pay the same person the same amount. A paid
invoice shows no button and no code.

Tapping it asks the device to open whichever app handles `upi://`. That is
not something every PDF viewer allows, so the QR code, the UPI ID and the
payment note are always printed beside it.

| Where the PDF is opened | What happens | Checked |
|---|---|---|
| Chrome's "Save as PDF", and `npm run invoice:pdf` | Both buttons are kept as `upi://` links, with tap areas of about 43 × 7 mm and 57 × 7 mm; the QR decodes to exactly the same link | Yes, by reading the PDF |
| Firefox's PDF viewer, and any app built on pdf.js | The `upi://` links are dropped, so the button does nothing. Scan the code instead | Yes, with pdf.js |
| Android, in a PDF app such as Google Drive or Adobe Acrobat | Should offer the installed UPI apps | Not yet: needs a real phone |
| Android, from WhatsApp | WhatsApp hands the PDF to the phone's PDF app; as above | Not yet |
| iPhone (Files, Mail, Safari) | Opens a UPI app only if one has registered `upi://`; often nothing happens | Not yet |
| Desktop (Chrome, Edge, Acrobat) | No UPI app to open. The QR code is the way to pay | Not yet |

Before relying on it, send yourself an invoice and, on an Android phone and
an iPhone, open it from WhatsApp and from email, tap the button and check
that the app shows the right payee and amount. Pay a small invoice end to
end once. If Google Pay refuses the preset amount, turn `upiIncludeAmount`
off.

**The button never marks anything paid.** Tapping it only opens a payment
app; nothing reports back. An invoice changes to Part paid or Paid only when
you add a `payments:` entry to its file, once you have seen the money arrive
in the account. A payment gateway (see `paymentLink`) can confirm payments
automatically, but that needs the gateway's own account and webhook, which
this tool does not have.

## Invoice fields

```yaml
number: CI-2026-004          # printed as written; also the payment reference
issued: 2026-11-01
due: 2026-11-07              # optional: without it, no pay-by date is printed
period: November 2026        # optional
client: your-practice        # a profile id, or write the details out:
# client:
#   name: Practice name
#   contact: Dr. Name
#   address: |
#     Line one
#     Mehsana, Gujarat 384002
#   phone: ...
#   email: ...
#   gstin: ...
reference: PO-123            # optional: the client's own reference

lines:
  - service: reel            # a service key (below) or a client's own service
    quantity: 8              # months for a monthly plan
    unitPrice: 650           # optional: a one-off agreed price
    detail: Eight reels for November   # optional second line
  - service: website-practice
    instalment: { part: 1, of: 2, label: to begin }   # half the project fee
  - service: content-growth
    rate: intro              # the introductory rate, first three billed months
  - description: Anything not in the catalog
    billing: once            # or monthly
    unit: piece              # project, month, page, once or piece
    unitPrice: 1500
    discount: { percent: 10, reason: ... }   # or { amount: 500 }
  - service: reel            # the regular price, then each reduction as its own row
    quantity: 24
    discount:
      - { price: 300, reason: First-client price }   # ₹300 each instead of the regular price
      - { units: 5, reason: First 5 reels free }     # 5 reels at the price reached so far

taxes:                       # only with a GSTIN in settings.json
  - { label: CGST, rate: 9 }
  - { label: SGST, rate: 9 }
payments:                    # money already received
  - { date: 2026-10-01, amount: 17500, note: advance, by UPI }
upcoming:                    # starts later: listed, never added to the total
  - { service: google-care, starts: the month after launch }
notes:
  - Printed above the standard terms.
paymentLink: https://...     # optional: this invoice's own link
promo: [website, review]     # optional: which "Also from CareInflow" items; false hides it
status: overdue              # optional: otherwise Due, Part paid or Paid, worked out
sample: true                 # marks the invoice as a sample
```

All amounts are in rupees. The invoice works in paise internally, so a
percentage or a tax rate never leaves a rounding error in a total.

### Service keys

Each key bills the published name and price from `src/config/pricing.ts`,
unless the client has an agreed rate for it.

| Key | Service | Billed |
|---|---|---|
| `website-foundation` | Foundation Website | once |
| `website-practice` | Practice Website | once |
| `website-growth` | Growth Website | once |
| `website-multi` | Multi-Doctor / Multi-Location Website (needs a price) | once |
| `google-care` | Local SEO & Google Care | monthly |
| `website-care` | Website Care (needs a price) | monthly |
| `content-starter`, `content-growth`, `content-plus` | Content packages (`rate: intro` allowed) | monthly |
| `reel`, `reel-advanced`, `reel-complex` | Healthcare reels | per piece |
| `post`, `flyer`, `carousel`, `carousel-research` | Posts, flyers, carousels | per piece |
| `gbp-rebuild` | Google Business Profile rebuild | once |
| `takeover-audit` | Website takeover audit | once |
| `extra-page` | Extra treatment or area page | per page |
| `gujarati-version` | Gujarati version of an existing site | once |

## What prints, and why

- **One-time and monthly lines are grouped apart**, and the summary shows the
  monthly figure as a separate "Monthly recurring" row under the amount
  payable. Later months are never added to this invoice's total.
- **A discount is its own row, under its line.** The line shows the regular
  price; each discount follows in order, with what it is for and how it was
  worked out ("₹300 each instead of the regular ₹699", "5 × ₹300"), and the
  summary repeats them by name. `price` sets a new unit price, `units` frees
  that many units at the price reached so far, `percent` takes a share of
  what is left, and `amount` takes a fixed sum. The content packages'
  introductory rate is not a discount: the line prints the regular rate
  beside it, as the website does.
- **No pay-by date unless you set one.** Without `due`, the invoice prints no
  due date and no "please pay by".
- **The terms are the published ones** (`src/content/faqs.json`): builds paid in
  two halves or three parts, monthly plans billed in advance with no lock-in.
  Each prints only when the invoice has the thing it is about.
- **"Also from CareInflow"** shows two services this invoice does not already
  bill, with their published starting prices (`PROMO` in
  `src/config/invoice.ts`). If it is the only thing pushing an invoice onto a
  second page, it is left off.
- **Long invoices run to a second page** cleanly: rows, the summary, the
  payment panel and the footer never split, the column headings repeat, and
  every page carries the invoice number and "Page n of N".
