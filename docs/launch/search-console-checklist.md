# Google Search Console — what to do, in order

The site is live on `https://www.careinflow.com`, served by Cloudflare Pages,
with the apex 301ing to www. Nothing below has been done for you: Search
Console needs an account action that only the owner can take.

Nothing here promises indexing, ranking or traffic. Google decides all three,
and competition, relevance and time decide them with it. What this list does is
make the site *eligible* and give you the instruments to see what happens.

## 0. The HTML verification file is already in place

`public/google86e87b3d4788a10e.html` ships with every build and is served at
`https://www.careinflow.com/google86e87b3d4788a10e.html`. It verifies a
**URL-prefix** property for `https://www.careinflow.com/`.

**Never delete it.** Removing it un-verifies the property and takes the Search
Console history with it. `npm run verify` fails the build if the file is missing
or if its token is altered, so it cannot be tidied away by accident.

Nothing else on the site needs to change for this to work: it is a static file
in `public/`, it is not a route, it is not in the sitemap, and nothing links to
it.

## 1. Also verify a Domain property

The file above covers one host. A Domain property covers `careinflow.com`,
`www.careinflow.com`, every other subdomain and both schemes in one place —
which matters here because the apex 301s to www, so links to the bare domain
are real traffic that a URL-prefix property would not report on.

Do both. They coexist, and the Domain property is the one to use day to day.

In Search Console, choose **Domain** and enter `careinflow.com`.

Verification is a **TXT record in DNS**. Cloudflare is your DNS provider, so:
Cloudflare dashboard → `careinflow.com` → DNS → Records → Add record → type
`TXT`, name `@`, content the `google-site-verification=…` string Search Console
gives you. Proxy status is not applicable to TXT records. Verification usually
completes within minutes.

Avoid the **meta-tag** method: it verifies one host only and puts a token into
the page template, where it is one careless edit away from disappearing. The
HTML-file method (§0) is fine and already done — a file in `public/` is inert
and guarded.

## 2. Submit the sitemap

Sitemaps → add `sitemap-index.xml`.

The full URL is `https://www.careinflow.com/sitemap-index.xml`. It points at
`sitemap-0.xml`, which lists all 37 indexable pages with `lastmod` set to the
build time. The 404 is excluded deliberately: it is `noindex` and
self-canonicalising, and listing it would be asking Google to index a page that
tells it not to.

`robots.txt` already advertises the same sitemap. Check it reads:

```
User-agent: *
Allow: /

Sitemap: https://www.careinflow.com/sitemap-index.xml
```

Cloudflare caches `robots.txt`; if you see an older version, add a cache-buster
query string to check the origin before assuming something is wrong.

## 3. Inspect the pages that matter

URL Inspection, one at a time. Confirm each says *URL is on Google* eventually,
and in the meantime that the fetched page shows the right canonical:

1. `https://www.careinflow.com/`
2. `/services/healthcare-websites/`
3. `/services/local-seo/`
4. `/services/google-business-profile/`
5. `/services/website-care/`
6. `/pricing/`
7. `/contact/`
8. `/work/pramukh-dental/`
9. `/areas/mehsana/`

Use **Request Indexing** on the homepage and the five service pages. It is a
queue, not a switch — it asks Google to look sooner, and does not decide the
outcome.

## 4. What you should expect to see, and what would be wrong

| Report | Expected | Investigate if |
|---|---|---|
| Page indexing | 37 submitted, climbing toward 37 indexed over weeks | anything reads *Excluded by 'noindex' tag* — every page here is `index, follow` except the 404 |
| Page indexing | zero *Alternate page with proper canonical tag* on www | any www URL is reported as an alternate — that would mean a canonical points elsewhere |
| Page indexing | `careinflow.com` (apex) appears as *Page with redirect* | it does not — the apex 301 exists and Google should record it as such |
| Sitemaps | Success, 37 discovered | fewer than 37, or a *Couldn't fetch* |
| Core Web Vitals | needs 28 days of field data before it reports anything | it stays empty past ~6 weeks with real traffic |
| Enhancements | FAQ, Breadcrumb and Article items detected | items appear with errors — the JSON-LD is generated, so an error means a builder in `src/lib/schema.ts` changed |
| Security & Manual actions | no issues | anything at all |

The GitHub Pages mirror at `jaidevjethi.github.io/careinflow-website/` sends
`noindex, follow` on every page and does not advertise a sitemap. It should
never appear in this property, and it is not a second property worth creating.

## 5. Rich results

Test these three against the **live** URLs at
`https://search.google.com/test/rich-results`:

- `/` — Organization + ProfessionalService, WebSite, Person, FAQPage
- `/pricing/` — OfferCatalog with all published prices, FAQPage, BreadcrumbList
- `/work/pramukh-dental/` — Article with an ImageObject, BreadcrumbList

Every `@id` in the graph is on `https://www.careinflow.com`, so the entities
resolve to one another rather than to twelve unrelated nodes. There is no
`Review` or `AggregateRating` anywhere on the site and there must not be: the
studio has no genuine reviews yet, and inventing them is both a policy
violation and the one thing that would undo everything else on this list.
`npm run verify` fails the build if either type ever appears.

## 6. After the Google Business Profile exists

See `google-business-profile-checklist.md`. Once the listing is live and
verified, two things come back here:

- Add the listing's Maps URL to `PROFILES` in `src/config/site.ts`. It is empty
  on purpose today, so `sameAs` is omitted rather than published blank.
- The Business Profile's website field must be exactly
  `https://www.careinflow.com/` — the canonical form, with the slash, on www.

## Ongoing

Check monthly, not daily. Indexing and Core Web Vitals both move slowly, and a
week of data is noise. The things worth acting on are: a page that drops out of
the index, a spike in crawl errors, a Core Web Vitals metric leaving the green
band, and any manual action.
