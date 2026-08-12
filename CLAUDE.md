# CareInflow Website

Healthcare-focused web design & digital growth studio site. This site is itself the portfolio: every page must demonstrate the quality it sells (semantic HTML, structured data, speed, accessibility).

**Full specs (read before substantive changes):**
- [docs/context/business-context.md](docs/context/business-context.md) — what CareInflow is, services, audience, positioning, voice
- [docs/context/website-strategy.md](docs/context/website-strategy.md) — page-by-page persuasion strategy, CTAs, founder framing
- [docs/context/technical-seo-spec.md](docs/context/technical-seo-spec.md) — SEO/performance/a11y quality bar
- [docs/design/careinflow-design-system.dc.html](docs/design/careinflow-design-system.dc.html) — original design source (2a "Instrument"). Its type, layout and motion still stand; its **colour section is historical**, as is the "Midnight & Citrus" palette that briefly replaced it. The live palette is "Clinical Blue & Indigo" in `src/styles/global.css`, documented in the `careinflow-design` skill.

## Stack

Astro 5 · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `src/styles/global.css` `@theme`) · MDX + Content Collections · static output.

- `npm run dev` / `npm run build` (→ `dist/`) / `npx astro check`
- `site`/`base` come from env: production/Cloudflare = `https://www.careinflow.com` at root; GitHub Pages build sets `SITE=https://jaidevjethi.github.io BASE_PATH=/careinflow-website`. Canonical URLs ALWAYS point to `https://www.careinflow.com` (see `src/config/site.ts` — single source for URLs, NAP, WhatsApp). **www is canonical**: Cloudflare serves the site there and 301s the apex, so a canonical on the bare domain names a URL that redirects.
- `trailingSlash: 'always'`, so **every internal link must end in a slash**. `href()` and the `rehypeInternalLinks` plugin add it; a link without one costs a 308 on every click. Files (`.svg`, `.xml`, `.txt`) keep their exact path.
- Deploys: GitHub Actions → GitHub Pages (mirror); Cloudflare Pages builds the same repo at root (production). `public/_headers` and `public/_redirects` are Cloudflare-only; GitHub Pages ignores both.
- **Cloudflare Pages strips `.html` extensions**, 308ing `/file.html` → `/file`. Anything fetched by exact URL — the Search Console token in `public/google86e87b3d4788a10e.html` — needs a `200` rewrite in `_redirects`. Never delete that file or its rule; `npm run verify` fails the build if the file goes.

## Design system 2a "Instrument" (hard rules)

Full rules in the `careinflow-design` skill. The short version:

- Palette "Clinical Blue & Indigo", and it is **one cool family**, measured: the light grounds sit within 3° of hue and every neutral is b* ≤ 0. Positive b* is the yellow axis, which is beige, and it is banned. Grounds: `surface #FFFFFF` → `canvas #F4F7FD` → `powder #E9EEF9` → `mist #DDE4F4` → midnight `panel #0B2440` / `panel-section #0E1B33`. **All three light grounds carry all six text tokens**, so no section is constrained by its ground. The two mid-tones were deleted — at L*77 they cleared AA for only three of six, which made every band section typographically poorer than the rest of the site. Depth is a dark band (`.band-panel`), never a medium one.
- Brand: `surgical #0F4C75` primary, `vivid #818CF8` periwinkle indigo (fills only, ink text on it, never white), `pass #0A6E62` for verified measurements ONLY, `ink #0E2439` — a deep navy at the grounds' own hue, never black. Five accents named for the service (`web`/`seo`/`gbp`/`care`/`social`), never for the hue, on a cool arc from cyan-blue to violet (hue 256→323, smallest pairwise deltaE 15.1). No accent sits in the sage band (hue 150–205) except `pass`, which stays green on purpose.
- **Two colours are solved by constraint, not chosen — do not "tidy" either.** `cta #2D6FE0` is the header CTA and the only white-text button: white needs a dark fill, the header ground is midnight `#0B2440` where dark fills vanish, and only L\* 0.151–0.183 satisfies both. It measures white 4.71:1 and 3.33:1 against the header. Lighter and the text fails AA; darker and the button disappears. It is a separate `.btn-cta`, never a recolour of `.btn-accent`, which carries ink text at 5.29:1 on light grounds in seven other places.
- **WhatsApp green is the only sanctioned green besides `pass`**, exempt from the one-cool-family rule because it is a channel mark belonging to someone else, not a brand accent. Two tokens, because one cannot do both jobs: `whatsapp #25D366` (hue 142, outside the sage band) for fills and for text on midnight — **ink on it at 7.96:1, never white**, since white on WhatsApp green is 1.98:1 and fails AA in WhatsApp's own app — and `whatsapp-deep #137236`, the same hue taken down to clear every light ground (6.02 surface, 4.72 mist) for links in running text. `#075E54`, the obvious dark WhatsApp teal, is hue 173 and sits *inside* the banned sage band. Instagram gets no brand colour at all: its pink is 3.61 and purple 3.07 on midnight, both under AA, so the footer link uses `a-social`.
- **Midnight is reserved for the header, hero, CTA panel, footer and at most two sections per page. Never a dark theme.** Two, not one, because the rhythm is light-light-dark-light: a dark beat mid-page is where the depth comes from now that the mid-tones are gone. A dark card inside a light section counts: it takes the eye first, so spend that weight on what you want clicked.
- **Every page opens with the midnight `PageHero`** — header + hero form one continuous dark block, the body between, midnight CTA + footer at the bottom. No hero exceeds ~72% of the viewport. Hero `stats` carry facts a buyer can weigh (`4 weeks`, `Free`, `Fixed`), never build measurements (`<1.2s`, `95+`, `AA`).
- Type: Manrope variable only (display 800, tracking −0.045em; body 18px/1.62); JetBrains Mono for labels/chips. Large tight numbers in their accent colour are the only ornament.
- Layout: 1440 max, 80px margins, 112/72px section rhythm, radius 12/16/24, exactly one shadow recipe. Nothing crosses the viewport at 320px or 1440px. Grids divide evenly.
- Motion: single easing `cubic-bezier(.22,1,.36,1)`; 240ms entrance fade+8px rise (once), 200ms hover lift; **only `opacity`/`transform` animate, pure CSS, `prefers-reduced-motion` disables all.** No animation libraries. No gradients, no glass, no glow.
- Section labels are plain language above a tick-rule: "What we do", "Where patients look", "Questions". The record vocabulary (CHART, TRIAGE, PROTOCOL) and the `REF <1.2S` ranges were retired for reading cold. Never "solutions"/"why choose us".

## Voice & integrity (non-negotiable)

- Simple English for busy doctors. Short paragraphs. Clarity over cleverness. No buzzwords, no urgency CTAs ("Buy now", "Limited time"), no discount messaging — premium positioning.
- **Claim-forward, and the line is opinion vs fact** (owner's decision, 2026-08-06). Superlatives about ourselves are allowed and wanted: "Gujarat's best healthcare websites", "Gujarat's healthcare-only web studio". They are opinion, not falsifiable, and they belong in the crawler-facing fields — H1, `<title>`, meta description — *placed, not sprayed*. Repeating an adjective in every heading reads as desperate to a doctor and ranks no better; Google scores coverage and entity clarity.
  **What stays banned is fabricated fact**, because these are checkable and false: invented ratings, review counts, client counts, "trusted by N clinics", awards. Nothing self-serving in JSON-LD — a fake `aggregateRating` is a documented Google structured-data violation and risks a manual action, which would cost the rankings this is meant to win. And no promise about *outcomes* ("we will get you to #1") — that is a claim about results, not a description of us. Saying "we do not guarantee rankings, and nobody honestly can" is still correct and still on the site.
- **No scarcity — no founding-practice counts, no countdowns, no deadlines on a quote.** Sample interface artifacts keep their `ILLUSTRATIVE` label. Real portfolio: Pramukh Multispeciality Dental Clinic (Mehsana, healthcare flagship), Divyam Tours (labeled non-healthcare).
- **Prices come from `src/config/pricing.ts` and nowhere else** — never invent a figure inline, in copy, in a FAQ answer or in schema. Published numbers are *starting points* for a described scope; the real figure is fixed in writing after the free review. No discounts, no offers, no countdowns: where a combined plan costs less than its parts, the page states the overlap that makes it true.
- No ranking guarantees, no bought reviews, no templates resold as bespoke.
- One studio, in Mehsana — no branches or other offices. Service areas are places served, not places staffed. **All nine `serviceAreas` have a page**; the footer derives its town links from that list, so adding a town to the config is the only step.
- **One enquiry page: `/contact`.** It carries the free written review in full. `/free-review` was a second route competing for the same conversion and now redirects — the redirect target is built from `BASE_PATH`, because Astro applies `base` to links it renders but *not* to redirect targets.

## Repo skills (load the matching one before working)

| Skill | Use for |
|---|---|
| `careinflow-voice` | any copy — tone, banned words, CTA wording |
| `careinflow-design` | tokens, type, layout, motion, components |
| `careinflow-funnel` | CTA placement, WhatsApp prefills, new pages |
| `careinflow-images` | generating, capturing and optimizing imagery |
| `careinflow-review` | judging any change: who to judge as, how to rate honestly, and the loop to run before calling it done |
| `gbp-optimize` | auditing or fixing a Google Business Profile, ours or a client's — order of work, console mechanics, what does nothing |

## SEO conventions

Unique title/description/canonical per page via the `SEO` component. **Titles ≤ 62 characters, descriptions ≤ 158** — both are checked in the verification sweep. JSON-LD via `JsonLd` components — must accurately reflect page content. Every page: one H1, logical H2/H3, FAQ section feeding FAQPage schema, descriptive internal links (no orphans). Service areas: Mehsana, Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan, Kalol, Siddhpur, Palanpur — mentioned naturally, never stuffed.

**Specialty and area pages** (`src/content/specialties/`, `src/content/areas/`) must each say something the others do not. A page that reads like its neighbour with a word swapped is worse than no page. Area pages describe places *served*, never places staffed — schema uses `Service` + `areaServed: City`, never a second `LocalBusiness` address.
