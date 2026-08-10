---
name: gbp-optimize
description: Audit and improve a Google Business Profile for local map-pack visibility — what to check, in what order, how to drive the profile console in a browser, what cannot be automated, and which commonly-sold tactics do nothing. Use for any request to audit, fix, optimize, complete or rank a Google Business Profile or Google Maps listing, for CareInflow's own listing or a client's.
---

# Working on a Google Business Profile

The profile is where local ranking is decided, not the website. Google ranks the
three-result map pack on **relevance**, **distance** and **prominence**. Distance
is fixed by where the business physically is and cannot be bought or written
around. The website supports the profile; it does not substitute for it. Say this
out loud to the client before anything else, because it is the sentence that
stops "I bought a website and I'm not #1" from becoming "you failed".

## Before you touch anything: read the console, not Maps

The public Maps page **hides fields that exist**. Its About tab shows attributes
only — not the business description, not the services list. Audit from Maps and
you will confidently report gaps that are not gaps.

On this project that error was made twice in one session: "the description is
empty" and "no services are listed" were both wrong. Both were populated. Only
the console showed them.

Get to the console: search the business name while signed in as an owner, then
**Edit your business information**. Useful hash routes once the panel is open:

| Route | Opens |
|---|---|
| `#mpd=editprofile/info` | Business information |
| `#mpd=editprofile/info/phone` | straight to the phone field |
| `#mpd=~<listingId>/editprofile/services` | Services |
| `#mpd=~<listingId>/editprofile/products/add` | Add product |

Two more Maps-reading traps:

- **"Add missing information → Add place's phone number"** on the panel means no
  phone is published. A number sitting in the console field unsaved still shows
  this. Check, clean the format, save.
- **The address Maps displays is Google's normalisation**, not what is stored.
  Google re-orders it and appends the sublocality it geocoded. Compare the
  website against the **stored** value in the console. On this project the Maps
  display looked like a NAP mismatch and was not one.

## Order of work

Do these in order. Each one is worth more than everything below it.

1. **Phone.** A listing with no phone number has no P in its NAP. Nothing else
   you do matters as much. Enter the national number without the trunk `0`; the
   country selector carries the code.
2. **NAP exactness.** Name, address and phone must match the website
   character-for-character. Fix whichever side is wrong — usually the profile,
   because the website is version-controlled and the profile was typed once.
3. **Categories.** One primary, then only genuinely applicable secondaries.
   Categories are the strongest relevance lever *and* they unlock service slots —
   adding two on this project immediately created two new service groups.
4. **Services.** Each one is a signal. Give each a description; empty service
   descriptions are the most common unfinished work on an otherwise complete
   profile.
5. **Description.** Aim for ~750 characters. Say what the business does, who for,
   and where. No keyword lists.
6. **Products.** Prices, descriptions and a landing-page URL per item.
7. **Photos.** 20+, covering exterior, interior, team and work.
8. **Reviews.** Earn them. Never buy them, never incentivise them.

## Driving the console in a browser

The profile editor is a hostile automation target. These are not preferences,
they are things that cost real edits on this project.

- **The dialog is outside the accessibility tree.** `find` and `read_page` cannot
  see it and will insist no such form exists. The *dashboard* buttons (Edit
  profile, Edit services, Edit products) **are** in the tree — click those by
  `ref`. Everything inside the dialog is coordinates only.
- **The window rescales between calls.** A coordinate read from one screenshot
  can miss by the next call. Put the screenshot and the clicks that depend on it
  in **one `browser_batch`**, and re-screenshot after anything that changes the
  layout. Two edits were lost to this before batching.
- **Wheel-scrolling or dragging the scrollbar with an edit form open raises
  "Discard edits?"** Click **Cancel**, never Discard. To reach a field below the
  fold, press **Tab** from the current field instead — Tab moves out of a
  textarea to the next input and scrolls it into view.
- **Every save shows "Your edit is pending… up to 10 minutes" plus a
  CURRENT/PENDING diff.** That badge is your only confirmation. **No pending
  badge means it did not save.** Re-open and verify after every single save; on
  this project a name change silently failed the first time.
- **Clicking a list row opens that row for editing**, it does not add a new one.
  One stray click lands you inside a live service with a Delete button. Escape
  out; do not save.

### What cannot be automated

**Product photos.** Google requires a photo per product, the file input is not in
the accessibility tree, and the visible control opens a native OS picker. There
is no path through. Do not burn turns on it.

Hand over instead: write every product out — name, category, price, full
description, landing URL — prepare and send the image files, and give the
30-second click sequence. The client finishes it in a few minutes.

## Tactics that do nothing — do not sell these

- **Geo-tagging photos.** Google strips EXIF on upload. The coordinates do not
  survive. This is one of the most widely sold local-SEO services and it has no
  measurable effect. Say so plainly when a client asks for it.
- **A paid link per page**, or joining every chamber of commerce within range
  purely for the link. That is link buying, and it contradicts any positioning
  built on not gaming search.
- **Review widgets and `AggregateRating` markup** for ratings the business does
  not have. A rating in markup that a visitor cannot see is fabrication however
  common it is.
- **Ranking guarantees.** Nobody can honestly make one.
- **Neighbourhood and landmark pages** that are one page rewritten with the place
  name swapped. That is a doorway page. A location page must say something the
  others do not or it is worse than not existing.

## Images: check every one before it goes on a live listing

Marketing image libraries are full of invented clinics, invented staff and
fabricated metrics. On the site they usually sit behind an ILLUSTRATIVE label. A
Business Profile card has no such label.

**Open and look at every image before uploading.** Reject any that contains:

- an invented client name, logo or uniform
- invented people presented as staff, or a team larger than the business
- fabricated numbers — uptime, load times, Lighthouse scores, review counts
- a star rating of any kind

Real screenshots of real client work are the best product photos available and
usually already exist in the repo. Convert to JPG (`sharp`, 1200px, quality 88);
WebP is unreliable in these upload fields.

## The website side, which the profile depends on

- **Canonical host must be the one that serves.** If `www` serves and the apex
  301s, canonicals on the apex name a URL that redirects.
- **`LocalBusiness` / `ProfessionalService` with a stable `@id`**, full address,
  `geo` **taken from the profile's own pin** (not from a map lookup — on this
  project the guessed coordinates were 2.9km out), `openingHoursSpecification`,
  and `areaServed` as places served.
- **`hasMap` and `sameAs` both carrying the listing's CID URL.** That is what
  lets a search engine reconcile the site and the profile as one entity rather
  than two. Use the `?cid=` form: short links can be retired and `/maps/place/`
  URLs carry a session token.
- **`contactPoint`** with phone, email and `availableLanguage`; `foundingDate`;
  `knowsAbout` — every entry mapping to a page that exists. A `knowsAbout` list
  that outruns the site is a keyword list wearing a schema.
- **The Open Location Code** the listing publishes, recorded as a second,
  independent assertion of where the business is.
- **`llms.txt`** as the machine-readable business record: canonical facts,
  services, areas, and how an assistant should describe the business. Note that
  Google does not read it — it is for AI assistants. Do not let anyone believe it
  affects ranking.

## Be honest about which places are winnable

A business ranks in the map pack of the town it is physically in. Ranking in a
different city's map pack, an hour away, with no address there, is not realistic
and no amount of content changes it. Area pages describe places **served**, never
places staffed, and use `Service` + `areaServed: City` — never a second
`LocalBusiness` address.

Tell the client which town is winnable and which is a long game. It is the part
of the conversation that makes everything else you say credible.

## What to hand back

1. A table of what changed, with before and after.
2. Anything you got wrong earlier in the audit, corrected explicitly — reading
   the console usually overturns at least one finding from Maps.
3. What you could not do and why, with the work packaged so someone else can
   finish it in minutes.
4. The honest ranking picture: which searches, which town, what it depends on.
