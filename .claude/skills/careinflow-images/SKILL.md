---
name: careinflow-images
description: How to create, capture and optimize imagery for the CareInflow website — Gemini generation prompts, real client screenshots, and the astro:assets pipeline. Use when adding or replacing any image.
---

# CareInflow imagery

Three sources, in order of preference: **real screenshots** > **style-locked generated illustration** > **hand-built SVG**. Never stock photography, never a card mocked up with a fictional clinic name.

## The confusion rule

A visitor must never wonder whether CareInflow is itself a clinic. Any sample interface must either be a real client site (labeled with the client's name) or a generic illustration with no invented brand. If a mockup needs a placeholder name, it says "Your Practice" — never an invented clinic.

## Real client screenshots (best)

`node scripts/capture-work-shots.mjs` drives local headless Chrome at 2× and downsamples into `src/assets/work/`. Edit the `SHOTS` array to add a page. Captions must say the shot is a live site, not a mockup.

Headless Chrome on Windows enforces a minimum window width, so `--window-size=390,…` does **not** give a true 390px viewport — mobile screenshots are cropped, not reflowed. For genuine mobile rendering use the Browser pane (`resize_window` + `computer{action:"screenshot"}`).

## Generated illustration (Gemini 3 Pro Image)

Load the `gemini-3-pro-image` skill; the key is `GEMINI_API_KEY` in the gitignored `.env`. Append this style lock to every prompt:

> Minimal flat vector editorial illustration on a pure white background #FFFFFF. Cool clinical palette only: deep navy #0E2439 line work, cool ice #EDF3F9 and powder blue #DFE9F5 surfaces, one periwinkle indigo #818CF8 accent, muted blue-grey fills. Clean geometric shapes, thin confident strokes, generous whitespace. Absolutely no readable words, no letters, no numbers, no logos, no brand names — text is suggested only as abstract soft blue-grey placeholder bars. No gradients, no drop shadows, no 3D. No beige, cream, sand, tan or warm grey anywhere — every neutral must be cool.

The accent is `vivid #818CF8`, the live brand periwinkle. This lock said teal
`#0FBFAE` until 2026-08-06, left over from the retired "Clinical Blue & Teal"
palette — a generator given it produced art that matched nothing on the site.

The warm half of that lock is not a preference, it is the one thing most likely to come back wrong. The palette moved to "Clinical Blue & Teal" and every neutral now measures b\* ≤ 0 in Lab; positive b\* is the yellow axis, which is beige, and it is banned. A generator asked for "off-white paper" will hand back cream every time, so name the hex and name the exclusions.

For photography (about page, studio warmth) use: natural window light, muted warm neutrals, no people, no readable text, 50mm, shallow depth of field.

**Area pages take photographs, not illustrations.** The nine `area-*.webp` are
cool-graded architectural shots of each town's landmark — Rani ki Vav for Patan,
the Bohra havelis for Siddhpur, Kirti Stambh for Palanpur, copper vessels for
Visnagar, a pumpjack for Kalol. They sit in the midnight `PageHero` aside, where
a flat white vector panel would read as a glaring hole. Match the register:

> Photorealistic editorial architectural photograph. Cool blue-teal colour grade, muted and desaturated, soft diffused early-morning light, gentle haze in the distance. Wide establishing shot, natural perspective, deep focus, high detail. No people in the foreground, no readable text, no signage, no lettering, no logos, no watermarks. Every neutral must be cool blue-grey — absolutely no beige, cream, sand, tan, gold or warm grey anywhere.

Check the landmark against a source before generating. Getting a town's
landmark wrong is obvious to anyone local and undoes the point of the page.

Always **Read the generated file** before wiring it in — check for text artifacts, stray brand marks, and palette drift.

## Optimization pipeline

Generated art lands in the scratchpad, then gets trimmed and re-canvassed into `src/assets/` with sharp:

```js
sharp(src).trim({threshold:8})
  .resize({width:1280, height:853, fit:'contain', background:'#F7F6F3'})
```

Sharp's pipeline order is fixed (trim → resize → extend), so `extend()` after `resize()` pads the *resized* image — use `fit:'contain'` when you want a specific final canvas.

Illustrations → PNG (flat colour compresses well). Photographs → JPEG q88.

### Normalising illustration backgrounds (required)

`IllustrationPanel` no longer has a `blend` mode — every illustration moved to the mockups and the branch was removed as unreachable — so nothing is multiplied onto a tint any more. Normalising still matters: a render sitting on the page's own ground needs a **uniformly pure white** background, because the generator emits its own off-white (typically `#F5F5F0`) which reads as a faint warm rectangle against a cool `canvas` or `powder` section.

So after trimming and padding onto white, collapse every near-white pixel to `#FFFFFF`:

```js
if (r >= 236 && g >= 236 && b >= 236) { r = g = b = 255; }
```

Grey fills sit near 210 and survive untouched. This also cuts file size sharply (one flat colour instead of a gradient of near-whites) — the six service illustrations dropped from ~80–120 KB each to 12–38 KB.

Ask the generator for art that "floats directly on a plain flat background with no card, no panel, no frame, no border and no shadow" — a baked-in card edge survives trimming and shows through the blend.

## Rendering

Always `<Image>` from `astro:assets` with `widths`, `sizes`, and descriptive alt text that states what the image shows. Hero images: `loading="eager"` + `fetchpriority="high"`. Everything else: `loading="lazy"`. Wrap in `<figure>` with a mono `<figcaption>` when the image needs context. Astro emits width/height automatically, so CLS stays at zero — never strip them.
