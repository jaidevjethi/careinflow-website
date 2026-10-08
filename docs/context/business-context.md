# CareInflow — Business Context Specification

> Source of truth for what CareInflow is, what it sells, who it serves, and how it speaks.
> Companion docs: [website-strategy.md](website-strategy.md) · [technical-seo-spec.md](technical-seo-spec.md) · [proof-library.md](proof-library.md) · design: [../design/careinflow-design-system.dc.html](../design/careinflow-design-system.dc.html)

## Business Overview

CareInflow is a healthcare-only digital studio in Mehsana, Gujarat.

It helps doctors and clinics build a trustworthy digital presence through
healthcare content, websites, Google and local search. The specialisation is
the client — healthcare practices, and nobody else — not a production medium.

It started in 2026 and is run by its founder, Jaidev Jethi. That is said
plainly and never apologised for: a practice works directly with the person
doing the work, not with an account manager.

## The three pillars

They work together, and a practice can start with any one of them.

```
Doctor has knowledge and footage
  → CareInflow turns it into reels, posts and carousels   (content: the easy front door)
  → the doctor comes to trust the studio
  → the gaps in the website and Google listing become visible
  → a website and local-search foundation                  (the higher-value project)
  → Local SEO & Google Care continues after launch         (the recurring work)
```

**Sell the thing the practice actually needs.** A content client is never
pushed into a website; a website client is never pushed into content.

### 1. Healthcare content

> We turn your footage, ideas and clinic updates into ready-to-publish,
> patient-facing content.

Reels (patient explainers, treatment explainers, patient testimonials with
consent), educational posts, carousels, clinic creatives such as a package
flyer, captions and covers. The deliverable is a publish-ready healthcare
content asset, not "video editing" and never a "basic reel".

A standard healthcare reel: final video up to 3 minutes, editing and pacing for
retention and clarity, Gujarati or English captions, audio cleanup, basic colour
correction, relevant supporting graphics, transitions, an end card, a reel cover,
the Instagram caption copy, one revision, typically delivered in 1–2 working
days. Advanced pricing applies when an edit needs substantially more animation,
restructuring, several source videos, unusually long footage or complex
storytelling.

Sold one piece at a time or as one of three monthly packages. Every figure is in
[`src/config/pricing.ts`](../../src/config/pricing.ts).

No claim is ever made about reach, followers, leads, patients or revenue.

### 2. Healthcare websites

Custom websites for healthcare practices: a page per treatment, written for a
worried patient, fast on a mid-range Android, with WhatsApp and tap-to-call on
every page. Four packages (Foundation, Practice, Growth, Multi-Doctor /
Multi-Location). Every one ships with the local-search foundation and the
Google listing set up, and starts with an audit of the listing.

### 3. Google & local search

- **Google Business Profile rebuild**, one-time: setup or rebuild, categories,
  services, business information, hours, photos and profile sections, questions,
  a review-response workflow and local-search groundwork. The practice keeps
  ownership of its profile.
- **Local SEO & Google Care**, monthly: the profile maintained, review replies
  drafted for approval, search queries watched, website content updates, one new
  treatment page a month, speed checks and a monthly report.
- **Website Care**, monthly and priced to scope, for a practice that wants its
  website looked after without the Google work.

The objective is the groundwork that decides whether a practice can compete in
local search. Ranking depends on relevance, distance, prominence, competition,
reviews, time, website quality and profile quality, and nothing guarantees it.

## What CareInflow does NOT sell

Not on any menu, and not advertised. Exclusions say "not part of our packages"
rather than "never", because the founder may still take one on selectively —
but none of them is a service CareInflow offers or markets:

- Meta Ads or any paid-advertising management
- Full social-media account management, daily posting, DM and community management
- Influencer marketing
- Full branding projects
- Large-scale photography or video production (on-site shoots are custom projects)
- Mobile apps, software, IT consultancy

CareInflow is never a generic social-media agency, reel-editing shop,
graphic-design freelancer, web-development agency, or "we do everything"
marketing agency.

## Real clients

Three, all in Mehsana. The single source is
[`src/config/clients.ts`](../../src/config/clients.ts); permissions are tracked
in [proof-library.md](proof-library.md).

| Practice | What was trusted to CareInflow | Public link |
|---|---|---|
| Pramukh Multispeciality Dental Clinic | Website and Google Business Profile | pramukhdentalclinic.com, plus a full case study at /work/pramukh-dental/ |
| Akshar Wellness | Healthcare content: reels, posts, clinic creatives, flyers | instagram.com/akshar_360_wellness |
| Sadbhav Physiotherapy Clinic | Healthcare reels | instagram.com/sadbhav_physiotherapy_clinic |

"Akshar Wellness" is the public name the owner confirmed on 2026-10-08. Do not
rename it. The portfolio's three other websites (Lavanya, Gati, Divyam) are
samples with no business behind them and are labelled as samples everywhere.

## Target Customers

**Primary audience:**

- Independent doctors
- Dental clinics
- Physiotherapy clinics
- Dermatology clinics
- Eye clinics
- Orthopedic clinics
- Cosmetic clinics
- Pediatric clinics
- Gynecology clinics
- Mental health professionals
- Multi-specialty clinics

**Secondary audience:**

- Diagnostic centers and pathology labs
- Healthcare startups
- Medical consultants

**Good enquiries over many enquiries.** The site should filter as well as
attract. A practice that values healthcare specialisation, clear scope, reliable
turnaround and ongoing content is a better client than one asking for thirty
reels at the lowest possible rate.

## Pricing Philosophy

Published, specific and competitive — never "the cheapest". The figures live in
one place, [`src/config/pricing.ts`](../../src/config/pricing.ts), and every
page, FAQ answer, the price estimator, `llms.txt` and the JSON-LD read from it.
A price written anywhere else fails the build (`npm run verify`). The old price
table that used to sit here went stale twice; it is deliberately gone.

What a client pays for: healthcare specialisation, clear scope, the writing and
the enquiry path rather than the code, reliable turnaround, direct
communication with the founder.

Rules that hold the list together:

- Published figures are **starting points** for the scope described on the
  page. The exact number is fixed in writing after the free review.
- **No discounts, no offers, with one exception**: the content packages'
  introductory rate for a new client's first three billed months. It is shown
  beside the regular price, never alone, and never as a saving or a deadline.
- Combined plans that cost less than their parts say why — the content packages
  are planned and produced as one monthly batch. Never framed as a deal.
- The agreed price is **held**: whatever is fixed in writing stays fixed for
  as long as the engagement runs, even as studio rates rise. No deadline is
  ever attached to a quote.
- Prices exclude GST where it applies. Domain and hosting are paid by the
  client, in the client's own name, and are never marked up.
- Payment: a standard build in two halves (start, launch); larger builds in
  three (start, design approval, launch). Monthly plans are billed in advance
  and run month to month.

## Brand Personality

The brand should feel:

- Professional
- Modern
- Reliable
- Calm
- Helpful
- Honest
- Detail-oriented
- Friendly without being casual
- Confident without being arrogant

Avoid sounding:

- Corporate
- Overly technical
- Sales-driven
- Trendy
- Flashy
- Overly creative
- Filled with buzzwords

## Tone of Voice

Write as a knowledgeable specialist speaking directly to a doctor. Simple
English, short paragraphs, specific examples, concrete scope, honest
limitations, transparent pricing, direct answers.

Instead of saying:

> "Gujarat's best healthcare websites. Skyrocket your patients."

Say:

> "Healthcare websites, content and local search for clinics in Mehsana and Gujarat."

No unsupported superlatives ("best", "#1", "leading", "guaranteed", "most
popular"), no promise about outcomes, no urgency. The full rules are in the
`careinflow-voice` skill.

## Healthcare content integrity

Part of how the work is done, not marketing theatre:

- No invented patient results, fabricated testimonials or unsupported medical claims.
- No identifying patient information, and no clinical images, without clear written consent.
- No claim that a treatment works for everyone, and no fake before/after outcomes.
- Patient testimonial videos need the patient's written consent; we do not add claims the patient did not make.
- The doctor approves every piece for medical accuracy before it is published.
- Where a professional advertising rule is discussed in copy, the current rule is verified first.

## Brand mark

The logo is the interlocking "C" monogram supplied by the founder
(`docs/brand/careinflow-logo-original.png`), traced to vector as
`public/logo.svg` / `logo-light.svg` and the favicon tile. Regenerate with
`node scripts/vectorize-logo.mjs && node scripts/generate-assets.mjs`.

## Founder portrait

Jaidev's portrait (`src/assets/jaidev-jethi.jpg`) appears on the About page
beside the founder story and in a homepage strip, and is referenced by the
Person schema. Framing stays "thoughtful technologist", never celebrity.

## Funnel

Two offers, both on WhatsApp, both landing on `/contact`:

1. **The free digital review** of a practice's website, Google listing and local
   search, returned within two working days. The default everywhere.
2. **The sample-video reply**: send the topic and one clip, get back what the
   edit would involve, the turnaround and the price. Free to ask; the editing is
   never free.

(`/free-review` was a second page competing for the same conversion and now
redirects.) No gated downloads, and no discovery call *before* the review — the
review comes first, and the conversation happens once there is something in the
reader's hand to talk about.

Since 2026-08-26 there is a second way into the review. Booking is a button in
the `/contact` hero and a section of its own, opening Calendly in a new tab for
visitors who would rather talk before reading anything. It does not replace the
review and is never placed above it. Nothing of Calendly's loads on this site,
so "no forms" still holds here — the form is on their page, not ours.

Every ask carries the honest escape hatch — if the answer is "change nothing",
we say so.

## Business Facts

- Founder: Jaidev Jethi
- Address: F-27, Platinum Plaza, Radhanpur Rd, Mehsana, Gujarat 384005, India
- WhatsApp / phone: +91 97734 56668
- Email: careinflow.support@gmail.com
- Canonical domain: https://www.careinflow.com
- Founded: 2026, one studio, no branches. Service areas are places served, not places staffed.
- No scarcity, no counts presented as pressure, no fabricated track record. The integrity rules are unchanged: no invented testimonials, no ranking guarantees.
