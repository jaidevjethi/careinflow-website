---
name: careinflow-funnel
description: CareInflow's conversion funnel — how every page earns and asks for the next step, which CTA belongs where, and how WhatsApp prefills work. Use when adding a page, editing CTAs, or changing navigation.
---

# CareInflow funnel

The whole site funnels to **one low-friction offer**: a free written review of the visitor's online presence, delivered on WhatsApp in two working days. Nothing else is sold on the site.

## The path

```
Any entry page
   → /contact  (the offer, explained)
      → WhatsApp message with the clinic's name
         → written review in 2 working days
            → fixed-price scope in writing (only if work is worth doing)
```

Trust is earned before it is asked for. A page may only ask once it has demonstrated something.

## What goes where

| Placement | Component | Rule |
|---|---|---|
| Header (every page) | "Contact us" → `/contact` | Low-commitment entry for cold visitors. Never a raw WhatsApp link — that asks too early. Uses `.btn-cta`, not `.btn-accent`: white text needs the darker `--color-cta` fill to pass on the midnight header. |
| Hero (home, contact) | Primary WhatsApp button + secondary `/contact` | Only pages where the visitor already arrived with intent. |
| Mid-page, after body content | `CtaStrip` | One calm line. Service pages, resource articles. |
| Page close (every page) | `CtaPanel` | Same card everywhere, word for word, plus `nextStep` for readers not ready yet. |
| Mobile, always | Sticky bar in `BaseLayout` | Two targets: `/contact` and WhatsApp. |

## `nextStep` chaining

`CtaPanel` takes an optional `nextStep` for visitors who want more evidence first. The chain reflects how a skeptical clinic owner reads:

home → services · services → work · work → pricing · pricing → contact · resources → services · about → work · process → pricing

## One enquiry page

There is exactly one, `/contact`, and it carries the free written review in
full. There used to be a second, `/free-review`, which split the same
conversion across two URLs and two sets of FAQs; it now redirects here. When
adding a CTA, the destination is `/contact` — never invent a parallel route.

## WhatsApp prefills

Never link a bare `wa.me`. Use `whatsappFor(key)` from `src/config/site.ts` so the message matches what the visitor was reading (`website`, `gbp`, `seo`, `care`, `pricing`, `work`, `default`). Every prefill ends with `Clinic name: ` so the visitor only has to type one thing.

## CTA copy rules

Confidence, never urgency. Approved: "Message us on WhatsApp" · "Get a free written review" · "Send your clinic's name" · "See the method" · "Book a consultation".

Banned: "Buy now", "Limited time", "Only today", "Last chance", countdowns, exit popups, fake scarcity. The founding-five count is real and may be stated plainly — never dressed as pressure.

Always pair the ask with the honest escape hatch: *if the answer is "change nothing", we will say that.* It is the reason the offer converts.

## Adding a new page

1. One clear job for the page, stated in the H1.
2. At least one objection removed in the body.
3. FAQs feeding `FAQPage` schema (add entries to `src/content/faqs.json` with the page key).
4. `CtaStrip` mid-page if the body is long; `CtaPanel` at the end with the right `prefill` and `nextStep`.
5. Internal links in and out — no orphans. Add to `FOOTER_GROUPS` or `NAV_ITEMS` if it is a destination.
