# Proof library

> What CareInflow may say publicly about each real client, what is still to be
> collected, and the rules that keep the evidence honest. Read this before
> adding a client's name, logo, link, quote, screenshot or number anywhere on
> the site. The client list itself lives in
> [`src/config/clients.ts`](../../src/config/clients.ts).

CareInflow is new, and real practices already trust it with meaningful work.
That is the message, and three real relationships stated precisely carry it
better than any logo wall could. The aim is to look more *proven*, never bigger.

## The order of proof

Strongest first. Never mix the categories, and never let a visitor mistake one
for another.

1. Real client + real work + public case study
2. Real client + real work + permission to show the name and logo
3. Real client + real work + permission to link to the work
4. Real client relationship without public attribution
5. Sample or demonstration work, labelled as a sample wherever it appears

## Status, as of 2026-10-08

| | Pramukh Multispeciality Dental Clinic | Akshar Wellness | Sadbhav Physiotherapy Clinic |
|---|---|---|---|
| Where | Mehsana | Mehsana | Mehsana |
| Trusted with | Website and Google Business Profile | Healthcare content: reels, posts, clinic creatives, flyers | Healthcare reels |
| Proof level today | 1: public case study | 3: name and link | 3: name and link |
| Name on the site | Yes | Yes. "Akshar Wellness" is the public name the owner confirmed on 2026-10-08 | Yes |
| Link | pramukhdentalclinic.com and /work/pramukh-dental/ | instagram.com/akshar_360_wellness | instagram.com/sadbhav_physiotherapy_clinic |
| Logo | Not yet. Ask | Not yet. Ask | Not yet. Ask |
| Testimonial | None. Ask | None. Ask | None. Ask |
| Screenshots of the work | Website screenshots in the case study | None on the site. Ask first | None on the site. Ask first |
| Numbers | Build facts only: 11 treatment pages, English + Gujarati, about a second on 4G, two taps to enquire | None recorded yet | None recorded yet |

Name and link permission for Akshar Wellness and Sadbhav comes from the owner,
who placed them on the site as real clients for social-media work. Nothing
further — logo, quote, screenshot, figure — goes up until the client has agreed
to that specific use. Logo use is never a condition of working together.

## What to collect next

Only real, recorded evidence. Build it up over time; do not rush three
artificial case studies.

**Akshar Wellness (content):**
- How many reels, posts, creatives and flyers have been delivered, and over which months
- Turnaround from footage received to finished piece, logged per piece
- Before and after examples of one piece, with the client's consent
- A sentence in their own words

**Sadbhav Physiotherapy Clinic (reels):**
- Number of reels delivered and the formats (explainer, exercise, testimonial)
- Turnaround, logged per reel
- Examples, with consent
- A sentence in their own words

**Pramukh (website and GBP):**
- Anything new on the listing or the site that the clinic is comfortable sharing, with its date
- A sentence in their own words

Never publish reach, follower growth, leads, appointments or revenue unless the
number was genuinely recorded and the client has agreed to its use. A case study
can be strong on volume, turnaround, consistency, examples and process alone.

## Testimonials

- Never written on a client's behalf and presented as their quote.
- Never edited so heavily it stops being their voice. Fix spelling; keep the meaning and the words.
- Specific beats warm. "They turn our raw videos into ready-to-post reels within the agreed turnaround" is worth more than "Great service!"
- Stored in `src/content/testimonials/` only once approved, with the date. That collection renders nothing while it is empty, which is correct.
- Never in JSON-LD as a `Review` — the metadata guard fails the build on one.

## Privacy rules for anything from a client's account or clinic

Healthcare first. Before any screenshot, clip or example goes on the site, blur
or remove:

- patient names, faces and phone numbers
- treatment records, reports and appointment details
- WhatsApp conversations
- identifying photographs, unless the patient's written consent covers this use

If in doubt, leave it out.

## Asking a client

Short, in plain words, and it must be easy to say no. Something like:

> Hi Dr. ___, one quick question. We'd like to show the work we've done together
> on the CareInflow website. Would you be comfortable with us (1) showing your
> clinic's logo, (2) linking to your Instagram or website, and (3) quoting one
> line from you about working with us? Any one of these is fine, or none. It
> changes nothing about our work together either way.

Record the answer and its date in the status table above.
