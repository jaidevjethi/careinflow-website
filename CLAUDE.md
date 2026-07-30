# CareInflow Website

Healthcare-focused web design & digital growth studio site. This site is itself the portfolio: every page must demonstrate the quality it sells (semantic HTML, structured data, speed, accessibility).

**Full specs (read before substantive changes):**
- [docs/context/business-context.md](docs/context/business-context.md) — what CareInflow is, services, audience, positioning, voice
- [docs/context/website-strategy.md](docs/context/website-strategy.md) — page-by-page persuasion strategy, CTAs, founder framing
- [docs/context/technical-seo-spec.md](docs/context/technical-seo-spec.md) — SEO/performance/a11y quality bar
- [docs/design/careinflow-design-system.dc.html](docs/design/careinflow-design-system.dc.html) — original design source (2a "Instrument"). Its type, layout and motion still stand; its **colour section is superseded** by the "Clinical Cyan" palette in `src/styles/global.css`.

## Stack

Astro 5 · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `src/styles/global.css` `@theme`) · MDX + Content Collections · static output.

- `npm run dev` / `npm run build` (→ `dist/`) / `npx astro check`
- `site`/`base` come from env: production/Cloudflare = `https://careinflow.com` at root; GitHub Pages build sets `SITE=https://jaidevjethi.github.io BASE_PATH=/careinflow-website`. Canonical URLs ALWAYS point to `https://careinflow.com` (see `src/config/site.ts` — single source for URLs, NAP, WhatsApp).
- Deploys: GitHub Actions → GitHub Pages (mirror); Cloudflare Pages builds the same repo at root (production).

## Design system 2a "Instrument" (hard rules)

- Palette: canvas `#F7F6F3`, surface `#FFF`, line `#E4E1DA`, surgical green `#0B5D4E`, pass green `#0B7D57` (verified measurements ONLY), ink `#101613`; dark panel family `#0E1714`/`#142020`. **Max one dark ink panel per page. Never a dark theme.**
- Type: Manrope variable only (display 800, tracking −0.045em; body 18px/1.62); JetBrains Mono for labels/measurements/chips. Large tight numbers are the only ornament.
- Layout: 1440 max, 80px margins, 140–160px section rhythm, radius 12/16/24, exactly one shadow recipe.
- Motion: single easing `cubic-bezier(.22,1,.36,1)`; 240ms entrance fade+8px rise (once), 200ms hover lift; **only `opacity`/`transform` animate, pure CSS, no scroll-driven effects, `prefers-reduced-motion` disables all.** No animation libraries.
- Medical layer: tick-rule + mono label above sections; record vocabulary (CHART, TRIAGE, PROTOCOL, INDICATION, STATUS) — never "solutions"/"why choose us"; every measurement carries its reference range (`REF <1.2S`).

## Voice & integrity (non-negotiable)

- Simple English for busy doctors. Short paragraphs. Clarity over cleverness. No buzzwords, no urgency CTAs ("Buy now", "Limited time"), no discount messaging — premium positioning.
- Honest register: CareInflow is a new studio choosing five founding practices. **Never fabricate testimonials, reviews, ratings or client counts.** Sample interface artifacts keep their `ILLUSTRATIVE` label. Real portfolio: Pramukh Multispeciality Dental Clinic (Mehsana, healthcare flagship), Divyam Tours (labeled non-healthcare).
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

## SEO conventions

Unique title/description/canonical per page via the `SEO` component. JSON-LD via `JsonLd` components — must accurately reflect page content. Every page: one H1, logical H2/H3, FAQ section feeding FAQPage schema, descriptive internal links (no orphans). Service areas: Mehsana, Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan, Kalol, Siddhpur, Palanpur — mentioned naturally, never stuffed.
