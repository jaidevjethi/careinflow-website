# Print assets

## `review-request-a4.html` — the review request, A4, bilingual

Handed or sent to a practice once their project goes live. Open it and use
**Print or save as PDF**; the screen chrome hides itself when printing and the
sheet lays out at exactly 210 × 297 mm.

It is a single self-contained file. Manrope, JetBrains Mono and Noto Sans
Gujarati are inlined as base64, the logo is the real traced mark from
`public/logo-light.svg`, and the QR is vector, so it renders identically on a
machine that has none of those installed and prints crisply at any size.

### What it does and does not say

The wording is deliberate and should stay that way if it is edited:

- **It asks for an honest review, not a good one.** It says plainly that an
  honest three stars is worth more than a five we talked someone into.
- **It suggests no wording.** Asking a client to mention a service or a town is
  against Google's policies and it is the one thing that would undo the value
  of a real review.
- **It does not gate.** Everyone who finishes a project gets the same sheet,
  whether the project went well or badly. Filtering for happy clients is
  against Google's review policies.
- **No incentive is offered**, and none should be added.

### Rebuilding it

The committed file is already assembled. To rebuild after editing the copy,
restore the placeholders (`__MANROPE__`, `__JBMONO__`, `__GUJ400__`,
`__GUJ700__`, `__LOGO__`, `__QR_SVG__`) and re-inline:

```bash
npm install --no-save @fontsource/noto-sans-gujarati
```

`--no-save` matters: the Gujarati face is only needed for this sheet and has no
business in the website's dependency tree. Manrope and JetBrains Mono are
already project dependencies.

### The QR code

`qr-review.svg` points at `https://g.page/r/CUvqnETOlFFDEBM/review`.

It was rebuilt from the 132 × 132 PNG exported from the Google Business
Profile, by recovering the 53 × 53 module grid (version 11) and re-emitting it
as vector. Two reasons: the PNG was about 84 dpi at print size, which is soft
enough to be unreliable, and **it carried no quiet zone**. The spec requires
four clear modules on every side and some readers will refuse a code without
them. The SVG adds it.

**Scan a real printout before sending a batch.** The grid was recovered rather
than decoded, so the sensible check is a physical one, and it takes ten seconds.
