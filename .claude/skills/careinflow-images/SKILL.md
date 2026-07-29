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

> Minimal flat vector editorial illustration on a warm off-white paper background #F7F6F3. Restrained palette: deep ink #101613 line work, warm off-white surfaces, one surgical green #0B5D4E accent, soft neutral grey fills. Clean geometric shapes, thin confident strokes, generous whitespace. Absolutely no readable words, no letters, no numbers, no logos, no brand names — text is suggested only as abstract soft grey placeholder bars. No gradients, no drop shadows, no 3D.

For photography (about page, studio warmth) use: natural window light, muted warm neutrals, no people, no readable text, 50mm, shallow depth of field.

Always **Read the generated file** before wiring it in — check for text artifacts, stray brand marks, and palette drift.

## Optimization pipeline

Generated art lands in the scratchpad, then gets trimmed and re-canvassed into `src/assets/` with sharp:

```js
sharp(src).trim({threshold:8})
  .resize({width:1280, height:853, fit:'contain', background:'#F7F6F3'})
```

Sharp's pipeline order is fixed (trim → resize → extend), so `extend()` after `resize()` pads the *resized* image — use `fit:'contain'` when you want a specific final canvas.

Illustrations → PNG (flat colour compresses well). Photographs → JPEG q88.

## Rendering

Always `<Image>` from `astro:assets` with `widths`, `sizes`, and descriptive alt text that states what the image shows. Hero images: `loading="eager"` + `fetchpriority="high"`. Everything else: `loading="lazy"`. Wrap in `<figure>` with a mono `<figcaption>` when the image needs context. Astro emits width/height automatically, so CLS stays at zero — never strip them.
