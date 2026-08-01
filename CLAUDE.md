# CareInflow Website

Healthcare-focused web design & digital growth studio site. This site is itself the portfolio: every page must demonstrate the quality it sells (semantic HTML, structured data, speed, accessibility).

**Full specs (read before substantive changes):**
- [docs/context/business-context.md](docs/context/business-context.md) — what CareInflow is, services, audience, positioning, voice
- [docs/context/website-strategy.md](docs/context/website-strategy.md) — page-by-page persuasion strategy, CTAs, founder framing
- [docs/context/technical-seo-spec.md](docs/context/technical-seo-spec.md) — SEO/performance/a11y quality bar
- [docs/design/careinflow-design-system.dc.html](docs/design/careinflow-design-system.dc.html) — original design source (2a "Instrument"). Its type, layout and motion still stand; its **colour section is superseded** by the "Midnight & Citrus" palette in `src/styles/global.css`.

## Stack

Astro 5 · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `src/styles/global.css` `@theme`) · MDX + Content Collections · static output.

- `npm run dev` / `npm run build` (→ `dist/`) / `npx astro check`
- `site`/`base` come from env: production/Cloudflare = `https://careinflow.com` at root; GitHub Pages build sets `SITE=https://jaidevjethi.github.io BASE_PATH=/careinflow-website`. Canonical URLs ALWAYS point to `https://careinflow.com` (see `src/config/site.ts` — single source for URLs, NAP, WhatsApp).
- Deploys: GitHub Actions → GitHub Pages (mirror); Cloudflare Pages builds the same repo at root (production).

## Design system 2a "Instrument" (hard rules)

Full rules in the `careinflow-design` skill. The short version:

- Palette "Clinical Blue & Teal". **The ground ladder is six values, not two** — `surface #FDFCFA` → `canvas #F4EFE5` → `stone #EBE4D6` → `mist #DCE7E8` → mid-tones `sage #9DBDB5` / `slate #A3B8C9` → midnight `#0E3348`. Every page changes ground as you scroll; at most one mid-tone band per page. On sage and slate **only `ink` and `surgical` clear AA** — never `body`, `muted` or `faint`.
- Brand: `surgical #14425F` primary, `vivid #12B3A6` (fills only, ink text on it, never white), `pass #0A6B63` for verified measurements ONLY, `ink #17242A`, `sand #B8894A` as the single warm mark on small elements only. Five accents named for the service (`web`/`seo`/`gbp`/`care`/`social`), never for the hue.
- **Midnight is reserved for the header, hero, CTA panel, footer and at most one section per page. Never a dark theme.** A dark card inside a light section counts: it takes the eye first, so spend that weight on what you want clicked.
- **Every page opens with the midnight `PageHero`** — header + hero form one continuous dark block, the body between, midnight CTA + footer at the bottom. No hero exceeds ~72% of the viewport. Hero `stats` carry facts a buyer can weigh (`4 weeks`, `Free`, `Fixed`), never build measurements (`<1.2s`, `95+`, `AA`).
- Type: Manrope variable only (display 800, tracking −0.045em; body 18px/1.62); JetBrains Mono for labels/chips. Large tight numbers in their accent colour are the only ornament.
- Layout: 1440 max, 80px margins, 112/72px section rhythm, radius 12/16/24, exactly one shadow recipe. Nothing crosses the viewport at 320px or 1440px. Grids divide evenly.
- Motion: single easing `cubic-bezier(.22,1,.36,1)`; 240ms entrance fade+8px rise (once), 200ms hover lift; **only `opacity`/`transform` animate, pure CSS, `prefers-reduced-motion` disables all.** No animation libraries. No gradients, no glass, no glow.
- Section labels are plain language above a tick-rule: "What we do", "Where patients look", "Questions". The record vocabulary (CHART, TRIAGE, PROTOCOL) and the `REF <1.2S` ranges were retired for reading cold. Never "solutions"/"why choose us".

## Voice & integrity (non-negotiable)

- Simple English for busy doctors. Short paragraphs. Clarity over cleverness. No buzzwords, no urgency CTAs ("Buy now", "Limited time"), no discount messaging — premium positioning.
- Honest register: CareInflow is a new studio, and says so plainly. **No scarcity — no founding-practice counts, no countdowns, no deadlines on a quote.** **Never fabricate testimonials, reviews, ratings or client counts.** Sample interface artifacts keep their `ILLUSTRATIVE` label. Real portfolio: Pramukh Multispeciality Dental Clinic (Mehsana, healthcare flagship), Divyam Tours (labeled non-healthcare).
- **Prices come from `src/config/pricing.ts` and nowhere else** — never invent a figure inline, in copy, in a FAQ answer or in schema. Published numbers are *starting points* for a described scope; the real figure is fixed in writing after the free review. No discounts, no offers, no countdowns: where a combined plan costs less than its parts, the page states the overlap that makes it true.
- No ranking guarantees, no bought reviews, no templates resold as bespoke.
- One studio, in Mehsana — no branches or other offices. Service areas are places served, not places staffed.

## Repo skills (load the matching one before working)

| Skill | Use for |
|---|---|
| `careinflow-voice` | any copy — tone, banned words, CTA wording |
| `careinflow-design` | tokens, type, layout, motion, components |
| `careinflow-funnel` | CTA placement, WhatsApp prefills, new pages |
| `careinflow-images` | generating, capturing and optimizing imagery |
| `careinflow-review` | judging any change: who to judge as, how to rate honestly, and the loop to run before calling it done |

## SEO conventions

Unique title/description/canonical per page via the `SEO` component. **Titles ≤ 62 characters, descriptions ≤ 158** — both are checked in the verification sweep. JSON-LD via `JsonLd` components — must accurately reflect page content. Every page: one H1, logical H2/H3, FAQ section feeding FAQPage schema, descriptive internal links (no orphans). Service areas: Mehsana, Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan, Kalol, Siddhpur, Palanpur — mentioned naturally, never stuffed.

**Specialty and area pages** (`src/content/specialties/`, `src/content/areas/`) must each say something the others do not. A page that reads like its neighbour with a word swapped is worse than no page. Area pages describe places *served*, never places staffed — schema uses `Service` + `areaServed: City`, never a second `LocalBusiness` address.
