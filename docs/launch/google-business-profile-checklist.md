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

## What nobody can promise

Whether the listing appears in the local pack, for which searches, and against
which competitors is Google's decision and it depends on proximity, relevance,
prominence, review activity and competition. Everything above makes the listing
*eligible and accurate*. None of it is a ranking.
