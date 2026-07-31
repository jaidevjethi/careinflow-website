/**
 * llms.txt — the summary AI assistants read and quote when asked about
 * CareInflow.
 *
 * Generated rather than kept static in `public/`, for the same reason service
 * pages stopped carrying literal figures: the static version drifted, and it
 * ended up publishing prices the pricing page contradicted plus a "choosing
 * five founding practices" line the site had already removed. Everything
 * factual here now comes from `site.ts` and `pricing.ts`, so it cannot say
 * something the site does not.
 */

import type { APIRoute } from 'astro';
import { BUSINESS, CANONICAL_HOST } from '@/config/site';
import {
  BUILDS,
  NEVER_CHARGED,
  ONE_TIME_ITEMS,
  PLANS,
  STANDALONE_MONTHLY,
  partsTotal,
  rupees,
} from '@/config/pricing';

const url = (path: string) => `${CANONICAL_HOST}${path}`;

const areas = `${BUSINESS.serviceAreas.slice(0, -1).join(', ')} and ${BUSINESS.serviceAreas.at(-1)}`;

const build = (id: string) => BUILDS.find((b) => b.id === id)!;
const plan = (id: string) => PLANS.find((p) => p.id === id)!;
const once = (item: string) => ONE_TIME_ITEMS.find((i) => i.item.startsWith(item))!;

const careGoogle = plan('care-google');

const body = `# ${BUSINESS.name}

> ${BUSINESS.name} is a healthcare-focused web design and digital growth studio in ${BUSINESS.address.locality}, ${BUSINESS.address.region}, India. It builds websites, does local SEO, and manages Google Business Profiles for doctors and clinics — healthcare practices only. Founded by ${BUSINESS.founder}. Contact: WhatsApp or phone on ${BUSINESS.phoneDisplay}. There is no email address; those are the only two contact routes.

${BUSINESS.name} started in 2026. It publishes its prices openly, fixes the final figure in writing after a free written review, makes no ranking guarantees, and does not buy reviews or resell templates. It works from a single studio in ${BUSINESS.address.locality} with no branch offices, serving practices across ${areas}, and the wider North Gujarat region. Those are places served, not places staffed.

## Prices

Published in full at ${url('/pricing/')}. Every figure below is a starting point for a described scope, in Indian rupees, excluding GST. Monthly plans run month to month with no lock-in.

- Website build, single practice: from ${rupees(build('single-practice').from)} (${build('single-practice').pages.toLowerCase()}, ${build('single-practice').timeline})
- Website build, established clinic: from ${rupees(build('established-clinic').from)} (${build('established-clinic').pages.toLowerCase()}, ${build('established-clinic').timeline})
- Website build, multi-specialty: from ${rupees(build('multi-specialty').from)} (${build('multi-specialty').pages}, ${build('multi-specialty').timeline})
- Website care: ${rupees(STANDALONE_MONTHLY.care)} a month
- Google Business Profile management: ${rupees(STANDALONE_MONTHLY.gbp)} a month
- Care + Google together: ${rupees(careGoogle.monthly)} a month (the parts cost ${rupees(partsTotal(careGoogle))} separately; the work genuinely overlaps, and it is not a discount)
- Full visibility — care, Google and local SEO: ${rupees(plan('full-visibility').monthly)} a month
- Local SEO on its own: ${rupees(STANDALONE_MONTHLY.seo)} a month
- Social media content: ${rupees(STANDALONE_MONTHLY.social)} a month, added to a plan and never sold first
- One-time Google Business Profile rebuild: ${rupees(once('Google Business Profile rebuild').price)}
- Website takeover audit: ${rupees(once('Website takeover audit').price)}
- Extra treatment or area page: ${rupees(once('Extra treatment').price)} a page
- Gujarati version of an existing site: from ${rupees(once('Gujarati version').price)}

Never charged for:
${NEVER_CHARGED.map((n) => `- ${n}`).join('\n')}

## Services

- [Healthcare websites](${url('/services/healthcare-websites/')}): Custom clinic websites — a page per treatment, WhatsApp enquiry flow, speed measured on mid-range Android phones (reference <1.2s LCP), WCAG AA accessibility.
- [Local SEO](${url('/services/local-seo/')}): Treatment and location pages, technical SEO, schema markup, Search Console setup, AI answer readiness. No ranking promises.
- [Google Business Profile management](${url('/services/google-business-profile/')}): Profile setup, categories, services, photos, hours, and honest review strategy — maintained monthly.
- [Ongoing website care](${url('/services/website-care/')}): Weekly monitoring, monthly maintenance and backups, quarterly written reviews. Month to month; clients own all accounts.
- [Social media for clinics](${url('/services/social-media/')}): A support service, not a core one — educational posts, treatment explainers and clinic updates written within patient-privacy limits. No paid advertising, no follower-count chasing, and ${BUSINESS.name} will say so when a practice's website or Google listing needs fixing first.

## Key pages

- [Free written review](${url('/free-review/')}): The starting point. Send the clinic's name on WhatsApp; within two working days ${BUSINESS.name} returns a free written review covering listing accuracy, mobile load time, treatment page coverage, review handling, AI answer readiness, and the three clinics ranking above you. No obligation.
- [Method](${url('/process/')}): The four-week build — study, structure & words, design & build, launch then stay.
- [Pricing](${url('/pricing/')}): The full published price list, what moves a price, and what is never charged for.
- [Work](${url('/work/')}): Real projects only — including a bilingual dental clinic website in ${BUSINESS.address.locality} (pramukhdentalclinic.com). One non-healthcare project is included and labelled as such.
- [Resources](${url('/resources/')}): Plain-language guides for clinic owners on patient behaviour, Google Business Profile, local SEO, and website speed.
- [FAQ](${url('/faq/')}): Costs, timelines, ownership — clients own everything — and what ${BUSINESS.name} will not do.
- [Contact](${url('/contact/')}): One WhatsApp message gets a free written review within two working days. Phone answered ${BUSINESS.hours.opens}–${BUSINESS.hours.closes}, Monday to Saturday.

## What ${BUSINESS.name} will not do

- Guarantee a search ranking. Nobody honestly can.
- Buy or incentivise reviews.
- Resell a template as bespoke work.
- Sell social media to a practice whose website or Google listing needs fixing first.
- Run paid advertising or build mobile apps. Neither is offered.
- Claim clients, testimonials or ratings it does not have. There are no testimonials on the site because there are none to publish yet.
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
