---
name: careinflow-design
description: Design system rules for the CareInflow website — tokens, type, layout, motion, component patterns. Use whenever building or editing any page, component or style in this repo.
---

# CareInflow design system — "Midnight & Citrus"

Source of truth: `docs/design/careinflow-design-system.dc.html` (direction 2a only; 2b/2c are historical). Tokens live in `src/styles/global.css` under `@theme` — always use the token, never a raw hex.

## Palette — "Midnight & Citrus"

Warm stone base with real depth, midnight navy for the moments that matter, citrus amber as the signature. Direction 2a's *colour* section is superseded; its type, layout, spacing and motion still stand.

| Token | Value | Use |
|---|---|---|
| `canvas` / `surface` | `#E9E4DA` / `#F7F4EE` | warm stone body — **never white, never pastel** |
| `line` / `hairline` | `#D6CFC2` / `#DFD9CE` | borders on stone |
| `ink` | `#0A1628` | headings and text on stone; text on every vivid fill |
| `vivid` | `#FFB020` | citrus — CTAs, the headline accent, active nav |
| `surgical` | `#0A6B63` | AA-safe teal for small labels on light |
| `body` / `muted` / `faint` | `#3E4A5C` / `#4F5A6B` / `#59636F` | text hierarchy |
| `panel*` | `#0A1628` … `#FFB020` | midnight family |

**Measured, not assumed.** White on citrus and white on vivid teal both fail — every vivid fill takes **ink** text (ink on citrus is 9.9:1). On midnight, `panel-text` is 10.5:1 and citrus is 9.9:1. All 21 pairs were computed before shipping.

## Where midnight goes

Midnight is a *moment*, not a theme. It owns the **header, the hero, the CTA panel, the footer and the mobile bar** — so the top and bottom of every page are one continuous dark block with the stone body between them. At most one additional midnight section per page. The body never goes dark.

**Every page opens with `PageHero`.** This is not optional and not only the homepage. Interior pages once opened on bare stone directly under the midnight header, at opener heights from 434px to 895px — which is precisely why the site read as a different site on every page. `PageHero` takes `label`, `title`, `lede`, and optionally `stats` (oversized numerals), `chips`, `breadcrumb`, `compact`, and an `aside` slot for a figure or illustration. Prefer `stats` on any page with genuine measured facts: the numeral strip is what fills the width and carries the premium feel. The homepage keeps its own taller hero — it is the only page allowed to be an event — but shares the vocabulary.

## Accents

Five hues in `src/lib/accents.ts` — never hand-picked. Each has `-vivid` (fills, top rules, numerals), the bare name (AA-safe text), `-tint` (large light areas).

| Accent | Owns |
|---|---|
| green = clinical teal `#0E8C82` | brand, healthcare websites |
| amber = citrus `#FFB020` | Google Business Profile, and the signature |
| blue = indigo `#4B4BD6` | local SEO |
| teal = slate `#2E7D9A` | website care |
| plum = coral `#FF6B4A` | social media |

## Personality: oversized numerals

The one deliberate quirk. Where a number already exists — hero stats, method weeks, review checks, pricing principles, contact steps — it is set large and tight via `.numeral` in its accent colour. Confidence comes from scale and restraint, never from rounded blobs, mascots or rainbow gradients.

**No gradients, no glassmorphism, no glowing borders.** Crisp edges are deliberate, so the site does not read like every AI-generated template.

## Type

Manrope variable only for text; JetBrains Mono for labels, measurements and chips.

- Display: 800 weight, tracking `-0.045em`, `clamp()` sizing.
- Body: 18px / 1.62, max ~680px measure.
- Mono labels: 10–12px, uppercase, letter-spaced. Use `.label-mono` / `.chip`.
- Large tight numbers are the only ornament. Every measurement carries its reference range (`REF <1.2S`).

## Layout

1440 max width, `px-5 sm:px-10 xl:px-20`, 140–160px section rhythm (`py-20 sm:py-[120px]`), radius 12/16/24, exactly one shadow recipe (`shadow-card` / `shadow-card-lg`).

## Motion (hard rules)

One easing: `--ease-instrument`. Only `opacity` and `transform` animate — never width, height, top or shadow. Pure CSS; no animation libraries, no scroll listeners, no JS.

- Entrance: 240ms fade + 8px rise, once. Above the fold use `animate-rise` / `animate-fade`; below the fold use `.reveal` or `.reveal-group` (scroll-driven via `animation-timeline: view()`, behind `@supports`).
- Hover: 200ms 2px lift + border darken (`.card-hover`).
- Page transitions: cross-document `@view-transition`, 240ms.
- `prefers-reduced-motion` disables everything — already handled globally; never add motion that escapes it.

## Components

Reuse before building: `PageHero` (the midnight opener — every page), `SectionHead` (tick-rule + mono label + heading + lede, for sections *within* a page), `CtaPanel` (closing CTA, takes `prefill` and `nextStep`), `CtaStrip` (one-line mid-page CTA), `FaqSection`, `Header`, `Footer`.

Section labels are **plain language** in the mono style: "What we do", "Where patients look", "Our work", "Questions". The medical-record vocabulary (CHART, TRIAGE, PROTOCOL) was retired — it read cold and worked against comprehension. Still never "Solutions" or "Why choose us".

## Imagery

Never a card with a fictional clinic name — a visitor must never wonder whether CareInflow is itself a clinic. Use the illustration in `src/assets/`, real client screenshots in `src/assets/work/`, or nothing. All images go through `astro:assets` `<Image>` with `widths`, `sizes` and real alt text. Hero images: `loading="eager"` + `fetchpriority="high"`; everything else lazy.

All imagery goes through **`IllustrationPanel`** — photographic 3D product mockups (`src/assets/mockups/`), rendered edge-to-edge inside a rounded, thin-bordered figure and constrained by `maxWidth`. These are the primary service and hero visuals: realistic device renders with grey placeholder UI and one teal accent, never gibberish text. Inside a `PageHero` it goes in the `aside` slot at `maxWidth={400}`.

(There was a second `blend` mode for flat vector art on white. Every illustration moved to the mockups, no caller ever used it, and the branch was removed.)

Portrait and studio photographs use a plain bordered `<Image>` directly and are never blended.

## Logo

`public/logo.svg` (ink) and `public/logo-light.svg` (paper, for dark panels), traced from `docs/brand/careinflow-logo-original.png`. Regenerate all brand assets with `node scripts/vectorize-logo.mjs && node scripts/generate-assets.mjs`. The traced path needs `fill-rule="evenodd"` — without it the counters inside the two lobes fill solid.
