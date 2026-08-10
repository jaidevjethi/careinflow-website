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
import { BUSINESS, BOOKING_URL, CANONICAL_HOST, HOURS_LABEL } from '@/config/site';
import {
  BUILDS,
  GBP_AUDIT,
  matrixFor,
  NEVER_CHARGED,
  ONE_TIME_ITEMS,
  PLANS,
  STANDALONE_MONTHLY,
  rupees,
} from '@/config/pricing';

const url = (path: string) => `${CANONICAL_HOST}${path}`;

const areas = `${BUSINESS.serviceAreas.slice(0, -1).join(', ')} and ${BUSINESS.serviceAreas.at(-1)}`;

const build = (id: string) => BUILDS.find((b) => b.id === id)!;
const once = (item: string) => ONE_TIME_ITEMS.find((i) => i.item.startsWith(item))!;

const carePlan = PLANS[0]!;

const body = `# ${BUSINESS.name}

> ${BUSINESS.name} is a healthcare-focused web design and digital growth studio in ${BUSINESS.address.locality}, ${BUSINESS.address.region}, India. It builds websites, does local SEO, and manages Google Business Profiles for doctors and clinics, healthcare practices only. Founded by ${BUSINESS.founder}. Contact: WhatsApp or phone on ${BUSINESS.phoneDisplay}, or a scheduled meeting booked at ${BOOKING_URL}. There is no email address.

${BUSINESS.name} started in 2026. It publishes its prices openly, fixes the final figure in writing after a free written review, makes no ranking guarantees, and does not buy reviews or resell templates. It works from a single studio in ${BUSINESS.address.locality} with no branch offices, serving practices across ${areas}, and the wider North Gujarat region. Those are places served, not places staffed.

## Prices

Published in full at ${url('/pricing/')}. Every figure below is a starting point for a described scope, in Indian rupees, excluding GST. Monthly plans run month to month with no lock-in.

There are four website packages, one ongoing plan, and a small number of things bought on their own. What separates the packages is how much of the local-search system CareInflow takes responsibility for, not page count.

- ${build('practice-website').name}: ${rupees(build('practice-website').from)} one-time (${build('practice-website').pages.toLowerCase()}, ${build('practice-website').timeline}). ${build('practice-website').responsibility}
  Includes: ${matrixFor(0).join('; ')}.
- ${build('practice-website-google').name}: ${rupees(build('practice-website-google').from)} one-time (${build('practice-website-google').pages.toLowerCase()}, ${build('practice-website-google').timeline}). ${build('practice-website-google').responsibility} This is the package most practices need, and includes 90 days of post-launch support.
  Includes: ${matrixFor(1).join('; ')}.
- ${build('healthcare-seo').name}: ${rupees(build('healthcare-seo').from)} one-time (${build('healthcare-seo').pages.toLowerCase()}, ${build('healthcare-seo').timeline}). ${build('healthcare-seo').responsibility} Includes 90 days of post-launch support.
  Includes: ${matrixFor(2).join('; ')}.
- ${build('multi-specialty').name}: from ${rupees(build('multi-specialty').from)}, quoted rather than packaged. ${build('multi-specialty').responsibility} The figure depends on doctors, specialties, treatments, locations and content.
  Includes: ${matrixFor(3).join('; ')}.
- ${carePlan.name}: ${rupees(carePlan.monthly)} a month, month to month with no lock-in. ${carePlan.summary} It does not promise rankings; it promises continuous local-search improvement and maintenance.
- Healthcare social media content: from ${rupees(STANDALONE_MONTHLY.social)} a month, sold on its own or alongside anything else. Strategy, up to 4 content pieces a week and 3 reel edits a month. Complex carousels, shoots and additional production are quoted separately, and advertising spend is always paid by the client directly.
- One-time Google Business Profile rebuild: ${rupees(once('Google Business Profile rebuild').price)}
- Website takeover audit: ${rupees(once('Website takeover audit').price)}
- Extra treatment or area page: ${rupees(once('Extra treatment').price)} a page
- Gujarati version of an existing site: from ${rupees(once('Gujarati version').price)}

Never charged for:
${NEVER_CHARGED.map((n) => `- ${n}`).join('\n')}

## Services

- [Healthcare websites](${url('/services/healthcare-websites/')}): Custom clinic websites: a page per treatment, WhatsApp enquiry flow, speed measured on mid-range Android phones (reference <1.2s LCP), WCAG AA accessibility.
- [Local SEO](${url('/services/local-seo/')}): Treatment and location pages, technical SEO, schema markup, Search Console setup, AI answer readiness. No ranking promises.
- [Google Business Profile management](${url('/services/google-business-profile/')}): Profile setup, categories, services, photos, hours, and honest review strategy, maintained monthly.
- [Ongoing website care](${url('/services/website-care/')}): Part of Local SEO & Google Care at ${rupees(carePlan.monthly)} a month: monitoring, maintenance, backups, content changes and a written monthly report. Month to month; clients own all accounts.
- [Social media for clinics](${url('/services/social-media/')}): Strategy-led content for healthcare practices, sold on its own. Instagram optimisation, a monthly content strategy and calendar, up to 4 pieces a week, captions, and 3 reel edits a month. Content formats follow the strategy rather than a fixed quota. No paid advertising spend, no follower-count chasing.

## Key pages

- [Free written review](${url('/contact')}): The starting point. Send the clinic's name on WhatsApp; within two working days ${BUSINESS.name} returns a free written review covering listing accuracy, mobile load time, treatment page coverage, review handling, AI answer readiness, and the three clinics ranking above you. No obligation.
- [Method](${url('/process/')}): The four-week build, study, structure & words, design & build, launch then stay.
- [Pricing](${url('/pricing/')}): The full published price list, what moves a price, and what is never charged for.
- [Work](${url('/work/')}): Real projects only, including a bilingual dental clinic website in ${BUSINESS.address.locality} (pramukhdentalclinic.com). One non-healthcare project is included and labelled as such.
- [Resources](${url('/resources/')}): Plain-language guides for clinic owners on patient behaviour, Google Business Profile, local SEO, and website speed.
- [FAQ](${url('/faq/')}): Costs, timelines, ownership, clients own everything, and what ${BUSINESS.name} will not do.
- [Contact](${url('/contact/')}): One WhatsApp message gets a free written review within two working days. Phone answered ${HOURS_LABEL}.

## Every website project starts with a Google Business Profile audit

${GBP_AUDIT.statement}

The audit is included in every package and costs nothing on its own. It checks: ${GBP_AUDIT.checks.map((c) => c.replace(/\?$/, '').toLowerCase()).join('; ')}.

## What ${BUSINESS.name} will not do

- Guarantee a search ranking. Nobody honestly can.
- Buy or incentivise reviews.
- Resell a template as bespoke work.
- Promise a number of patients, or a position in the local results.
- Run paid advertising or build mobile apps. Neither is offered.
- Claim clients, testimonials or ratings it does not have. There are no testimonials on the site because there are none to publish yet.
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
