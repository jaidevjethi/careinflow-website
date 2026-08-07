# CareInflow — Website

Healthcare-focused web design & digital growth studio in Mehsana, Gujarat.
Websites, local SEO, and Google Business Profile management for doctors and
clinics — and this site is the studio's own best evidence.

**Production:** https://www.careinflow.com (Cloudflare Pages; the apex 301s to www)
**Mirror:** https://jaidevjethi.github.io/careinflow-website/ (GitHub Pages, canonicals point to production)

## Stack

Astro 5 · TypeScript (strict) · Tailwind CSS v4 · MDX content collections ·
static output · zero client-side frameworks (one tiny nav-toggle script).

Design system: direction **2a "Instrument"** — see
[docs/design/careinflow-design-system.dc.html](docs/design/careinflow-design-system.dc.html).
Business/brand/technical specs: [docs/context/](docs/context/).

## Commands

```bash
npm install        # install
npm run dev        # local dev — http://localhost:4321
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run check      # astro check (types + content)
```

## Deployment

- **GitHub Pages** — [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
  builds with `SITE=https://jaidevjethi.github.io BASE_PATH=/careinflow-website`
  and deploys on every push to `master`.
- **Cloudflare Pages** — connect this repo; build command `npm run build`,
  output directory `dist`, no env vars needed (defaults are production).
  Custom domains: `careinflow.com` and `www.careinflow.com`, with the apex
  301ing to www. Redirects live in [public/_redirects](public/_redirects),
  headers in [public/_headers](public/_headers); GitHub Pages ignores both.

Canonical URLs, sitemap and structured data always reference
`https://www.careinflow.com` regardless of deploy target — configured in
[src/config/site.ts](src/config/site.ts).

## Regenerating brand assets

Favicons and the Open Graph image are generated from `public/favicon.svg`:

```bash
node scripts/generate-assets.mjs
```
