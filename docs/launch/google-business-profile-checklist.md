# Google Business Profile — prerequisites

**No profile was created, claimed, verified or modified during this audit.**
This is what the website has already been made consistent with, and what the
listing has to match on the day it is created. A studio that sells Google
Business Profile management is judged on its own listing before anything else.

## The facts, and where they live

Everything below comes from `src/config/site.ts`. If any of it is wrong, change
it there — the footer, the contact page, the JSON-LD and this list all read
from that one file, so they cannot drift apart.

| Field | Value |
|---|---|
| Name | CareInflow |
| Street | F-27, Platinum Plaza, Radhanpur Rd |
| Locality | Mehsana, Gujarat 384005, India |
| Phone | +91 97734 56668 |
| Website | `https://www.careinflow.com/` |
| Hours | Monday–Saturday, 10:00–19:00. Closed Sunday |
| Coordinates | 23.5985, 72.3693 |

**Check the coordinates against the pin before you publish.** They were set when
the postcode on file was 384002; the address is now 384005, and nobody has
verified the latitude and longitude since. Whatever pin you drop on the Business
Profile is the one `BUSINESS.geo` in `src/config/site.ts` should match, because
that is what the `LocalBusiness` schema publishes.

Use the name exactly as written. Not "CareInflow — Healthcare Web Design", not
"CareInflow Mehsana". Keyword-stuffing the business name is the single most
common cause of a suspended listing, and it is the one thing on this page that
can cost you the profile outright.

The website field takes the canonical form: `https://www.careinflow.com/`, with
`www` and with the trailing slash. The apex 301s to it, so the bare domain would
work, but a listing that points at a redirect is a weaker signal for no reason.

## Category

Primary: **Website designer**. That is what the studio sells and what the site
demonstrates.

Do **not** choose a healthcare category. CareInflow builds websites *for*
clinics; it does not provide care. A medical category on this listing would be
a misrepresentation to Google and to patients who found it by accident, and it
is the same reason the site's schema uses `Organization` + `ProfessionalService`
rather than `Physician`, `Dentist` or `MedicalClinic`.

Secondary categories worth adding: *Internet marketing service*, *Marketing
agency*. Skip *Advertising agency* — the site says plainly, in four places, that
paid advertising is not offered.

## Business description

Paste this. 741 characters, inside Google's 750 limit, with the whole offer in
the first sentence because that is roughly all that shows before "read more".

> CareInflow is a healthcare-only web design studio in Mehsana, Gujarat. We
> build websites for dental, dermatology, physiotherapy, eye, orthopaedic and
> paediatric clinics, manage their Google Business Profiles, and do the local
> search work behind both.
>
> Every site is built by hand, with a page for each treatment written in the
> words patients search rather than clinical terms, and tested on the mid-range
> Android phones patients actually use. Enquiries arrive on WhatsApp, where a
> clinic will see them.
>
> We work with practices across Mehsana, Ahmedabad, Gandhinagar, Visnagar,
> Patan and the towns around them, from one studio on Radhanpur Road. Prices
> are published rather than quoted behind a call, and agreed in writing before
> work begins.

A 499-character version, if you would rather it all sat above the fold:

> CareInflow is a healthcare-only web design studio in Mehsana, Gujarat. We
> build websites for dental, dermatology, physiotherapy, eye and orthopaedic
> clinics, manage their Google Business Profiles, and do the local search work
> behind both. Every site is built by hand, with a page for each treatment
> written in the words patients search, and tested on the phones patients
> actually use. We work with practices across Mehsana, Ahmedabad, Gandhinagar
> and North Gujarat from one studio on Radhanpur Road.

### What is deliberately not in it

Google rejects or suppresses descriptions carrying any of these, and the first
four are also things this studio has decided not to say anywhere:

- **The free review.** It is the strongest thing on the website and it must not
  go here — Google's rules bar promotional and sales content from the
  description. Put it in a **Post** and in the **Services** descriptions, where
  offers are allowed.
- **Prices.** Same rule. "Prices are published" is a statement of how the studio
  works, not a price, which is why that phrasing survives.
- **Superlatives** — best, leading, top-rated, number one. Against Google's
  guidelines and against the site's own voice.
- **Ranking claims.** Nothing that implies a search result can be promised.
- **URLs, phone numbers, email addresses, or HTML.** Google strips or rejects
  them, and every one of them already has its own field on the profile.
- **Emoji and ALL CAPS.**
- **Keyword stuffing.** "Web design Mehsana web designer Mehsana clinic website
  Mehsana" is the fastest route to a suppressed description. The towns above
  appear once each, in a sentence that means something.

### Where the rest of the words go

The description is one of several text surfaces and it is not the most useful
one. In rough order of what actually moves a local result:

1. **Services** — each of the five, named as the site names them, with a short
   description. This is the field that matches what people type.
2. **Products** — the three website builds work well here, with images.
3. **Posts** — weekly-ish, and the only place promotional content belongs. The
   free review, a new case study, a treatment-page explainer.
4. **Questions & answers** — seed the real ones from `/faq` yourself. An empty
   Q&A section invites strangers to answer for you.
5. **Description** — last, and mostly read by people already on the profile.

## Services, to match the site

List exactly the five the site prices, with the same names:

1. Healthcare website design
2. Local SEO
3. Google Business Profile management
4. Website maintenance and care
5. Social media content

Descriptions should be shortened from the service pages rather than rewritten.
If a service description on the profile promises something `/services` does not,
the profile is now the least accurate thing about the business.

**Prices**: leave them off the profile, or state them exactly as
`src/config/pricing.ts` has them. The site's whole position is that a published
figure is a starting point for a stated scope and the real number is fixed in
writing after the free review. A price on the listing with no scope attached
undoes that.

## Photos

Genuine photographs of the actual studio only. The site already has some in
`src/assets/editorial/` — `studio-exterior.webp`, `about-studio-team.webp`,
`founder-working.webp` — and they should match what is uploaded, because a
visitor who arrives from the listing will see both.

Never upload stock imagery, AI-generated interiors, or a photograph of a client's
clinic as if it were the studio.

## Reviews

- Do not buy, incentivise, or ask staff and family for reviews.
- Do not gate requests to people you expect to be positive.
- Ask real clients after real work, and reply to every review, positive or not.
- Until there are genuine reviews, the site publishes none — no testimonial
  section, no ratings, and no `Review` or `AggregateRating` in the schema. The
  `src/content/testimonials/` collection ships empty on purpose and
  `npm run verify` fails the build if a review type ever appears in the JSON-LD.

The first genuine review is worth more than the whole of this list. The first
fake one costs the listing.

## Service area

Mehsana is where the studio is. Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan,
Kalol, Siddhpur and Palanpur are places served.

This is a business with a real address, so keep the address visible rather than
converting it to a service-area business. Add the eight towns as service areas
alongside it. Do not create a second listing for any of them: there is one
studio and no branch offices, the site says so on every area page, and duplicate
listings are a suspension risk as well as a lie.

## After it is live

1. Add the listing's Maps URL to `PROFILES` in `src/config/site.ts`. It is empty
   today, so `sameAs` is omitted from the Organization schema rather than
   published as an empty array. One line, and the entity connects.
2. Re-run `npm run verify`, commit, push. Cloudflare redeploys.
3. Check the profile's name, address, phone, hours and website against the
   table at the top of this file one more time, from the live listing rather
   than from memory.
4. Consider adding the listing to the Search Console property's associated
   accounts so the two report against each other.

## What actually moves a local ranking

Google ranks the local pack on three things: **proximity** (where the searcher
is, which nobody controls), **relevance** (how well the listing and site match
the query), and **prominence** (how well known the business is, on and off the
web). Everything you can act on sits in the second and third.

In the order they are worth doing:

1. **Reviews, genuinely earned, and every one replied to.** This is the single
   largest lever available to a new listing, and the slowest. Ask every real
   client after real work. Reply to all of them. Never buy, incentivise or
   gate them — that risks the listing, which costs more than the reviews earn.
2. **Categories.** Primary *Website designer*. The primary category carries
   more weight than every secondary combined, so it is worth getting exactly
   right rather than broad.
3. **Completeness.** Every field filled: services, hours including holidays,
   photos, description, attributes. Google favours listings it does not have
   to guess about.
4. **NAP consistency** everywhere the business appears. The name, the address
   and the phone number must be byte-identical on the site, the listing and any
   directory. This is why the address lives in one config file with a build
   guard, and why the 2.9km error in the coordinates mattered.
5. **Posts, weekly-ish.** Cheap, and a live signal that the business is active.
6. **Pages that answer local queries.** Nine area pages already exist, each
   saying something the others do not. Thin duplicates of these would hurt
   rather than help.
7. **Citations** — consistent listings on Justdial, Sulekha, IndiaMART and
   local directories. Low value each, cumulative over time.

### What is already done, on the site side

The website half of this is finished and verified:

- `LocalBusiness`/`ProfessionalService` schema with address, geo taken from the
  listing pin, opening hours, `areaServed` for all nine towns, and `priceRange`
- `sameAs` and `hasMap` both pointing at the listing's CID, which is what ties
  the site and the profile together as one entity
- One canonical host, every page indexable, a valid sitemap, and the whole site
  loading in about a second on 4G
- Nine area pages and three specialty pages, each genuinely distinct
- FAQ schema on the pages that carry questions

## What nobody can promise

**No one can guarantee a number-one local ranking — not us, not any agency.**
The site says so on its own FAQ page, and refusing to promise it is part of
what the studio sells.

Whether the listing appears in the local pack, for which searches, and against
which competitors is Google's decision. It depends on proximity to the
searcher, on competition that changes without notice, on review activity, and
on time — a listing created this month competes with ones that have been
accumulating signals for years. The list above is what makes the business
*eligible, accurate and prominent*. Ranking is downstream of that and belongs
to Google.

Anyone who tells you otherwise is either guessing or selling something.
