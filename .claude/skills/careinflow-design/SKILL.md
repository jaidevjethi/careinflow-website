---
name: careinflow-design
description: The CareInflow design system — the ground ladder, palette, type, layout, motion and component rules. Use whenever building or editing any page, component or style in this repo.
---

# CareInflow design system — "Clinical Blue & Indigo"

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

| Token | Value | L* | b* | Role |
|---|---|---|---|---|
| `surface` | `#FFFFFF` | 100 | 0.0 | cards, and the lightest sections |
| `canvas` | `#F4F7FD` | 97.2 | −3.2 | default body |
| `powder` | `#E9EEF9` | 94.0 | −5.9 | quiet band |
| `mist` | `#DDE4F4` | 90.5 | −8.6 | quiet band |
| `panel` | `#0B2440` | 13.8 | — | midnight, reserved |

**Five, not six.** The two mid-tones (`deep`, `moss`) were deleted: at L*77
they cleared AA for only three of the six text tokens, which made every band
section typographically poorer than the rest of the site. There is no
`--color-deep`, no `--color-moss`, no `.band-deep` and no `.band-moss` — if you
find a reference to one, it is stale. Depth now comes from a dark band
(`.band-panel`), never a medium one.

Adjacent steps: surface→canvas 1.12, canvas→powder 1.12, powder→mist 1.13. A
`surface` card lifts 1.118 on canvas and 1.227 on powder.

**Nothing here is warm, and that is a hard rule.** The set before this one was
warm paper: `canvas` measured b* +5.4 in Lab, `line` +6.1, `hairline` +5.0, and
positive b* is the yellow axis, which is what beige is. Because `canvas` is the
default body ground, cream appeared on every page whether a section asked for it
or not. Every neutral now measures b* ≤ 0. If you add one, measure it.

Apply with `.band-powder` / `.band-mist` / `.band-panel`. They set background
and text colour only, so they wrap a `.section.shell` div to stay full-bleed.
Putting a band class directly on a `.shell` element constrains the colour to the
content width, which is wrong.

**Every page must change ground as you scroll.** The canonical sequence:

```
midnight hero → surface → canvas → powder → dark band → canvas → midnight CTA → footer
```

Short pages take a subset but must include at least one `powder` or `mist`.

### Text on the bands, measured

**All three light grounds carry all six text tokens**, so no section is
constrained by the ground it sits on. That is the point of deleting the
mid-tones: `ink`, `body-deep`, `body`, `muted`, `faint` and `surgical` all clear
AA on `surface`, `canvas`, `powder` and `mist`.

On `panel`, use the `panel-*` text tokens. The "vivid fills take ink text, never
white" rule still holds everywhere.

**Ink is a deep navy, never black.** `#0E2439` sits at the same hue as the
grounds. The previous ink was a blue-green near-black on blue grounds: two
families pretending to be one, which is precisely why it looked wrong on a band
rather than merely dark.

## Brand and accents

| Token | Value | Use |
|---|---|---|
| `surgical` | `#0F4C75` | primary; AA-safe as text at 8.30 on canvas |
| `vivid` | `#818CF8` | periwinkle indigo fill only; takes **ink** text (5.29), never white |
| `pass` | `#0A6E62` | verified measurements only |
| `ink` | `#0E2439` | deep navy. Headings and body on light, and on every vivid fill |
| `body` / `muted` / `faint` | `#33506E` / `#4A6685` / `#4E6883` | the same navy taken down in steps |

Five accents in `src/lib/accents.ts`, **named for the service, not the hue** —
the previous set was named green/amber/blue/teal/plum and stopped being true
the day the palette moved. Each has the bare name (AA-safe text), `-vivid`
(fills, bars, dots, never text on light) and `-tint` (large light areas).

| Accent | Owns | Text | Tint | hue | on its tint | worst light ground |
|---|---|---|---|---|---|---|
| `web` | healthcare websites | `#34419E` indigo | `#E3E3FB` | 296 | 6.95 | 6.88 |
| `seo` | local SEO | `#1A5ECB` blue | `#D6E7FD` | 289 | 4.76 | 4.70 |
| `gbp` | Google Business Profile | `#0E6A97` cyan-blue | `#CFEAF8` | 256 | 4.76 | 4.67 |
| `care` | website care | `#6039B2` violet | `#EEE0FC` | 308 | 6.13 | 6.05 |
| `social` | social media | `#8A3499` magenta | `#F8E1F4` | 323 | 5.63 | 5.44 |

Five hues on a cool arc from cyan-blue to violet, 256° → 323°. Smallest
pairwise deltaE between the text colours is **15.1** (`web`/`seo`); between the
tints it is 5.3 (`web`/`care`), where 2.3 is the point a human can see any
difference at all. Keep it that way; if you add an accent, measure deltaE
against all the others, not just contrast.

No accent sits in the sage band (hue 150–205) except `pass`, which stays green
on purpose because it means a verified measurement.

**Every one of these clears AA as text on all four light grounds and on its own
tint** — the worst case is `gbp` at 4.67 on `mist`. It was 4.35 until August
2026, which failed, and the fix was 1.9 points of L* at the same hue. If you
change an accent, recompute that whole column; the margins are thin by design
and eyeballing will not catch a 4.43.

Two things this set fixed. `web` and `gbp` were once the same deep teal, so the
website card and the Google card read as one block wherever they sat together.
And `care` was a warm sand-grey, the only accent that could not sit beside the
others without looking like a stain; periwinkle gives it a hue of its own.

**Interest comes from hue and depth, not from warmth.** A warm accent was tried
and removed. Five cool hues across a five-step ground ladder do the work it was
being asked to do.

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
