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

1. **Never fabricate.** No invented testimonials, reviews, star ratings, client counts or statistics. CareInflow started in 2026 and says so plainly, without apologising for it: you work directly with the founder, not an account manager. **No scarcity of any kind** — no founding-practice count, no countdown, no deadline attached to a quote. The value is that a published price holds, not that it expires. Sample interface mockups must carry an `ILLUSTRATIVE` label.
   **Prices are real, and they live in `src/config/pricing.ts`.** Quote them from there — never write a figure from memory into copy, a FAQ answer or schema. Always frame a published number as a starting point for a stated scope, with the exact figure fixed in writing after the free review.
2. **No urgency or discount language.** Banned: "Buy now", "Limited time", "Only today", "Last chance", "cheap", "cheapest", "affordable", "% off", "save". The one reduced figure on the site, the content packages' introductory rate, is stated as a plain rule beside the regular price ("₹… a month for your first three billed months, then ₹…"), never as a saving or a deadline. We are not the cheapest and never say we are: clear scope, competitive pricing, direct communication and reliable turnaround.
3. **No buzzwords.** Banned: "cutting-edge", "digital ecosystem", "synergy", "next-level", "take your practice to the next level", "revolutionize", "unleash", "supercharge", "skyrocket", "dominate", "10X", "game-changing", "solutions" as a noun for services.
4. **Evidence-forward about ourselves, never about outcomes.** The register changed on 2026-10-08 at the owner's decision, reversing the claim-forward call of 2026-08-06.
   **Never write unsupported superlatives**, in body copy or in the crawler fields: "best", "#1", "leading", "most trusted", "guaranteed", and "most popular" until sales records make it true (the recommended package says "Our recommendation"). Not "Gujarat's best healthcare websites" — write what is checkable instead: "Healthcare websites, content and Google for clinics in Mehsana", "a healthcare-only studio in Mehsana".
   **Never write fabricated fact**: invented ratings, review counts, client counts, "trusted by N clinics", awards. Nothing self-serving in JSON-LD — a fabricated `aggregateRating` is a Google structured-data violation and risks a manual action. And never a promise about *results*: ranking, Maps position, enquiries, appointments, patient numbers, revenue, reach or followers. "We do not guarantee rankings, and nobody honestly can" is still the correct line and is still on the site; "we work on the groundwork that decides whether your clinic can compete in local search" is the confident version of it.
   Claims about things CareInflow genuinely controls stay as strong as ever: build quality, speed targets with reference ranges, the scope of a package, turnaround, fixed pricing, and the three named practices that already work with us.
5. **Healthcare only — that is the specialisation, not a medium.** The services are healthcare websites, healthcare content, Google Business Profile, local SEO and ongoing care. Never position CareInflow as an advertising, branding or general creative agency, a generic social-media agency, a reel-editing shop, a graphic-design freelancer, an app developer or an IT consultancy. A clinic flyer is a "clinic creative" inside healthcare content, never a business line of its own. The product is not "video editing": it is a doctor's own knowledge and footage turned into publish-ready, patient-facing content.

## Vocabulary

- Section labels are **plain language** in uppercase mono: "What we do", "Where patients look", "Our portfolio", "Questions". The old medical-record vocabulary (CHART, TRIAGE, PROTOCOL) was retired — it read cold and worked against comprehension. Still never "Solutions" or "Why choose us".
- Measurements always carry a reference range the way a lab report does: `LCP 0.9S · REF <1.2S`. A number without a reference is not evidence.
- CTAs (calm, informative): "Message us on WhatsApp" · "Get a free digital review" · "Send your clinic's name" · "Send one sample video" · "Book a consultation" · "See the method". Full placement rules live in the `careinflow-funnel` skill.
- Every ask carries its honest escape hatch — *if the answer is "change nothing", we will say that*. Never drop it to sound more confident; it is why the offer works. The content ask has its own: *we tell you what the edit involves and what it costs; we do not edit it for free, and there is no obligation.*
- Healthcare content vocabulary: "healthcare reel", "patient explainer", "clinic creative", "publish-ready". Never "basic reel", never "video editing" as the product. The doctor supplies the knowledge and the footage; we never imply we film, script or post unless a page says that service is included.
- One studio in Mehsana, no branches. Write "our studio", never "our offices" or "our locations"; service areas are places we serve, not places we sit.
- Write for the patient's perspective where it helps: symptom-and-cost words, not clinical terminology.

## Example transformation

Wrong: "We create cutting-edge digital ecosystems that revolutionize patient acquisition."

Right: "We build modern websites that help your clinic look professional, earn patient trust, and perform well on Google."

Wrong: "Gujarat's best healthcare websites. Skyrocket your patient numbers with viral reels."

Right: "You already have the knowledge. We turn your footage into publish-ready reels, and build the website and Google presence patients check next."

## Local context

Service areas (mention naturally, never stuffed): Mehsana (home base), Ahmedabad, Gandhinagar, Visnagar, Unjha, Patan, Kalol, Siddhpur, Palanpur, North Gujarat. Mobile-first reality: patients search on mid-range Android phones on mobile data; WhatsApp is the natural enquiry channel.
