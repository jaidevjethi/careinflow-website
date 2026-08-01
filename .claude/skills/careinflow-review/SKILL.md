---
name: careinflow-review
description: How to judge and iterate on the CareInflow website — the visitor to judge as, an honest rating rubric, and the change-check-capture-judge-fix loop. Use for any request to review, rate, critique, audit or check how the site looks, and after any substantive change to a page, before reporting it done.
---

# Judging CareInflow honestly, and looping until it is right

This applies to **every** task in this repo, not only tasks that say "review".
A change is not finished when the diff compiles. It is finished when a visitor
would be better off for it, and that is a judgement someone has to actually make
by looking at the rendered page.

## Judge as the buyer, not as the builder

Not a designer. Not an engineer. Not someone who has read the design system.

> A clinic owner in Mehsana. Runs a four-chair dental practice or a small
> physio setup. Has never heard of CareInflow. Is between patients, on a
> mid-range Android, on mobile data. Has been burned by one agency already and
> is mildly sceptical of all of them. Cares about patients walking in, not
> about Lighthouse scores.

Every rating is that person's reaction. Ask their questions, in their words:

1. In five seconds, do I know what this company does and who it is for?
2. Is the first thing my eye lands on the thing they want me to do next?
3. Does this look more expensive than I would pay, or less?
4. Is there a number here I cannot check, or a claim I would have to take on trust?
5. Do I know what happens if I message them, and what it costs?
6. Would I send this link to another doctor?

If a change does not improve an answer to one of those, it is decoration.

## Rating, without flattering

Score out of 10: **clarity**, **visual hierarchy**, **premium feel**, **trust**,
**conversion path**, **does it look designed**.

- Never round up to be encouraging. A 6 is a 6. Most work is a 6.
- Lead with the single worst thing, not with what is working.
- Never give a number without having looked at the rendered page. Reading the
  source tells you what was intended, not what shipped.
- Say "I did not check that" rather than phrasing an assumption so it sounds
  verified. A confident wrong rating is worse than an admitted gap.
- Rate the thing in front of you, not the plan for it. Half-built is a low
  score, however good the intention.
- When the user pushes back on a rating, re-look before re-rating. Do not
  revise a number just because they disagreed, and do not defend one that the
  evidence does not support.

## The loop

```
change → astro check + price guard → build → capture → judge → fix the worst thing → repeat
```

Run it until a full pass turns up nothing that would change a visitor's
decision. Not until the diff feels big enough, and not until you are tired of
looking. If a pass finds three things, fix them and go round again; the fix for
one problem regularly creates the next.

**Gate on exit codes.**

```bash
npx astro check > /tmp/c.log 2>&1; echo "check: $?"
```

Grepping output for the word "error" has produced a green report over 29 real
type errors in this repo. Read `$?`.

Then `npm run build` and `node scripts/check-prices.mjs`, both on exit code.

## Looking at it properly

Reading the HTML is not looking at it. Capture and open the image.

**Full-page capture** — Chrome headless against the built output:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --user-data-dir="$TMP/ci-shot" --window-size=1440,8000 \
  --virtual-time-budget=9000 --screenshot="out.png" "http://127.0.0.1:4399/"
```

Serve `dist/` on a spare port first. Chrome on Windows will not open a window
narrower than about 500px — ask for 430 and it lays out at 500 and crops the
screenshot back, silently slicing the right edge off. Capture phones at 500.

**The squint test.** Downscale the capture to about 300px wide and back up with
`NEAREST`. No text is legible, so what is left is pure visual weight. That is
the heat map. The heaviest thing on the page must be the thing you want clicked
or read first. This is how the homepage's dark "AI answer" card was caught
out-shouting the two cards that actually sell.

**Prove the click target.** `elementFromPoint` at the corners of a card tells
you whether the whole card is really clickable or only the words look like it.
Scroll with `behavior: 'instant'` first — this site sets `scroll-behavior:
smooth`, so `scrollIntoView` returns before the rect has moved and every probe
comes back `null`.

**Measure colour, never eyeball it.** Contrast, and the separation between two
section grounds, are arithmetic. Compute them. Two neutrals that look different
in your head can be 1.06 apart, which is invisible.

## Two rules that are not negotiable

**Judge the deployed site.** Local `dist/` proves the build. It does not prove
the deploy. Push, wait for the Actions run to report `success`, then look at
`https://careinflow.com` (or the Pages mirror) before saying it is done. A dev
server that was started from another directory has served stale HTML in this
repo more than once.

**Report what was actually verified.** If tests failed, say so with the output.
If a step was skipped, say which. If something is done and checked, say it
plainly with no hedging. Never let "I built it" imply "I looked at it".

## What counts as finished

- Nothing on the page contradicts [careinflow-voice](../careinflow-voice/SKILL.md):
  no buzzwords, no urgency, no invented numbers, no em dashes.
- Nothing contradicts [careinflow-design](../careinflow-design/SKILL.md):
  midnight only as hero, one section, CTA and footer; one easing; one shadow.
- Every price traces to `src/config/pricing.ts` and the guard passes.
- No element crosses the viewport at 320px or at 1440px.
- Every claim on the page is one a sceptical doctor could check.
