---
name: careinflow-design
description: Design system rules for the CareInflow website — tokens, type, layout, motion, component patterns. Use whenever building or editing any page, component or style in this repo.
---

# CareInflow design system — "Clinical Cyan"

Source of truth: `docs/design/careinflow-design-system.dc.html` (direction 2a only; 2b/2c are historical). Tokens live in `src/styles/global.css` under `@theme` — always use the token, never a raw hex.

## Palette — "Clinical Cyan"

Cool base, navy-black ink, vivid clinical teal. Direction 2a's *colour* section is superseded; its type, layout, spacing and motion still stand.

| Token | Value | Use |
|---|---|---|
| `canvas` / `surface` | `#F5F8FA` / `#FFF` | cool page base — never warm beige |
| `line` / `hairline` | `#DDE5EA` / `#E9EFF3` | borders, dividers |
| `ink` | `#0A1622` | headings, primary buttons, text on vivid teal |
| `surgical` | `#076C63` | the AA-safe teal for text, labels, links |
| `vivid` | `#00B3A4` | fills and colour blocks — **never text on light** |
| `pass` | `#007A59` | verified measurements only |
| `body` / `muted` / `faint` | `#47576B` / `#5A6B7D` / `#606E7C` | text hierarchy |
| `panel*` | `#0A1622` … `#45E0CE` | navy block family |

**Contrast rules that were measured, not assumed.** White on vivid teal is 2.6:1 — a vivid block takes **ink** text. Vivid teal alone cannot carry a UI boundary against white (2.6:1), so focus rings use `surgical` (6.3:1). Every deep accent clears 4.5:1 on both canvas and its own tint.

## Accents

Five hues, assigned in `src/lib/accents.ts` — never hand-picked. Each has three values: `-vivid` (fills, top rules, dots), the bare name (AA-safe text), `-tint` (large light areas).

| Accent | Owns |
|---|---|
| green/teal `#00B3A4` | brand, healthcare websites |
| amber `#D97706` | Google Business Profile |
| blue/indigo `#4338CA` | local SEO |
| teal/cyan `#0E7490` | website care, free review |
| plum/violet `#7C3AED` | social media, patient articles |

## Colour blocking

Colour is structural, not decorative. Sections alternate `surface → canvas → accent tint band → navy block`, and small elements (chips, step numbers, card top rules, the live dot) carry real saturation.

**No gradients, no glassmorphism, no glowing borders** — crisp edges are deliberate, so the site does not read like every AI-generated template. One navy block and one tint band per page; at most one vivid block.

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

Reuse before building: `SectionHead` (tick-rule + mono label + heading + lede), `CtaPanel` (closing CTA, takes `prefill` and `nextStep`), `CtaStrip` (one-line mid-page CTA), `FaqSection`, `LiveBadge`, `Header`, `Footer`.

Section labels are **plain language** in the mono style: "What we do", "Where patients look", "Our work", "Questions". The medical-record vocabulary (CHART, TRIAGE, PROTOCOL) was retired — it read cold and worked against comprehension. Still never "Solutions" or "Why choose us".

## Imagery

Never a card with a fictional clinic name — a visitor must never wonder whether CareInflow is itself a clinic. Use the illustration in `src/assets/`, real client screenshots in `src/assets/work/`, or nothing. All images go through `astro:assets` `<Image>` with `widths`, `sizes` and real alt text. Hero images: `loading="eager"` + `fetchpriority="high"`; everything else lazy.

All imagery goes through **`IllustrationPanel`**, which has two modes:

- **Default** — photographic 3D product mockups (`src/assets/mockups/`). Rendered edge-to-edge inside a rounded, thin-bordered figure, constrained by `maxWidth`. These are the primary service and hero visuals: realistic device renders with grey placeholder UI and one teal accent, never gibberish text.
- **`blend`** — flat vector art on pure white, blended onto an accent tint with `mix-blend-multiply` so no pale rectangle floats inside a frame. Requires the near-white normalisation in the `careinflow-images` skill.

Portrait and studio photographs use a plain bordered `<Image>` directly and are never blended.

## Logo

`public/logo.svg` (ink) and `public/logo-light.svg` (paper, for dark panels), traced from `docs/brand/careinflow-logo-original.png`. Regenerate all brand assets with `node scripts/vectorize-logo.mjs && node scripts/generate-assets.mjs`. The traced path needs `fill-rule="evenodd"` — without it the counters inside the two lobes fill solid.
