# CareInflow — Technical SEO, Performance & Discoverability Specification

> Engineering quality bar for the site: crawlability, semantics, schema, performance, accessibility, AI discoverability.
> Companion docs: [business-context.md](business-context.md) · [website-strategy.md](website-strategy.md)

This website should not simply look premium. It should be engineered as a technically excellent website that follows current best practices for search engines, AI-powered search experiences, accessibility, performance, semantic HTML, and long-term maintainability.

Every page should be built with technical quality as a primary requirement rather than an afterthought. The website should be optimized for both human visitors and modern search engine crawlers.

## Primary Technical Goals

Maximize: crawlability · indexability · semantic understanding · local search relevance · Core Web Vitals · accessibility · structured data quality · internal linking · content quality · AI discoverability.

Every implementation decision should support these objectives.

## SEO Philosophy

Do not create SEO pages. Create genuinely useful pages.

Every page should answer a real question that healthcare practice owners may search for. Content should be written primarily for humans while remaining technically optimized for search engines.

Avoid keyword stuffing. Avoid repeating the same phrases unnaturally. Use natural language throughout.

## Local SEO Strategy

Optimize the website primarily for **North Gujarat**. Primary service areas:

Mehsana · Ahmedabad · Gandhinagar · Visnagar · Unjha · Patan · Kalol · Siddhpur · Palanpur · North Gujarat region

Service pages should naturally reference relevant service areas where appropriate. Location relevance should come from valuable content, not repetitive location stuffing.

## Target Search Intent

Create content that answers searches such as:

healthcare website design · doctor website design · clinic website development · dental website designer · healthcare web development · medical website company · clinic SEO · healthcare SEO · Google Business Profile for clinics · medical website maintenance · healthcare website redesign · doctor website agency · healthcare digital marketing · healthcare website developer in Gujarat / Ahmedabad / Mehsana

Use these topics naturally where contextually relevant. Never force keywords into headings or paragraphs.

## Content Requirements

Every page should include: a clear H1 · logical H2 hierarchy · supporting H3 sections · natural keyword variations · helpful explanatory content · frequently asked questions · relevant internal links · clear CTAs.

Each page should be comprehensive enough to satisfy search intent. Avoid thin pages.

## Semantic HTML

Use semantic elements throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` where appropriate, `<footer>`. Use lists, tables, figures, blockquotes, and descriptive headings when they improve understanding. Avoid div-heavy layouts where semantic elements are more appropriate.

## Schema Markup

Implement structured data wherever applicable: Organization · LocalBusiness (if applicable) · ProfessionalService · WebSite · WebPage · BreadcrumbList · FAQPage · Service · Person (founder) · ImageObject · Article · BlogPosting · ContactPage · SearchAction.

Nest structured data correctly and avoid conflicting markup. Structured data should accurately reflect page content.

## Meta Data

Every page should include: unique title · unique meta description · canonical URL · Open Graph metadata · Twitter/X metadata · favicon metadata · language declaration · theme color · robots directives · descriptive image alt text.

Do not duplicate metadata across pages.

## Internal Linking

Create a logical internal linking structure:

Homepage → Service Pages → Industry Pages → Resources → Case Studies → Contact

Every important page should receive internal links. No orphan pages. Anchor text should be descriptive and natural.

## Performance Requirements

Performance is a core feature. Targets:

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| Accessibility | 100 |
| SEO | 100 |
| Best Practices | 100 |

Core Web Vitals should comfortably pass. Optimize LCP, INP, CLS.

Reduce render-blocking resources. Minimize JavaScript. Optimize CSS delivery. Compress assets. Serve responsive images in modern formats. Lazy-load below-the-fold media. Preload critical fonts and hero assets.

## Accessibility

Meet WCAG 2.2 AA standards where practical: semantic HTML · proper heading hierarchy · keyboard navigation · visible focus indicators · ARIA only when necessary · high contrast · readable typography · accessible forms · touch-friendly controls.

Accessibility should be treated as part of quality, not compliance.

## AI & Search Discoverability

Content should be easy for both traditional search engines and AI systems to understand: clear headings · well-structured paragraphs · question-and-answer sections · definitions · summaries · consistent terminology · descriptive page titles · meaningful internal links · structured data.

Avoid vague marketing language. Make important information explicit rather than implied.

## Technical Files

Configure and maintain: robots.txt · XML sitemap · canonical URLs · proper redirects · 404 page · security headers · Open Graph images · favicon set · manifest file (if PWA functionality is introduced) · llms.txt (must accurately reflect the site's public content; no invented directives).

## URL Structure

Keep URLs short, descriptive, and stable:

`/services/healthcare-websites` · `/services/local-seo` · `/services/google-business-profile` · `/about` · `/process` · `/pricing` · `/resources`

Avoid unnecessary nesting. Avoid dynamic parameters for core pages.

## Image Optimization

Every image should include: descriptive filename · alt text · responsive sizing · modern format (WebP/AVIF where supported) · lazy loading (except critical images) · width and height attributes. Avoid oversized assets.

## Copy Optimization

Write for people first: natural language · healthcare terminology · business terminology · local context · practical explanations · clear answers.

Avoid: keyword stuffing · hidden keywords · doorway pages · manipulative SEO techniques · repeated city names without context.

## Quality Standard

The finished website should be technically capable of being crawled, indexed, understood, and surfaced effectively by modern search engines. It should demonstrate excellence in information architecture, semantic markup, structured data, performance, accessibility, internal linking, content quality, and user experience.

The goal is a technically outstanding foundation for long-term organic growth. Rankings depend on many additional factors — backlinks, citations, GBP, reviews, competition, ongoing content — but the website itself should never be the limiting factor.

## Chosen Stack

Astro 5 · TypeScript · Tailwind CSS v4 · React islands (only where needed) · MDX · Content Collections · built-in image optimization. Static output; optimized for Cloudflare Pages; mirrored to GitHub Pages via Actions workflow (`jaidevjethi/careinflow-website`).
