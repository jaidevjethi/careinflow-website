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
| `social` | healthcare content and reels | `#8A3499` magenta | `#F8E1F4` | 323 | 5.63 | 5.44 |

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

Motion here behaves like an instrument settling: short, exact, once, on one
easing. Things arrive and settle; every touch is answered; the drawings
assemble. Nothing loops (bar the hero's 7px "live" dot), nothing parallaxes,
nothing counts up, and no library drives any of it. The before/after
measurements are in `docs/launch/motion-upgrade-2026-10.md`.

**Tokens** (`@theme`): `--ease-instrument`; `--duration-enter` 240ms (things
arriving), `--duration-hover` 200ms (hover, focus and colour state changes),
`--duration-exit` 160ms (things leaving), `--duration-press` 100ms (a tap);
`--stagger` 60ms; `--rise` 8px. A new rule reads a token; it never writes a
literal duration. (The estimator script writes 200ms out once, with a
comment: reading the token back cost more bytes than the effect.)

**What may move:** `opacity` and the transform family (`transform`,
`translate`, `scale`), plus colour on a state change (a border or background
on hover or selection). Never width, height, top or shadow. One documented
exception: the FAQ answer's height opens over 240ms (`::details-content`),
because it is user-initiated and an answer that jumps open shoves every
question below it without warning.

**Pure CSS.** JavaScript animates only a value that changed because of input
(the estimator's total settles through the Web Animations API). No
libraries, no scroll listeners, no IntersectionObserver.

### Two kinds of entrance

- **The hero, by the clock, on load.** The H1 and the lede are visible from
  the first frame and settle 6px with no fade (`.hero-settle`, the lede one
  stagger step later with `[--i:1]`). The label, buttons, chips and facts fade
  and rise in one step apart (`.hero-in [--i:N]`, N at most 3). The hero
  photograph never animates. **Nothing that can be the page's largest element
  ever starts at opacity 0**: Chrome does not count an element painted at
  opacity 0 as an LCP candidate, and until 2026-10-11 every page's LCP was
  being measured on the quick bar's 14px text because of it. On a phone the
  lede is often the largest element, which is why it settles rather than
  fades.
- **Everything below, by scroll position.** `.reveal`, `.reveal-group` (each
  child owns its `view()` timeline; columns cascade 0/24/48px via
  `nth-child(3n…)`), `.settle` (numerals, a beat later), `.tick-rule` (the
  plot), and the drawings (`.v-assemble` on the `<svg>`, its parts wrapped in
  `<g class="v-part [--p:N]">`, assembling 40px of scroll apart). Timelines
  are inset 72px for the header and 60px for the quick bar, and ranges are
  fixed pixels, so anything is fully opaque 96px after it appears, whatever
  its height. Fill is `backwards`, and entrances move `translate`, never
  `transform`, so a card's hover lift still composes on top.
- **Reading progress** on guides and case studies only (`progress` on
  `BaseLayout`): a 2px `panel-accent` line under the header on a
  `scroll(root)` timeline. Absent under reduced motion.

**Scroll-linked on purpose.** Visibility is a pure function of scroll
position, so content reached by an anchor, a restored scroll position or
find-in-page is simply visible. CSS scroll-*triggered* animations
(`timeline-trigger`) were prototyped on 2026-10-11 and rejected: cards
brought into view by a jump stayed at opacity 0 until a real scroll.

**Never inside a scroll container.** `overflow: hidden` or `auto` makes an
element a scroll container even when it never scrolls, and `view()` then
measures against that box instead of the window. An entrance inside one can
stop part-way: the price numerals sat at 75% opacity for exactly this reason.
A card that holds an entrance or a drawing takes `overflow-clip`, which clips
identically and is not a scroll container. A guard in `global.css` turns off
any entrance that still ends up inside an `overflow-*` utility.

### Answering the visitor

- **Hover** (2px lift, border to `line-hover`, 200ms) only for
  `(hover: hover) and (pointer: fine)`: on a phone `:hover` sticks to the last
  thing tapped. Keyboard focus gets the same lift (`:focus-visible`, or
  `:has(:focus-visible)` for a `.card-link` card). Every button and card
  answers `:active` with a 100ms press. `.card-hover` lives in the
  **utilities** layer: in `components` it lost to every card's `border-line`
  utility and its border change never once showed.
- **Arrows:** a link that goes somewhere ends in
  `<span class="go" aria-hidden="true">→</span>`, which nudges 3px on hover
  or focus of the link or its card. Screen readers no longer hear "right
  arrow".
- **Card pictures** sit in a `.card-media` frame (it carries the border the
  image used to) and scale 1.02 inside it with the card.
- **Menus** open with the rise and close in 160ms (`@starting-style` plus
  `transition-behavior: allow-discrete`). The Services panel still never
  opens on hover.
- **Selections** show: an estimator option takes a surgical border on the
  surgical tint (`has-checked:`; every text token clears AA on it, lowest
  4.65), and the total settles when it changes.
- **Pages:** a 240ms cross-document view transition, opted into only under
  `prefers-reduced-motion: no-preference`. The header and quick bar keep
  their place (`view-transition-name`) while the body crossfades.

`prefers-reduced-motion` turns all of it off, view transitions included;
print resolves every entrance to its end state.

**Verify in a real window.** Device emulation (DevTools, or the app's
browser pane at phone sizes) switches scroll timelines off, so a phone check
there proves nothing. Use headless Chrome at `--window-size=500,900` and read
computed opacity at each scroll stop: nothing 150px into view may be below 1.

## Components

Reuse before building: `PageHero`, `SectionHead`, `CtaPanel`, `CtaStrip`,
`FaqSection`, `PriceEstimator`, `IllustrationPanel`, `Header`, `Footer`.

`.card-link` makes a whole card clickable from one link inside it, so the anchor
keeps its own short accessible name instead of swallowing every word in the
card. Use it rather than wrapping a content-heavy card in an `<a>`.

**The Services menu** in the header is the site's one disclosure menu. A
`<button>` with `aria-expanded` and `aria-controls`, opened by click or Enter,
closed by Escape (focus returns to the button), a click outside, or focus
leaving it. It never opens on hover: a menu that appears under a passing cursor
is a menu that covers the page by accident, and a phone has no hover at all.
The panel is midnight (`bg-panel`, `border-panel-line`) with the one shadow
recipe; it opens with the entrance rise and closes in 160ms, moving only
`opacity` and `translate`. On a phone the same links sit
nested and indented in the mobile menu rather than behind a second toggle.

**Clients are text marks until a logo is supplied with permission.** The
practice name set in type, never a monogram tile, which a visitor would read as
the client's own logo.

## Imagery

**Never a card with a fictional clinic name** — a visitor must never wonder
whether CareInflow is itself a clinic. Any sample interface carries an
`ILLUSTRATIVE` label and, where possible, a link to real work.

### Pictures: what goes where (owner's decision, 2026-10-08)

Every page carries pictures all the way down; a run of text cards reads as dull
however good the words are. Four kinds of picture, one job each:

1. **The hero takes a photograph** (or a photo-real render), never a drawn
   illustration. The first thing a doctor sees is a moment from their world: a
   consultation, a clinic, a patient on a phone, the work on a real device. It
   sits in the `PageHero` aside at 3:2, `rounded-3xl border-panel-line`,
   `loading="eager"` + `fetchpriority="high"`, and it shows on a phone too,
   under the buttons. (The drawn illustrations went into the heroes for an
   afternoon and the owner asked for the photographs back: on midnight, a
   drawing reads as a diagram, a photograph reads as somewhere real.)
2. **Drawn illustrations explain the work, in the body.** The SVG visuals in
   `src/components/visuals/` show what a deliverable looks like: Gujarati where
   a patient would read Gujarati, a range of specialties and never only dental,
   "Your Practice" for any name, always `ILLUSTRATIVE`. Each sits beside the
   section that sells its work.
3. **Screenshots are for real work only**: case studies and portfolio cards,
   chipped "Client work" or "Sample".
4. **Diagrams for sequences**: `ServiceDiagram`, the method page.

| Page | Hero photograph | Pictures in the body |
|---|---|---|
| Home | `hero-founder-consult` — a doctor and a designer at a laptop | five service illustrations; the four-website row; "Where patients look": the three-pillar `HeroVisual` beside the heading, then four surface photographs; a photograph in How it works and in Why CareInflow; twelve specialty photographs; guide covers |
| Services index | `services-device-suite` render | each service's illustration in its row |
| A service | its own `heroImage` (frontmatter): the moment the service exists for | its illustration beside the price section; its diagram; real work |
| Pricing | `pricing-consult` — a designer and a doctor over an estimate | the content, website and Google illustrations at their sections; the written-quote `QuoteVisual` in the promise panel |
| Portfolio (`/work`) | none: the first section is all screenshots | screenshots |
| Case study | its cover screenshot | its screenshots |
| Specialty / area / article | its own photograph | — |
| Specialties, areas index | render / map | photographs in the grids |
| About, contact | the founder at work / a consultation | — |
| Method, FAQ | render | process photographs |
| Privacy, 404 | none | — |

A new page picks its row before it is built. A redesign moves a picture, it
never trades one for text, and removing an image from the homepage needs the
owner's say-so.

**Never in any new picture**, generated, rendered or chosen from the library: a
seal or badge that certifies nothing; a real organisation's site or name shown
as if it were our work (a library shot of a laptop showing "Apollo Hospitals
India" sat in the websites hero until 2026-10-08); a number or star rating,
which reads as a promised result; an office full of staff, because this is one
studio with one founder; an invented clinic or company name where "Your
Practice" would do. The platform a service is about may appear as itself (a
Google listing can look like Google). Two older homepage mockups predate this
and name invented clinics ("Smile Dental Clinic", "Medica"); they stay until
they are regenerated, because removing a homepage picture needs the owner's
say-so.

Real client screenshots live in `src/assets/work/`, generated editorial
photography in `src/assets/editorial/`, device renders in `src/assets/mockups/`
behind `IllustrationPanel`. All images go through `astro:assets` `<Image>` with
`widths`, `sizes` and real alt text; hero images `loading="eager"` +
`fetchpriority="high"`, everything else lazy.

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
