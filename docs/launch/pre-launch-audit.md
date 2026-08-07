# Pre-launch audit — August 2026

Full review of the live site before it is handed to Google Search Console and a
Business Profile. Production was already serving on Cloudflare Pages when this
started, so this is a correction pass rather than a launch preparation.

**Status: technically ready for launch and post-launch monitoring.**

Nothing here promises indexing, ranking, traffic or inclusion in AI Overviews.
Google decides those, and competition, relevance, authority and time decide them
with it. What is claimed below is only what was inspected, changed, tested and
measured.

---

## Score: 94 / 100

| Weight | Area | Score | Why |
|---|---|---|---|
| 20 | Crawlability & indexability | 20 | One canonical host, every internal link resolving without a redirect, a real 301 on the one legacy URL, 37 pages in a valid sitemap, one indexable copy of the site |
| 15 | Metadata & structured data | 15 | Unique title and description per page inside budget, one H1 each, 37 JSON-LD graphs whose `@id`s resolve to one another, no review or rating types anywhere |
| 15 | Accessibility | 15 | Lighthouse 100 on five templates; 228 page-widths measured with zero contrast, target-size, overflow or heading-order failures |
| 15 | Performance | 14 | 96–99 mobile, CLS 0, TBT 0 ms, LCP 0.9 s on a typical 4G profile. One point held back: 46 KiB of render-blocking CSS, kept deliberately |
| 15 | Content integrity | 14 | Eleven claim and consistency defects found and fixed; one third-party claim still unverified (§ Owner input) |
| 10 | Conversion & funnel | 10 | One enquiry route, one prefill source, an honest escape hatch on every ask, published prices from one config |
| 10 | Build & release safety | 10 | Type check, price guard and a new metadata/link/schema guard all run in CI; no secrets in the repo |

Six points are deducted for things that are correct but not perfect: the
render-blocking stylesheet, and an unverified quote about a client's clinician.

---

## What was changed, in nine commits

| Commit | What |
|---|---|
| `3e1b1ed` | Canonical host to `www`, trailing slash on every internal link, real 301 for `/free-review` |
| `12062ba` | GitHub Pages mirror made `noindex, follow` |
| `c90ed92` | `scripts/check-meta.mjs` — metadata, link and JSON-LD guard, wired into CI |
| `c89df5c` | `a-gbp` accent to AA; mobile menu given state, Escape and focus return; caption link to 24px |
| `a192702` | `sameAs` emptied; `og:image` dimensions; articles use their own cover art |
| `9ae2ebd` | Carousel dot targets stopped overlapping; a 700px step added to two image sets |
| `303bf87` | `'unsafe-inline'` removed from `script-src`; both scripts externalised |
| `9847768` | Copy review of all 37 pages written up |
| `797ecb0` | Eleven approved copy corrections applied |

31 files changed, 837 insertions, 104 deletions.

---

## Findings, classified

### FIXED

| # | Finding | Where |
|---|---|---|
| 1 | Every canonical, `og:url`, sitemap `<loc>`, `robots.txt` sitemap line, all 13 URLs in `llms.txt` and every JSON-LD `@id` named the apex, which 301s to `www` — telling Google the preferred URL was one it gets redirected away from | `src/config/site.ts`, `astro.config.mjs` |
| 2 | All 2,471 internal references omitted the trailing slash under `trailingSlash: 'always'`, so every click and every crawl hop took a 308 | `src/lib/url.ts`, `astro.config.mjs` |
| 3 | `/free-review` was a `<meta refresh>` returning 200, not a redirect | `public/_redirects` |
| 4 | The mirror published a second crawlable copy of all 37 pages | `src/components/SEO.astro`, `src/pages/robots.txt.ts` |
| 5 | One resource title ran to 64 characters against the 62 budget | `how-patients-choose-a-clinic-online.mdx` |
| 6 | `a-gbp` gave 4.43 on its own tint and 4.35 on `mist`, against AA's 4.5 | `src/styles/global.css` |
| 7 | Mobile menu had `aria-expanded` and nothing else: no visible state, no Escape, no focus return, and stayed open when you followed a link to the page you were on | `src/components/Header.astro` |
| 8 | Hero carousel dots were 24px targets overlapping each other by 4px | `src/styles/global.css`, `src/pages/index.astro` |
| 9 | Hero caption link was an 18px-tall target | `src/pages/index.astro` |
| 10 | `sameAs` asserted the studio's identity at a `wa.me` click-to-chat URL | `src/config/site.ts`, `src/lib/schema.ts` |
| 11 | No `og:image` dimensions; the five guides shared the generic card despite having cover art | `src/components/SEO.astro`, `resources/[slug].astro` |
| 12 | Image sets stepped 560→840 and 640→840, so every phone took the desktop file | `src/pages/index.astro` |
| 13 | `script-src 'unsafe-inline'` — the allowance that makes a CSP close to worthless | `public/_headers`, `PriceEstimator.astro` |
| 14 | `/about` ended its service list "that is the whole list" while omitting a service with its own page and price | `src/pages/about.astro` |
| 15 | `/services` showed three different service counts on one page | `src/pages/services/index.astro` |
| 16 | `/work` invited readers to open every project and time it; one had no URL anywhere | `divyam-tours.mdx` |
| 17 | `/areas/visnagar` used "thousands"/"several thousand" four times as fact | `visnagar.mdx` |
| 18 | "How established is CareInflow?" answered a different question | `src/content/faqs.json` |
| 19 | Speed claims carried no measurement conditions | `pramukh-dental.mdx`, `index.astro` |
| 20 | `/contact` built its own WhatsApp prefill instead of using `site.ts` | `src/pages/contact.astro` |
| 21 | One card called the patient's phone "cheap" against 18 places saying "mid-range Android" | `healthcare-websites.mdx` |
| 22 | The `careinflow-design` skill documented five accent colours that are not the ones in the code, and two ground tokens that no longer exist — and CLAUDE.md tells every contributor to read it first | `.claude/skills/careinflow-design/SKILL.md` |

### PASS — inspected, nothing to change

- **Fabrication.** No testimonials, reviews, ratings, client counts, awards,
  certifications or partnerships anywhere. `src/content/testimonials/` ships
  empty on purpose and no section renders without entries.
- **Banned vocabulary.** A scan of every built page for urgency, discount
  language, buzzwords, superlatives, ranking guarantees and certification claims
  returned six hits, all false positives inside negations.
- **Prices.** Every published figure traces to `src/config/pricing.ts`,
  enforced by a guard that fails the build on a literal.
- **Sample and non-healthcare work** labelled on the index, the card and the
  page in both cases.
- **Motion.** Pure CSS, `opacity`/`transform` only, behind
  `@supports (animation-timeline: view())` and `prefers-reduced-motion`. No
  content depends on it. Nothing added.
- **Images.** All 412 variants through `astro:assets` with real `width`/
  `height`; zero missing dimensions across 38 pages, which is why CLS is 0.
- **Semantics.** One H1 per page, no skipped heading levels, labelled
  landmarks, a working skip link, no positive `tabindex`, visible two-tone
  focus ring designed for both light and midnight grounds.
- **Secrets.** `.env` is gitignored and holds only a PageSpeed and a Gemini
  key; nothing sensitive is in the repo or the build.
- **Headers.** HSTS with preload, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, COOP, and now `object-src 'none'`.
  Verified arriving on live responses.

### NEEDS OWNER INPUT

| # | Item |
|---|---|
| 1 | ~~Cloudflare Web Analytics blocked by the site's own CSP~~ — **resolved, see below** |
| 2 | `/work/pramukh-dental` states Dr. Chinmay Patel has *"more than ten years and five thousand procedures behind him"*. A claim about a third party's professional record. Confirm the clinic has said it and would repeat it, or it should go. |
| 3 | `PAGESPEED_API_KEY` in `.env` is expired ("API key expired. Please renew"), and the anonymous PSI quota for that project is exhausted. Nothing in the build uses it; renew it if you want scripted monitoring. |
| 4 | The sample build at `jaidevjethi.github.io/lavanya-skin-clinic` measures **CLS 0.057** — inside Google's good band but not the 0 this site and Pramukh both hit. `/work` invites people to open and measure it. Fix in that repo. |

### RESOLVED — the Cloudflare analytics beacon

Cloudflare was injecting `static.cloudflareinsights.com/beacon.min.js` at the
edge. It was never in the build — `dist/index.html` contains no reference to
it — and `script-src 'self'` refused it, so every page load logged two CSP
violations and no analytics data was ever collected. This predated the audit:
the previous policy was `script-src 'self' 'unsafe-inline'`, which does not
admit a cross-origin script either.

Web Analytics was disabled rather than allowed through the CSP, because
`/privacy` tells visitors the site "embeds no third-party trackers" and
allowing it would have made that false.

Two things were worth learning from how it went:

- **The zone-level and Pages-project switches are separate.** Turning off the
  account-level Web Analytics entry did nothing; the beacon kept appearing with
  the same token. What proved it was the Pages project rather than the zone was
  that `careinflow-website.pages.dev` — which is not part of the
  `careinflow.com` zone and so cannot be affected by zone settings — carried the
  beacon too.
- **The Pages setting binds at deploy time, not serve time.** Disabling it left
  the running deployment unchanged. An empty commit (`9645f19`) to force a fresh
  build was what actually cleared it, and during the rollout both hosts flipped
  between clean and beaconed for about a minute while the two deployments
  overlapped.

Verified after: 8 pages × 3 rounds with cache-busting query strings, zero beacon
references; zero external script hosts of any kind; and Lighthouse against live
production moving **best practices 93 → 100** and performance 97 → 98, with
accessibility and SEO already at 100 and the `errors-in-console` audit now
passing with no errors at all.

### MONITOR AFTER LAUNCH

- Index coverage settling toward 37 pages.
- The apex→www redirect appearing as *Page with redirect*, not as duplicate
  content.
- Core Web Vitals, once 28 days of field data exist. Lab numbers are not field
  numbers.
- The four unslashed URL forms that were live before `3e1b1ed`: Google will have
  seen `/about` etc. and should consolidate onto the slashed forms.

### NOT APPLICABLE

- Form handling, validation and error states — there are no forms. WhatsApp and
  the phone are the only two routes, by design.
- Cookie or consent banners — no cookies, no analytics, no third-party scripts.
- Login or gated content.

---

## Measurements

All Lighthouse, mobile, against the built site.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 2.3 s | 0 | 0 ms |
| `/pricing/` | 96 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms |
| `/contact/` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| `/work/pramukh-dental/` | 99 | 100 | 100 | 100 | 2.1 s | 0 | 0 ms |
| `/services/healthcare-websites/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 0 ms |

Those are the built site served locally. **Against live production** on the same
default preset, after the analytics beacon was removed:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `https://www.careinflow.com/` | **98** | **100** | **100** | **100** |

LCP 2.2 s, CLS 0, TBT 0 ms, and no console errors of any kind.

Lighthouse's default mobile preset simulates roughly 1.6 Mbps at 150 ms RTT
with a 4× CPU penalty — deliberately pessimistic. On a profile closer to
typical Indian 4G (9 Mbps, 70 ms, 2× CPU):

| Site | Performance | FCP | LCP | CLS |
|---|---|---|---|---|
| `www.careinflow.com` | 100 | 0.8 s | **0.9 s** | 0 |
| `pramukhdentalclinic.com` | 100 | 0.8 s | **1.0 s** | 0 |
| the sample build | 99 | 1.1 s | 1.1 s | 0.057 |

Both numbers are true. That is why the site's speed claims now name the
connection they were measured on rather than saying "on mobile data".

Accessibility, measured directly rather than through Lighthouse: **38 pages ×
6 viewport widths** (320, 375, 414, 768, 1280, 1440), every text element
against its own computed background, every interactive element's real
activation area, every element against the viewport edge. **Zero failures.**

---

## What is now guarded

`npm run verify` runs after every build, locally and in CI, and fails on:

- a title over 62 characters or a description over 158
- a duplicate title or description
- a page without exactly one `<h1>`, or without `<html lang>`
- a canonical that is missing or off the canonical host
- a robots directive that does not match the build target
- an `og:image` or `og:url` that is not absolute
- an internal link that does not resolve, or that omits its trailing slash
- JSON-LD that does not parse, or an `@id` on the wrong host
- **any `Review` or `AggregateRating` node, anywhere**

Each of those nine was verified by injecting the defect into built pages one at
a time and confirming the guard fails — not by trusting a script that has only
ever printed a tick.

---

## Remaining steps before you are done

1. ~~Disable Web Analytics in the Cloudflare dashboard~~ — done, verified.
2. Verify the **Domain** property `careinflow.com` in Search Console via a
   Cloudflare TXT record. See `search-console-checklist.md`.
3. Submit `https://www.careinflow.com/sitemap-index.xml`.
4. Inspect and request indexing for the homepage and the five service pages.
5. Run the Rich Results Test on `/`, `/pricing/` and `/work/pramukh-dental/`.
6. Answer owner input 2 (the Pramukh clinician claim).
7. Create the Google Business Profile when ready, following
   `google-business-profile-checklist.md`, then add its Maps URL to `PROFILES`
   in `src/config/site.ts`.
8. Optionally fix the sample build's 0.057 CLS, and renew the PageSpeed key.

No DNS, Cloudflare or Business Profile settings were touched during this audit.

---

## A note on how the live site was checked

The accessibility sweep — 38 pages × 6 widths, every text element measured
against its own computed background — was run against the built site served
locally, not against production. That is not a shortcut: `frame-ancestors
'none'` means the live site refuses to be framed by anything including itself,
which is correct and is why the technique cannot run there. The markup and CSS
measured are byte-for-byte what Cloudflare serves, confirmed by crawling all 47
internal link targets on live (zero non-200, zero redirects) and by spot-checking
`/areas/` on production directly, where the repaired `a-gbp` reads
`rgb(14, 106, 151)` and the contrast failures are gone.

Screenshots were not captured. The browser pane in this session was not
displayed, so it composited no frames and every screenshot request timed out.
Everything above was measured through the DOM and computed styles rather than
by eye, and it is stated that way rather than dressed up as a visual review.
