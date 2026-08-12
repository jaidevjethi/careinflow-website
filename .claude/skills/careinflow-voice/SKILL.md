---
name: careinflow-voice
description: Apply CareInflow's brand voice when writing or editing any copy for the CareInflow website — page copy, headings, CTAs, articles, meta descriptions, microcopy. Use whenever content is written or rewritten in this repo.
---

# CareInflow voice

You are writing for busy healthcare professionals in Gujarat, India — doctors and clinic owners who are experts in medicine, not in websites. They are skeptical of agencies, short on time, and respond to evidence, not enthusiasm.

## Register

- Simple English. Short paragraphs (1–3 sentences). Clear headings.
- Explain the practical benefit to the practice, not the feature.
- Calm, professional, honest, detail-oriented. Friendly without being casual. Confident without being arrogant.
- Prioritize clarity over cleverness, always.

## Hard rules

1. **Never fabricate.** No invented testimonials, reviews, star ratings, client counts or statistics. CareInflow is a new studio and says so plainly. **No scarcity of any kind** — no founding-practice count, no countdown, no deadline attached to a quote. The value is that a published price holds, not that it expires. Sample interface mockups must carry an `ILLUSTRATIVE` label.
   **Prices are real, and they live in `src/config/pricing.ts`.** Quote them from there — never write a figure from memory into copy, a FAQ answer or schema. Always frame a published number as a starting point for a stated scope, with the exact figure fixed in writing after the free review.
2. **No urgency or discount language.** Banned: "Buy now", "Limited time", "Only today", "Last chance", "cheap", "affordable", "% off". Premium positioning: value, not price.
3. **No buzzwords.** Banned: "cutting-edge", "digital ecosystem", "synergy", "next-level", "revolutionize", "unleash", "supercharge", "game-changing", "solutions" as a noun for services.
4. **Claim-forward about ourselves, never about outcomes.** The register changed on 2026-08-06 at the owner's decision, and the line is *opinion vs fact*.
   **Write these.** Superlatives describing CareInflow: "Gujarat's best healthcare websites", "Gujarat's healthcare-only web studio". Opinion, not falsifiable, ordinary marketing. Put them where a crawler weighs them — H1, `<title>`, meta description — and *place* them rather than spraying: an adjective in every heading reads as desperate to a doctor and ranks no better.
   **Never write these**, because they are factual and false: invented ratings, review counts, client counts, "trusted by N clinics", awards. Nothing self-serving in JSON-LD — a fabricated `aggregateRating` is a Google structured-data violation and risks a manual action. And never a promise about *results* ("we will get you to #1", a guaranteed ranking or patient number). "We do not guarantee rankings, and nobody honestly can" is still the correct line and is still on the site.
   Claims about things CareInflow genuinely controls stay as strong as ever: build quality, speed targets with reference ranges, maintenance schedules, response times, fixed pricing.
5. **Healthcare only.** Never position CareInflow as an ad/branding/creative agency, app developer, or IT consultancy.

## Vocabulary

- Section labels are **plain language** in uppercase mono: "What we do", "Where patients look", "Our work", "Questions". The old medical-record vocabulary (CHART, TRIAGE, PROTOCOL) was retired — it read cold and worked against comprehension. Still never "Solutions" or "Why choose us".
- Measurements always carry a reference range the way a lab report does: `LCP 0.9S · REF <1.2S`. A number without a reference is not evidence.
- CTAs (calm, informative): "Message us on WhatsApp" · "Get a free written review" · "Send your clinic's name" · "Book a consultation" · "See the method". Full placement rules live in the `careinflow-funnel` skill.
- Every ask carries its honest escape hatch — *if the answer is "change nothing", we will say that*. Never drop it to sound more confident; it is why the offer works.
- One studio in Mehsana, no branches. Write "our studio", never "our offices" or "our locations"; service areas are places we serve, not places we sit.
- Write for the patient's perspective where it helps: symptom-and-cost words, not clinical terminology.

## Example transformation

Wrong: "We create cutting-edge digital ecosystems that revolutionize patient acquisition."

Right: "We build modern websites that help your clinic look professional, earn patient trust, and perform well on Google."

## Local context

Service areas (mention naturally, never stuffed): Mehsana (home base), Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan, Kalol, Siddhpur, Palanpur, North Gujarat. Mobile-first reality: patients search on mid-range Android phones on mobile data; WhatsApp is the natural enquiry channel.
