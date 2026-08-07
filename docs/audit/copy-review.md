# Copy review — every page, August 2026

A read of all 37 indexable pages against `careinflow-voice`, the integrity
rules in CLAUDE.md, and what the rest of the site says. Nothing here has been
applied. **Approve the rows you want and they ship in one commit.**

## What the review did not find

Worth stating first, because it is the bulk of the result. A scan of every
built page for the banned vocabulary — urgency, discount language, buzzwords,
superlatives, "solutions", "why choose us", ranking guarantees, certification
claims, invented client counts — returned **six hits, all false positives**:
"the build is the cheap part", "not because it is a discount", "Will my clinic
rank number one on Google?" answered *"We do not promise rankings"*, and "a
patient arrives in a hurry". The voice is consistent, the register holds, and
the honest escape hatch (*if the answer is "change nothing", we will say
that*) is present on every CTA panel on the site.

The FAQ page's "20 questions" stat is computed from the collection, so it
cannot drift. Every published figure traces to `pricing.ts`, enforced by the
price guard. The sample build is labelled as invented on the index, the card
and its own page. The non-healthcare project is labelled on all three too.

So what follows is short.

---

## 1 — Contradictions inside the site

### 1.1 `/about`, "What CareInflow is not" panel — **recommend fixing**

| | |
|---|---|
| **Current** | "Websites, local SEO, Google Business Profile, ongoing care, for healthcare practices. That is the whole list." |
| **Proposed** | "Websites, local SEO, Google Business Profile and ongoing care, for healthcare practices, with social media content as a support service. That is the whole list." |
| **Why** | Social media is not on the list, and it is a service: `/services/social-media`, ₹8,999 a month, its own page, its own schema `Offer`. "That is the whole list" is the one sentence on the page that is checkably false. |
| **Fact behind it** | `STANDALONE_MONTHLY.social` in `src/config/pricing.ts`; `src/content/services/social-media.mdx`. |
| **Benefit** | A visitor who arrives from the social media page does not read a flat denial that it exists. |
| **Intent** | Navigational / trust. |
| **Approval** | Not required — a correction. |

### 1.2 `/services` hero stat and section heading — **recommend fixing**

| | |
|---|---|
| **Current** | Stat: "Nine — services, priced on the page". Heading: "Most clinics need three of our nine services to begin." |
| **Proposed** | Stat: "Five — services, priced on the page". Heading: "Most clinics need three of our five services to begin." |
| **Why** | The page lists and prices **five**. The nine are the homepage's capability cards (AI answer readiness, Core Web Vitals, enquiry flow and quarterly review are parts of the five, not separate purchases). A stat a reader can count and find wrong on the same screen costs more than it earns — and this page's own H1 says "Four core services, plus the support work around them", so the page currently offers four, five and nine in three places. |
| **Fact behind it** | `src/content/services/` holds five entries. |
| **Benefit** | The number matches what is in front of them. |
| **Intent** | Commercial investigation. |
| **Approval** | **Yes** — you may prefer to keep "nine" and add the missing four to the page instead. |

### 1.3 `/404`, Services link description — **recommend fixing**

| | |
|---|---|
| **Current** | "Services → The four things we do" |
| **Proposed** | "Services → Everything we do for clinics" |
| **Why** | Same count problem, smaller stakes. |
| **Approval** | Not required. |

### 1.4 FAQ, "Do you build apps, do branding, or run advertising?" — **recommend fixing**

| | |
|---|---|
| **Current** | "…We can help with small complementary things like basic social media assets, but those four are what we are good at…" |
| **Proposed** | "…We also write social media content as a support service alongside a plan, never on its own. Those are what we are good at…" |
| **Why** | "Basic social media assets" describes something smaller than the priced monthly service the site sells. The answer reads as a polite brush-off of a service you are asking people to buy. |
| **Fact behind it** | `src/content/services/social-media.mdx` — monthly content plan, treatment explainers, clinic updates, profile setup, review prompts. |
| **Approval** | Not required. |

---

## 2 — Claims the site cannot currently support

### 2.1 `/work`, hero lede, hero stat and meta description — **recommend fixing**

| | |
|---|---|
| **Current** | Lede: "Every site on this page is live right now. Open one on your phone, time how long it takes to appear…" · Stat: "Live — open every one on your own phone" · Meta: "Open each one and time it yourself." |
| **Proposed** | Either **(a)** add the Divyam Tours URL to its frontmatter, which makes all three sentences true and needs no copy change at all; or **(b)** "Two of the three are open right now. Open one on your phone…" and stat "Live — two you can open yourself". |
| **Why** | Divyam Tours has no `url` in its frontmatter and no outbound link anywhere on the site, so a reader who takes the invitation cannot act on it for one of three projects. The page's whole argument is *do not take our word for it*, which makes this the worst place on the site for a claim that does not hold. |
| **Fact behind it** | `src/content/case-studies/divyam-tours.mdx` has no `url:`; `pramukh-dental.mdx` and `lavanya-skin-clinic.mdx` both do. |
| **Approval** | **Yes** — (a) is much better than (b) if the site is live. See §4.1. |

### 2.2 `/areas/visnagar`, three places — **recommend fixing**

| | |
|---|---|
| **Current** | "The colleges bring **thousands of students**…" · "several **thousand** students live here…" · FAQ: "They give you **thousands of patients** with no family doctor in the town." |
| **Proposed** | "The colleges bring a large student population…" · "a substantial number of students live here…" · "They give you a steady group of patients with no family doctor in the town." |
| **Why** | The integrity rule is no invented statistics, and "several thousand" is a specific magnitude offered three times as fact with nothing behind it. Every other area page makes its market claims qualitatively ("competition here is light and largely unaware", "most practices have an unclaimed listing"), which is defensible local judgment. This page is the only one that reaches for a number. |
| **Benefit** | The argument does not depend on the number, so removing it costs nothing and removes the one line a sceptical reader could challenge. |
| **Intent** | Local commercial. |
| **Approval** | Not required — unless you have a source, in which case cite it and keep the figure. |

### 2.3 `/about` and `/faq`, "How established is CareInflow?" — **recommend fixing**

| | |
|---|---|
| **Current** | "CareInflow is a specialist studio in Mehsana working only with healthcare practices. Every engagement runs the same way: a fixed price agreed in writing before work starts…" |
| **Proposed** | "CareInflow is new, and we would rather say so than let you find out. It started in 2026 as a specialist studio in Mehsana working only with healthcare practices. What is not new is how each engagement runs: a fixed price agreed in writing before work starts, direct access to the person actually building your site, and a written record of what we changed and what it did. The work page shows what we have shipped, in full, and the free review shows you how we think before you commit to anything." |
| **Why** | This is the one question on the site that is answered by changing the subject. The integrity rule says CareInflow is a new studio *and says so plainly*; `llms.txt` already publishes "CareInflow started in 2026". A direct question met with a deflection reads worse to a sceptical doctor than the plain answer, and the page's own hero stat claims "0 answers that dodge the question". |
| **Fact behind it** | `src/pages/llms.txt.ts` — "CareInflow started in 2026". |
| **Benefit** | The honesty is the product. Saying it out loud where it costs something is what makes the rest believable. |
| **Intent** | Trust / brand. |
| **Approval** | **Yes** — this changes how the studio presents its age. |

---

## 3 — Voice and consistency

### 3.1 `/services/healthcare-websites`, card summary — **recommend fixing**

| | |
|---|---|
| **Current** | "Built by hand, fast on **cheap phones**, written for a patient who is a little worried." |
| **Proposed** | "Built by hand, fast on a **mid-range Android**, written for a patient who is a little worried." |
| **Why** | Eighteen other places on the site say "mid-range Android" or "an inexpensive phone". This is the only one that calls the patient's handset cheap, and it appears on the service card — one of the most-read lines on the site. The voice note says write from the patient's perspective; describing their phone as cheap does the opposite. |
| **Approval** | Not required. |

### 3.2 `/contact`, WhatsApp prefill — **recommend fixing**

| | |
|---|---|
| **Current** | The page hardcodes `"Hi CareInflow, I'd like a free written review of my practice's online presence. Clinic name: "` instead of using `PREFILLS.default`, which reads `"Hi CareInflow. I would like a free written review…"`. |
| **Proposed** | Use `whatsappFor('default')`. One wording, one place to change it. |
| **Why** | Two different opening messages for the same action, differing in a comma, a contraction and a full stop — and the funnel skill says the prefills live in `site.ts`. It is also the reason the contact page's message is the only one on the site using a contraction. |
| **Approval** | Not required. |

### 3.3 Speed claims — **recommend adding the basis, not changing the number**

| | |
|---|---|
| **Current** | `/work/pramukh-dental`: "Opens in — about a second — on mobile data". Homepage: "Opens on mobile data — about a second". |
| **Proposed** | Keep the claim; change the reference from "on mobile data" to "**LCP 1.0s on 4G**" (Pramukh) and "**REF <1.2s on 4G**" (homepage). |
| **Why** | I measured both. On a typical Indian 4G profile (9 Mbps, 70 ms RTT, 2× CPU) pramukhdentalclinic.com returns **FCP 0.8s, LCP 1.0s, CLS 0, performance 100** — the claim holds. On Lighthouse's default mobile preset, which simulates a much poorer link (1.6 Mbps, 150 ms, 4× CPU), the same page returns LCP 2.3s. Both numbers are true; the claim is only checkable if the conditions are stated, and the voice rule is explicit that a number without a reference is not evidence. |
| **Benefit** | A doctor who runs PageSpeed on their phone and sees 2.3s currently catches you in what looks like an exaggeration. With the condition stated, they see a measurement instead. |
| **Approval** | **Yes** — it puts a technical term in front of a non-technical reader. |

---

## 4 — Needs your input before anything can be written

### 4.1 Is the Divyam Tours site live, and at what URL?

It has no URL in the repo. If it is live, adding `url:` to
`src/content/case-studies/divyam-tours.mdx` resolves §2.1 with no copy change.
If it is not live, §2.1 option (b) applies.

### 4.2 Does Pramukh Dental stand behind "ten years and five thousand procedures"?

`/work/pramukh-dental` states: *"Dr. Chinmay Patel is an MDS root canal
specialist with more than ten years and five thousand procedures behind him."*
That is a claim about a third party's professional record, published on your
site. It needs to be something the clinic has said and would repeat. If it came
from their own website or from them directly, it stays as is. If it was
inferred, it should go.

### 4.3 The sample build has a small layout shift

`jaidevjethi.github.io/lavanya-skin-clinic` measures **CLS 0.057** — inside
Google's "good" band (<0.1) but not the 0 that this site and Pramukh both hit.
It is the build shown to prove what a practice receives, and `/work` invites
people to open it and measure. Worth fixing in that repo; nothing to change
here.

---

## Not changed, and why

- **The market judgments on the nine area pages** ("competition here is light
  and largely unaware", "most practices have an unclaimed or half-finished
  listing"). These are qualitative professional assessments, not statistics,
  and each area page makes a different one. They read as a specialist's view
  of a market, which is what they are.
- **"Most patients", "most clinics", "many practices"** — thirty-odd instances.
  Hedged, unquantified and ordinary English. Replacing them with nothing would
  make the writing worse.
- **The whole of `/pricing`, `/process`, `/privacy`, `/faq` and the five
  service pages.** Read in full. On voice, internally consistent, and every
  figure traced to `pricing.ts`.
