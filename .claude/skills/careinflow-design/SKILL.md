---
name: careinflow-design
description: Design system rules for the CareInflow website — tokens, type, layout, motion, component patterns. Use whenever building or editing any page, component or style in this repo.
---

# CareInflow design system — 2a "Instrument"

Source of truth: `docs/design/careinflow-design-system.dc.html` (direction 2a only; 2b/2c are historical). Tokens live in `src/styles/global.css` under `@theme` — always use the token, never a raw hex.

## Palette

| Token | Value | Use |
|---|---|---|
| `canvas` | `#F7F6F3` | page background — never pure white |
| `surface` | `#FFFFFF` | cards, alternating sections |
| `line` / `line-strong` / `hairline` | `#E4E1DA` / `#D8D4CB` / `#ECE9E2` | borders, dividers |
| `surgical` | `#0B5D4E` | labels, links, accents |
| `pass` | `#0B7D57` | **verified measurements only** — never decoration |
| `ink` | `#101613` | headings, primary buttons |
| `body` / `muted` / `faint` | `#4C5551` / `#5A625E` / `#61645C` | text hierarchy |
| `panel*` family | `#0E1714` … | the single dark panel |

**Max one dark ink panel per page. Never a dark theme.** The footer counts as its own panel and is exempt.

## Accents

Five muted hues extend the base palette so pages are not uniformly beige. Never hand-pick one — take it from `src/lib/accents.ts` (`serviceAccent`, `topicAccent`, `cycleAccent`), which returns literal class strings because Tailwind only emits utilities it can see as literals.

| Accent | Owns |
|---|---|
| green `#0B5D4E` | brand, healthcare websites, website articles |
| amber `#96601F` | Google Business Profile |
| blue `#1D4E6B` | local SEO |
| teal `#0F6763` | website care, the free review |
| plum `#6A3A57` | social media, patient-behaviour articles |

Saturated values are for **small elements only** — chips, code labels, 1–1.5px top rules. Large areas take the `-tint`. Body text, headings and section labels stay ink/green: accents identify, they do not decorate.

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

Section labels use record vocabulary — CHART, TRIAGE, PROTOCOL, INDICATION, STATUS, FINDINGS — numbered in order (`01 · TRIAGE — …`). Never "Solutions" or "Why choose us".

## Imagery

Never a card with a fictional clinic name — a visitor must never wonder whether CareInflow is itself a clinic. Use the illustration in `src/assets/`, real client screenshots in `src/assets/work/`, or nothing. All images go through `astro:assets` `<Image>` with `widths`, `sizes` and real alt text. Hero images: `loading="eager"` + `fetchpriority="high"`; everything else lazy.

**Illustrations always use `IllustrationPanel`**, never a bordered card. The artwork ships on pure white and the panel applies the accent tint under `mix-blend-multiply`, so the background disappears into the tint instead of floating as a pale rectangle inside a frame. This only works if the artwork's background is genuinely uniform white — see the `careinflow-images` skill for the normalisation step. Photographs (portrait, studio) keep a plain border and do **not** get blended.

## Logo

`public/logo.svg` (ink) and `public/logo-light.svg` (paper, for dark panels), traced from `docs/brand/careinflow-logo-original.png`. Regenerate all brand assets with `node scripts/vectorize-logo.mjs && node scripts/generate-assets.mjs`. The traced path needs `fill-rule="evenodd"` — without it the counters inside the two lobes fill solid.
