/**
 * The practices CareInflow actually works with.
 *
 * The single source for every page that names a client — the homepage band,
 * /work, the Mehsana page and llms.txt — so the list can never grow on one page
 * and not on another. It replaces a hand-written array in the homepage hero
 * that named two clients while the studio had three.
 *
 * Three rules, from CLAUDE.md and docs/context/proof-library.md:
 *
 * 1. Paying practices only. Never a portfolio sample: those are labelled
 *    samples precisely so they can never be mistaken for one of these.
 * 2. Only what each practice has cleared, which today is its name and a link to
 *    the work. No logo, quote, screenshot or figure until the client agrees to
 *    that particular use. Permission is secured off the page and never
 *    mentioned on it — a studio telling a buyer its clients agreed to be named
 *    reads as a studio reassuring itself.
 * 3. `work` says what was trusted to us, and stops. No result is attached,
 *    because none has been recorded, and a reach or patient figure we could not
 *    show the working for is exactly the claim this site exists not to make.
 */
import type { AccentName } from '@/lib/accents';

export interface Client {
  id: string;
  /** The practice's public name, exactly as it asked to be named. */
  name: string;
  place: string;
  /** The pillar, as a chip: what kind of work this is at a glance. */
  pillar: string;
  /** What was trusted to CareInflow, in one plain sentence. No outcomes. */
  work: string;
  /** Accent of that pillar: `web` for a website build, `social` for content. */
  accent: AccentName;
  /** True only for a practice whose website CareInflow built. */
  websiteBuild: boolean;
  /** Where a visitor can see the work for themselves. */
  url: string;
  linkText: string;
  /** Our own write-up of the project, when one exists. */
  caseStudy?: string;
}

export const CLIENTS: Client[] = [
  {
    id: 'pramukh-dental',
    name: 'Pramukh Multispeciality Dental Clinic',
    place: 'Mehsana',
    pillar: 'Website + Google',
    work: "The clinic's website, in English and Gujarati, and its Google Business Profile.",
    accent: 'web',
    websiteBuild: true,
    url: 'https://pramukhdentalclinic.com',
    linkText: 'Open the live site',
    caseStudy: '/work/pramukh-dental',
  },
  {
    // "Akshar Wellness" is the public name the owner confirmed on 2026-10-08.
    // A later brief called the practice something else; do not rename it.
    id: 'akshar-wellness',
    name: 'Akshar Wellness',
    place: 'Mehsana',
    pillar: 'Healthcare content',
    work: "Reels, posts, clinic creatives and flyers for the practice's Instagram.",
    accent: 'social',
    websiteBuild: false,
    // The bare profile. A share-sheet copy of this link carried utm_source and
    // igsh parameters, which identify whoever copied it, not the profile.
    url: 'https://www.instagram.com/akshar_360_wellness/',
    linkText: 'See their Instagram',
  },
  {
    id: 'sadbhav-physiotherapy',
    name: 'Sadbhav Physiotherapy Clinic',
    place: 'Mehsana',
    pillar: 'Healthcare reels',
    work: "Healthcare reels for the clinic's Instagram.",
    accent: 'social',
    websiteBuild: false,
    url: 'https://www.instagram.com/sadbhav_physiotherapy_clinic/',
    linkText: 'See their Instagram',
  },
];

/** The one client whose website we built — the case study the rest point to. */
export const WEBSITE_CLIENT = CLIENTS.find((c) => c.websiteBuild)!;

/** The practices whose healthcare content we make. */
export const CONTENT_CLIENTS = CLIENTS.filter((c) => !c.websiteBuild);
