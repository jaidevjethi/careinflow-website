---
name: careinflow-funnel
description: CareInflow's conversion funnel — how every page earns and asks for the next step, which CTA belongs where, and how WhatsApp prefills work. Use when adding a page, editing CTAs, or changing navigation.
---

# CareInflow funnel

The site sells through **two low-friction offers**, both answered on WhatsApp, and nothing else:

1. **The free written review** — of a practice's website, Google listing and local search, delivered in two working days. The offer for website, Google and local-search intent, and the default everywhere.
2. **The sample-video reply** — a doctor sends the topic and one clip, and gets back what the edit would involve, the turnaround and the price. The offer for content intent (`/services/healthcare-content/`, `/services/reel-editing/`). The reply is free; **the editing is never free**, and the copy says so every time.

They are not competing routes, because they answer different visitors: a doctor who wants a website does not want to send a video, and a doctor with footage on their phone does not want a five-page audit. Use the one that matches what the page sells. Both land on one enquiry page, `/contact`.

There are **two ways to start the review, not one**. WhatsApp is pushed first everywhere. Booking has been a genuine second route since 2026-08-26 rather than a link in the footer — see **Booking** below.

## The path

```
Any entry page
   → /contact  (both offers, explained)
      ├→ WhatsApp message with the clinic's name        ← pushed first
      │     → written review in 2 working days
      │        → fixed-price scope in writing (only if work is worth doing)
      ├→ booked meeting, Calendly opened in a new tab from /contact
      │     → the same conversation, taken before the review instead of after
      └→ #content: WhatsApp with the topic and one sample clip
            → what the edit involves, turnaround and price
               → one reel, or a monthly package (only if it suits)
```

Content is the easier front door; websites and Google are the higher-value work. A content client is never pushed into a website, and a website client is never pushed into content. Sell the thing the practice actually needs.

Trust is earned before it is asked for. A page may only ask once it has demonstrated something.

## What goes where

| Placement | Component | Rule |
|---|---|---|
| Header (every page) | "Contact us" → `/contact` | Low-commitment entry for cold visitors. Never a raw WhatsApp link — that asks too early. Uses `.btn-cta`, not `.btn-accent`: white text needs the darker `--color-cta` fill to pass on the midnight header. |
| Hero (home) | Primary WhatsApp button + secondary `/contact`, and a quiet text link to the sample-video offer | Only pages where the visitor already arrived with intent. |
| Hero (contact) | WhatsApp + `Book a meeting` + `Or call`, plus one line pointing content visitors to `#content` | Three routes at three weights: green fill, periwinkle fill, outline. The meeting opens Calendly in a new tab. |
| Mid-page, after body content | `CtaStrip` | One calm line. Service pages, resource articles. Content pages pass `href`/`linkText` for the sample-video offer. |
| Page close (every page) | `CtaPanel` | Same card everywhere, word for word, plus `nextStep` for readers not ready yet. `offer="content"` swaps in the sample-video version on the two content pages; nowhere else. |
| Mobile, always | Sticky bar in `BaseLayout` | Two targets: `/contact` and WhatsApp. The page's `prefill` reaches the WhatsApp button, so a reel page opens a reel conversation. |
| `/contact`, below the review | `BookingPanel` | The link out to Calendly. Never above the review — offer the free, faster thing twice before asking for an hour. |
| `/contact`, `#content` | the sample-video offer | Short. Its own WhatsApp button with the `reel` prefill. |

## Navigation

Services ▾ · Portfolio · Pricing · Resources · About, plus "Contact us". The Services menu is a disclosure built from `SERVICE_MENU` in `src/config/site.ts`: the five services, with reel editing indented under healthcare content, and "All services". Method lives in the footer's Studio column. Towns live in the footer; there is no Areas menu.

## `nextStep` chaining

`CtaPanel` takes an optional `nextStep` for visitors who want more evidence first. The chain reflects how a skeptical clinic owner reads:

home → services · services → work · work → pricing · pricing → contact · resources → services · about → work · process → pricing · healthcare content → reel editing · reel editing → pricing#content

## One enquiry page

There is exactly one, `/contact`, and it carries both offers: the free written
review in full, and the sample-video offer at `#content`. There used to be a
second page, `/free-review`, which split the same conversion across two URLs
and two sets of FAQs; it now redirects here. When adding a CTA, the destination
is `/contact` or WhatsApp — never invent a parallel route.

## Booking

Booking lives in the `/contact` hero and in its own section at `#book`. Three rules:

- **Never embedded.** It was, briefly. In a frame at the width that section allows it measured 880×700 and never sent the resize message its own widget listens for, so the booking UI scrolled inside its own box. Calendly's page is responsive and gets the whole viewport. A link also costs the CSP nothing — no script host, no frame host — which is why `/privacy` can still say no third-party script but Clarity runs here.
- **It sits below the review, always.** Booking is a second route, not a competing one. A page that asks for an hour of a reader's time before it has offered them something free has asked too early.
- **`BOOKING_URL` is the event, not the profile**, so the hero button, the footer link and the section all land in the same place. Every link to it opens in a new tab.

## WhatsApp prefills

Never link a bare `wa.me`. Use `whatsappFor(key)` from `src/config/site.ts` so the message matches what the visitor was reading (`website`, `gbp`, `seo`, `care`, `pricing`, `work`, `content`, `reel`, `default`). Every prefill ends with `Clinic name: ` so the visitor only has to type one thing. Package cards build their own opening naming the package, the way /pricing does for the website packages.

## Tracking

Microsoft Clarity is the only analytics. `Analytics.astro` records a custom event when a visitor presses a WhatsApp, call, booking or client link, so the conversion — a WhatsApp click, since the site has no form — is visible by page. Nothing about the message itself is recorded. Adding another analytics product means a CSP change in `public/_headers` and a new paragraph on `/privacy`, so it is a decision, not a snippet.

## CTA copy rules

Confidence, never urgency. Approved: "Message us on WhatsApp" · "Get a free written review" · "Send your clinic's name" · "Send one sample video" · "See the method" · "Book a consultation".

Banned: "Buy now", "Limited time", "Only today", "Last chance", countdowns, exit popups, fake scarcity, "save", "% off". The content packages' introductory rate is a published rule for every new client, not an offer: it never appears in a CTA, never carries a deadline, and is always shown beside the regular price.

Always pair the ask with its honest escape hatch: *if the answer is "change nothing", we will say that* for the review; *we tell you what it involves and what it costs, we do not edit it for free, and there is no obligation* for the sample video. It is the reason the offer converts.

## Adding a new page

1. One clear job for the page, stated in the H1.
2. At least one objection removed in the body.
3. FAQs feeding `FAQPage` schema (add entries to `src/content/faqs.json` with the page key).
4. `CtaStrip` mid-page if the body is long; `CtaPanel` at the end with the right `prefill`, `offer` and `nextStep`.
5. Internal links in and out — no orphans. Add to `SERVICE_MENU`, `FOOTER_GROUPS` or `NAV_ITEMS` if it is a destination.
