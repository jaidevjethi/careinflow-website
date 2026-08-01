---
name: careinflow-design
description: The CareInflow design system — the ground ladder, palette, type, layout, motion and component rules. Use whenever building or editing any page, component or style in this repo.
---

# CareInflow design system — "Clinical Blue & Teal"

Tokens live in `src/styles/global.css` under `@theme`. **Always use the token,
never a raw hex.** Type, layout, spacing and motion follow direction 2a
"Instrument" (`docs/design/careinflow-design-system.dc.html`); that document's
**colour section is historical** and so is the "Midnight & Citrus" palette that
briefly replaced it. Neither is the system. This file is.

Why the palette moved: midnight navy with saturated citrus reads as a fintech
product, and amber carries a warning signal in a clinical context. Healthcare
branding puts the trust foundation on blue and white. Blue reads as trust,
green as wellbeing, and warm neutrals under cool blues read premium where cold
neutrals read corporate.

## The ground ladder

A page has **six grounds, not two.** This is the most important rule here. The
site once owned only near-white and midnight with nothing between them, and
`canvas` sat 1.062 from `surface` — close enough that alternating sections were
invisible and a card barely lifted off the page behind it. Every page read flat
regardless of how good its type was.

| Token | Value | L | Role |
|---|---|---|---|
| `surface` | `#FDFCFA` | .974 | cards, and the lightest sections |
| `canvas` | `#F4EFE5` | .890 | default body |
| `powder` | `#D3E0EE` | .733 | powder-blue quiet band |
| `mist` | `#DCE7E8` | .789 | pale-teal quiet band, a hue turn away from powder |
| `sage` | `#9DBDB5` | .469 | mid-tone block |
| `slate` | `#A3B8C9` | .463 | mid-tone block, the alternate |
| `panel` | `#0E3348` | .029 | midnight, reserved |

Adjacent steps: surface→canvas 1.12, canvas→powder 1.17, mist→sage 1.60. A
`surface` card lifts 1.118 on canvas and 1.307 on powder.

`powder` replaced a warm stone `#EBE4D6`. A beige band inside a navy-and-teal
system reads as an unrelated colour rather than a quieter one; powder blue is
named in the research this palette came from and sits 7.2 deltaE from mist, so
the two never blur. Warmth lives in `canvas` and `sand`, not in a ground.

Apply with `.band-powder` / `.band-mist` / `.band-sage` / `.band-slate`. They set
background and text colour only, so they wrap a `.section.shell` div to stay
full-bleed. Putting a band class directly on a `.shell` element constrains the
colour to the content width, which is wrong.

**Every page must change ground as you scroll.** The canonical sequence:

```
midnight hero → surface → canvas → powder → mid-tone band → canvas → midnight CTA → footer
```

At most one mid-tone band per page. Alternate sage and slate between
neighbouring page types so the site does not go monotone when browsed in order.
Short pages take a subset but must include at least one `powder` or `mist`.

### Text on the bands, measured

On `sage` and `slate` **only `ink` (7.85) and `surgical` (5.26) clear AA.**
`body` reads 4.35, `muted` 3.26 and `faint` 2.72 — all failures. Ink for copy,
surgical for small labels, nothing else. This is the same rule as "vivid fills
take ink text", for the same reason. On `powder` and `mist` every text token
passes, which is why the quiet bands carry ordinary sections and the mid-tones
carry only sections you have checked.

`faint` is `#54616A`. It was `#5E6B72` and fell to 4.34 once the grounds
gained depth.

## Brand and accents

| Token | Value | Use |
|---|---|---|
| `surgical` | `#14425F` | primary; AA-safe as text at 9.28 on canvas |
| `vivid` | `#12B3A6` | teal fill only; takes **ink** text, never white |
| `pass` | `#0A6B63` | verified measurements only |
| `ink` | `#17242A` | headings and body on light, and on every vivid fill |
| `sand` | `#B8894A` | the one warm mark; small elements only, ink on it |
| `sand-deep` | `#A8763C` | large text only (3.53 on canvas); **never** body copy |

Five accents in `src/lib/accents.ts`, **named for the service, not the hue** —
the previous set was named green/amber/blue/teal/plum and stopped being true
the day the palette moved. Each has the bare name (AA-safe text), `-vivid`
(fills, bars, dots, never text on light) and `-tint` (large light areas).

| Accent | Owns | Text | Tint |
|---|---|---|---|
| `web` | healthcare websites | `#14425F` navy | `#DBE4EE` |
| `seo` | local SEO | `#1C5A86` blue | `#E4EEF7` |
| `gbp` | Google Business Profile | `#0B5F61` teal | `#CFE8E2` |
| `care` | website care | `#3A5668` slate | `#E8E4DD` warm |
| `social` | social media | `#3C654C` sage | `#D8E6D9` |

The tints were once five values within 1.6 deltaE, below the 2.3 threshold at
which a human can see any difference — two cards side by side looked identical.
They now spread across two lightness steps and four hues: closest pair 3.5,
mean 9.1. Keep it that way; if you add an accent, measure deltaE against all
the others, not just contrast.

`web` and `gbp` were also once the same deep teal, which made the website card
and the Google card read as one block wherever they sat together.

**Sand exists because an all-cool palette reads unconsidered.** It appears on
the `band-rule` of the quiet bands and nowhere large. It is not a second brand
colour and must never become one.

## Where midnight goes

Midnight is a *moment*, not a theme. It owns the **header, the hero, the CTA
panel, the footer and the mobile bar**, so the top and bottom of every page are
one continuous dark block with the body between them. **At most one additional
midnight section per page.** The body never goes dark.

A dark card inside a light section is a midnight moment too, and it will take
the eye before anything else on the page. Spend that weight on what you want
clicked. The homepage once gave a full dark panel to the least commercially
important of three cards, which pulled every visitor toward the smallest prize.

**Every page opens with `PageHero`** — not just the homepage. Interior pages
once opened on bare stone under the midnight header at opener heights from
434px to 895px, which is precisely why the site read as a different site on
every page. `PageHero` takes `label`, `title`, `lede`, and optionally `stats`,
`chips`, `breadcrumb`, `compact` and an `aside` slot. The homepage keeps its own
taller hero; it is the only page allowed to be an event.

**No hero should exceed about 72% of the viewport**, header included, so it is
always visible that the page continues.

### Hero stats are for the buyer

`stats` carries oversized numerals. Put facts a clinic owner can weigh there:
`4 weeks`, `Free`, `Fixed`, `Yours`, `Only`, `Never`. **Not** `<1.2s`, `95+`,
`AA` or `Valid`. Those are measurements the build owes and the reader cannot
judge; they belong in the work and in the written review. The medical-record
vocabulary (CHART, TRIAGE, PROTOCOL) and the `REF <1.2S` reference ranges were
retired for the same reason: they read cold and worked against comprehension.
Section labels are plain language in the mono style — "What we do", "Where
patients look", "Questions". Still never "Solutions" or "Why choose us".

## Personality: oversized numerals

The one deliberate quirk. Where a number already exists — method weeks, review
steps, pricing principles, contact steps — set it large and tight via
`.numeral` in its accent colour, usually `cycleAccent(i).text`. On midnight it
takes `text-surface` or `text-panel-accent`. Confidence comes from scale and
restraint, never from rounded blobs, mascots or rainbow gradients.

**No gradients, no glassmorphism, no glowing borders.** Colour arrives as solid
colour-blocked sections and saturated small elements. Crisp edges are the point,
so the site does not read like every AI-generated template. The one exception is
`.panel-depth`, a single-stop radial on midnight that reads as a lit surface
rather than a graphic effect.

## Type

Manrope variable only for text; JetBrains Mono for labels, measurements, chips.

- Display: 800 weight, tracking `-0.045em`, `clamp()` sizing.
- Body: 18px / 1.62, max ~680px measure.
- Mono labels: 10–12px, uppercase, letter-spaced. Use `.label-mono` / `.chip`.

## Layout

1440 max width, `px-5 sm:px-10 xl:px-20`, `--space-section` 112px / 72px mobile,
radius 12/16/24, exactly one shadow recipe (`shadow-card` / `shadow-card-lg`).

**Nothing may cross the viewport at any width.** Verify at 320px and 1440px with
`overflow-x` disabled: `scrollWidth === clientWidth` and no element with
`right > clientWidth`. Grid and flex children need `min-width: 0` — there is a
global guard — and `fieldset` additionally needs `min-inline-size: 0`, which
`min-width` cannot reach.

Grids must divide evenly. Nine cards go in three columns, never four, or one is
stranded on the last row and the set reads as unfinished.

## Motion (hard rules)

One easing: `--ease-instrument`. Only `opacity` and `transform` animate — never
width, height, top or shadow. Pure CSS; no animation libraries, no scroll
listeners, no JS.

- Entrance: 240ms fade + 8px rise, once. Above the fold `animate-rise` /
  `animate-fade`; below it `.reveal` / `.reveal-group`.
- Hover: 200ms 2px lift + border darken (`.card-hover`).
- `prefers-reduced-motion` disables everything, handled globally. Never add
  motion that escapes it.

## Components

Reuse before building: `PageHero`, `SectionHead`, `CtaPanel`, `CtaStrip`,
`FaqSection`, `PriceEstimator`, `IllustrationPanel`, `Header`, `Footer`.

`.card-link` makes a whole card clickable from one link inside it, so the anchor
keeps its own short accessible name instead of swallowing every word in the
card. Use it rather than wrapping a content-heavy card in an `<a>`.

## Imagery

**Never a card with a fictional clinic name** — a visitor must never wonder
whether CareInflow is itself a clinic. Any sample interface carries an
`ILLUSTRATIVE` label and, where possible, a link to real work.

Real client screenshots live in `src/assets/work/`, generated editorial
photography in `src/assets/editorial/`, device renders in `src/assets/mockups/`
behind `IllustrationPanel`. Choose by what the page does: renders where you are
showing the work, diagrams where you are explaining a sequence, photography only
where a real place or person is the point. All images go through `astro:assets`
`<Image>` with `widths`, `sizes` and real alt text; hero images `loading="eager"`
+ `fetchpriority="high"`, everything else lazy.

Chrome on Windows will not open a window under about 500px, so phone captures
must be taken at 500 or the right edge is silently cropped. See
`scripts/capture-work-shots.mjs`, which now guards against it.

## Logo

`public/logo.svg` (ink) and `public/logo-light.svg` (paper, for dark panels).
Regenerate with `node scripts/vectorize-logo.mjs && node scripts/generate-assets.mjs`.
The traced path needs `fill-rule="evenodd"` or the counters inside the two lobes
fill solid.

## Before you call it done

Load [careinflow-review](../careinflow-review/SKILL.md) and run its loop.
Measure colour rather than eyeballing it: contrast and the separation between
two grounds are arithmetic, and two neutrals that look different in your head
can be 1.06 apart, which is invisible.
