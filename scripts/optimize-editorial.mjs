/**
 * Turn a drop of generated imagery into committed site assets.
 * Run: node scripts/optimize-editorial.mjs
 *
 * Sources live in the gitignored `generated_images/` scratch folder at the repo
 * root. They are deliberately not committed: the drop is ~17MB of JPEG against
 * ~2MB of output, and Cloudflare re-clones this repo on every push. The config
 * below is the record of how each asset was made — crop, ratio and grade are
 * all declared, so re-running against the same sources reproduces the outputs
 * exactly.
 *
 * ---------------------------------------------------------------------------
 * WHY THE RATIOS ARE FIXED
 *
 * Committed assets used to run at 1.792, 1.600, 1.491, 1.440, 1.000, 0.806,
 * 0.747 and 0.556 — every call site then hand-wrote its own height to cope.
 * Everything here lands on one of three shapes:
 *
 *   wide     3:2   standalone figures: MDX bodies, hero slides, photo strips
 *   band    16:9   card image bands, where the box is wider than it is tall
 *   tall     4:5   portrait phone mockups and hero asides
 *
 * Anything tighter than that is CSS `object-cover` on a fixed-height box, so
 * one file serves several shapes and nothing is re-exported per layout.
 *
 * ---------------------------------------------------------------------------
 * WHY THE GRADE IS MEASURED, NOT DIALLED
 *
 * Most of these photographs arrive warm — wood desks, amber cove lighting,
 * terracotta. The palette is one cool family, but a photograph is not a palette
 * token: the site's existing photographs measure b* +2.4 (hero-clinic-owner),
 * +2.95 (specialty-dental) and +6.38 (area-mehsana), because rooms contain wood
 * and people contain skin. Driving a photograph to b* 0 makes it look embalmed.
 *
 * So `grade` takes a *target* b*, and the script solves for the blue gain that
 * reaches it, then logs the before and after. The target for photography is the
 * existing register, not zero. Mockups on navy grounds already measure negative
 * and are left alone.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
/*
 * The header says the drop lives in `generated_images/` at the repo root, and
 * .gitignore ignores it there. This resolved four levels above the repo
 * instead — to D:\generated_images on this machine — so the script could only
 * ever have run from one particular checkout location.
 */
const SRC_DIR = root('generated_images/');

const RATIOS = { wide: 3 / 2, band: 16 / 9, tall: 4 / 5 };

/** Nothing on the site renders wider than 1120 CSS px, so 1200 covers 2x on every real slot. */
const DEFAULT_WIDTH = 1200;

/**
 * The drop. `n` is the number the image was generated under, kept so a file on
 * disk can always be traced back to the brief it came from.
 *
 * `crop` is relative (0–1) against the source, applied before the ratio cover
 * crop. `patch` regions are relative too, and exist for the one thing generated
 * imagery reliably gets wrong: a piece of invented text that would be legible
 * at render size. A patch either blurs its region (right for photographic
 * detail, e.g. a name badge) or fills it with a flat colour (right for flat UI,
 * where a blur leaves an obvious soft rectangle and a fill is invisible).
 */
const DROP = [
  // ── Homepage hero, slides 2 and 3 ────────────────────────────────────────
  {
    n: '01', src: '01-hero-collaboration.jpg',
    out: 'editorial/hero-founder-consult.webp',
    ratio: 'wide', grade: 3.0,
  },
  {
    n: '02', src: '02-hero-doctor-phone.jpg',
    out: 'editorial/hero-doctor-mobile.webp',
    // Drop the blurred left third; the doctor and the phone are the subject.
    crop: { left: 0.16, top: 0, width: 0.84, height: 1 },
    ratio: 'wide', grade: 3.0,
  },

  // ── Homepage triage cards ────────────────────────────────────────────────
  // Portrait phones stay portrait; the card band crops them with object-top.
  {
    n: '03', src: '03-triage-gbp-listing.jpg',
    out: 'mockups/surface-google-listing.webp',
    crop: { left: 0, top: 0.03, width: 1, height: 0.94 },
    ratio: 'tall', width: 900,
    /*
     * "4.8 ★★★★★ (127 reviews)" was legible at full size in the homepage
     * triage card — an invented rating, on the page whose neighbouring copy
     * says we never fabricate reviews. That is the one contradiction a
     * sceptical doctor needs to spot to discount everything else here.
     *
     * The listing panel behind it is pure #FFFFFF, so a fill is invisible and
     * the card simply reads as a profile with no rating yet, which is what a
     * new practice's listing actually looks like.
     */
    /* Coordinates are relative to the CROPPED frame, not the source — `patch`
       runs after `crop` in the pipeline. Getting that wrong the first time
       sliced the rating in half instead of removing it. */
    patch: [{ left: 0.276, top: 0.2358, width: 0.295, height: 0.0257, fill: '#FFFFFF' }],
  },
  {
    n: '04', src: '04-triage-mobile-website.jpg',
    out: 'mockups/surface-practice-website.webp',
    crop: { left: 0, top: 0.03, width: 1, height: 0.94 },
    ratio: 'tall', width: 900,
  },
  {
    n: '05', src: '05-triage-ai-search.jpg',
    out: 'mockups/surface-ai-answer.webp',
    ratio: 'band',
  },

  // ── Homepage specialty strip ─────────────────────────────────────────────
  { n: '06', src: '06-specialty-dental.jpg',        out: 'editorial/specialty-dental-room.webp',   ratio: 'wide', grade: 4.5, width: 900 },
  { n: '07', src: '07-specialty-dermatology.jpg',   out: 'editorial/specialty-dermatology.webp',   ratio: 'wide', grade: 4.5, width: 900 },
  { n: '08', src: '08-specialty-physiotherapy.jpg', out: 'editorial/specialty-physiotherapy.webp', ratio: 'wide', grade: 4.5, width: 900 },
  { n: '09', src: '09-specialty-ophthalmology.jpg', out: 'editorial/specialty-ophthalmology.webp', ratio: 'wide', grade: 4.5, width: 900 },
  { n: '10', src: '10-specialty-paediatrics.jpg',   out: 'editorial/specialty-paediatrics.webp',   ratio: 'wide', grade: 6.0, width: 900 },
  { n: '11', src: '11-specialty-orthopaedics.jpg',  out: 'editorial/specialty-orthopaedics.webp',  ratio: 'wide', grade: 4.5, width: 900 },

  // ── Wave 2 specialty heroes ──────────────────────────────────────────────
  // Grades follow the same rule as above: 4.5 where the frame is mostly room
  // and equipment, 6.0 where it is mostly skin. Driving a portrait to the
  // lower target makes it look embalmed, which is why paediatrics sat at 6.0
  // and why gynaecology and mental health do too.
  { n: '58', src: '58-specialty-multispecialty.jpg', out: 'editorial/specialty-multispecialty.webp', ratio: 'wide', grade: 4.5, width: 900 },
  { n: '59', src: '59-specialty-gynaecology.jpg',    out: 'editorial/specialty-gynaecology.webp',    ratio: 'wide', grade: 6.0, width: 900 },
  { n: '60', src: '60-specialty-ent.jpg',            out: 'editorial/specialty-ent.webp',            ratio: 'wide', grade: 4.5, width: 900 },
  { n: '61', src: '61-specialty-cardiology.jpg',     out: 'editorial/specialty-cardiology.webp',     ratio: 'wide', grade: 4.5, width: 900 },
  { n: '62', src: '62-specialty-mental-health.jpg',  out: 'editorial/specialty-mental-health.webp',  ratio: 'wide', grade: 6.0, width: 900 },
  { n: '63', src: '63-specialty-diagnostics.jpg',    out: 'editorial/specialty-diagnostics.webp',    ratio: 'wide', grade: 4.0, width: 900 },

  // ── /services hero aside ─────────────────────────────────────────────────
  {
    n: '12', src: '12-services-hub-hero.jpg',
    out: 'mockups/services-device-suite.webp',
    crop: { left: 0, top: 0.03, width: 1, height: 0.94 },
    ratio: 'tall', width: 900,
  },

  // ── Service detail bodies ────────────────────────────────────────────────
  { n: '13', src: '13-service-websites-before-after.jpg', out: 'mockups/websites-before-after.webp', ratio: 'wide' },
  { n: '14', src: '14-service-websites-wireframe.jpg',    out: 'editorial/websites-wireframe.webp',  ratio: 'wide', grade: 4.0 },
  { n: '15', src: '15-service-websites-responsive.jpg',   out: 'mockups/websites-responsive.webp',   ratio: 'wide', grade: 3.5 },
  {
    n: '16', src: '16-service-seo-ranking.jpg',
    out: 'mockups/seo-map-pack.webp',
    ratio: 'wide', grade: 4.0,
    /**
     * The third search result reads "Apollo Dental Ahmedabad" beside an
     * invented 4.8 rating. Apollo is a real, trademarked Indian healthcare
     * brand, and attaching a made-up rating to someone else's mark on a
     * commercial page is a third-party problem rather than a styling one.
     *
     * Filled rather than blurred: the results panel is flat #FFFFFF, so a fill
     * is invisible and the list simply reads as two results. A blur here left a
     * soft-edged rectangle that looked like a broken render.
     */
    patch: [{ left: 0.578, top: 0.630, width: 0.211, height: 0.098, fill: '#FFFFFF' }],
  },
  { n: '17', src: '17-service-seo-analytics.jpg', out: 'editorial/seo-analytics.webp', ratio: 'wide', grade: 3.5 },
  {
    n: '18', src: '18-service-gbp-optimized.jpg',
    out: 'mockups/gbp-profile-complete.webp',
    crop: { left: 0, top: 0.03, width: 1, height: 0.94 },
    ratio: 'tall', width: 900,
  },
  { n: '20', src: '20-service-care-dashboard.jpg',   out: 'mockups/care-monitoring.webp', ratio: 'wide' },
  { n: '21', src: '21-service-care-maintenance.jpg', out: 'editorial/care-studio.webp',   ratio: 'wide', grade: 4.5 },
  {
    n: '22', src: '22-service-social-post.jpg',
    out: 'mockups/social-post.webp',
    // Square source; take the band the phone actually occupies.
    crop: { left: 0, top: 0.22, width: 1, height: 0.68 },
    ratio: 'wide', grade: 5.0,
  },
  { n: '23', src: '23-service-social-calendar.jpg', out: 'editorial/social-calendar.webp', ratio: 'wide', grade: 5.0 },

  // ── /process ─────────────────────────────────────────────────────────────
  { n: '24', src: '24-process-week1-audit.jpg',     out: 'editorial/process-study.webp',     ratio: 'wide', grade: 3.5 },
  { n: '25', src: '25-process-week2-structure.jpg', out: 'editorial/process-structure.webp', ratio: 'wide', grade: 3.5 },
  { n: '26', src: '26-process-week3-build.jpg',     out: 'editorial/process-build.webp',     ratio: 'wide', grade: 4.0 },
  { n: '27', src: '27-process-week4-seo.jpg',       out: 'editorial/process-launch.webp',    ratio: 'wide', grade: 3.0 },

  // ── Second drop ──────────────────────────────────────────────────────────
  { n: '19', src: '19-service-gbp-reviews.jpg', out: 'editorial/gbp-reviews.webp', ratio: 'wide', grade: 4.0 },
  { n: '30', src: '30-pricing-promise-seal.jpg', out: 'mockups/pricing-promise.webp', ratio: 'wide', grade: 4.5 },
  { n: '31', src: '31-work-portfolio-collage.jpg', out: 'mockups/specialty-range.webp', ratio: 'wide' },
  { n: '32', src: '32-work-detail-before.jpg', out: 'mockups/speed-before.webp', ratio: 'wide', grade: 4.5 },
  { n: '33', src: '33-work-detail-after.jpg',  out: 'mockups/speed-after.webp',  ratio: 'wide', grade: 4.5 },
  { n: '34', src: '34-about-mehsana-studio.jpg', out: 'editorial/about-studio-team.webp', ratio: 'wide', grade: 5.0 },
  { n: '35', src: '35-about-gujarat-map.jpg',  out: 'editorial/gujarat-map.webp', ratio: 'wide' },
  { n: '36', src: '36-areas-hero-map.jpg',     out: 'editorial/areas-map.webp',  ratio: 'wide' },
  { n: '37', src: '37-resource-cover-gbp.jpg', out: 'mockups/gbp-article-cover.webp', ratio: 'wide', grade: 5.0 },
  /*
   * Replaces the previous pricing hero. A photograph rather than a device
   * render, so the hero uses the plain <Image> treatment the /contact and
   * /about heroes use, not IllustrationPanel. Both faces sit 13–45% down the
   * frame and a 3:2 source in the 260px hero band keeps 97% of the height, so
   * the default centre crop leaves them intact.
   */
  {
    n: '56', src: '56-pricing-founder-consultation.jpg',
    out: 'editorial/pricing-consult.webp',
    ratio: 'wide', grade: 4.0,
  },

  // ── Third drop ───────────────────────────────────────────────────────────
  { n: '38', src: '38-resource-cover-local-seo.jpg',     out: 'mockups/seo-article-cover.webp',   ratio: 'wide', grade: 4.5 },
  { n: '39', src: '39-resource-cover-website-needs.jpg', out: 'mockups/needs-article-cover.webp', ratio: 'wide' },
  { n: '40', src: '40-contact-whatsapp-mockup.jpg',      out: 'mockups/contact-whatsapp.webp',    ratio: 'wide', grade: 4.5 },
  { n: '41', src: '41-contact-studio-exterior.jpg',      out: 'editorial/studio-exterior.webp',   ratio: 'wide', grade: 5.0 },
  { n: '42', src: '42-free-review-report.jpg',           out: 'mockups/review-report.webp',       ratio: 'wide', grade: 4.0 },

  // ── Fourth drop ──────────────────────────────────────────────────────────
  { n: '43', src: '43-contact-hero-collaboration.jpg',            out: 'editorial/contact-consult.webp',    ratio: 'wide', grade: 4.0 },
  { n: '45', src: '45-service-websites-hero.jpg',                 out: 'editorial/websites-desk.webp',      ratio: 'wide', grade: 4.5 },
  { n: '46', src: '46-service-websites-speed-score.jpg',          out: 'mockups/websites-speed.webp',       ratio: 'wide', grade: 4.0 },
  { n: '47', src: '47-service-websites-copywriting.jpg',          out: 'editorial/websites-copywriting.webp', ratio: 'wide', grade: 5.0 },
  { n: '49', src: '49-service-gbp-optimization-comparison.jpg',   out: 'mockups/gbp-before-after.webp',     ratio: 'wide' },
  { n: '50', src: '50-service-care-maintenance-hero.jpg',         out: 'editorial/care-monitoring-desk.webp', ratio: 'wide', grade: 3.0 },
  { n: '52', src: '52-service-care-performance-optimization.jpg', out: 'mockups/care-speed-chart.webp',     ratio: 'wide', grade: 3.5 },
  { n: '53', src: '53-specialty-dental-hero.jpg',                 out: 'editorial/dental-consult.webp',     ratio: 'wide', grade: 3.5 },
  { n: '54', src: '54-specialty-dental-treatment-room.jpg',       out: 'editorial/dental-suite.webp',       ratio: 'wide' },

  /*
   * 48 is deliberately absent, and not for a stylistic reason.
   *
   * It shows a Google map pack listing three REAL Gujarat hospitals by name —
   * Sterling Hospital, HCG Cancer Centre, Bhagwan Mahavir — each with an
   * invented 4.9 rating and review count, ranked one to three, on the page
   * that sells local ranking. These are real businesses in the studio's own
   * market and plausibly future clients.
   *
   * The same problem as the "Apollo Dental Ahmedabad" row patched out of
   * seo-map-pack.webp, except there it was one line inside a results list and
   * here it is three headline rows that are the entire subject of the frame.
   * There is no crop or fill that leaves an image behind.
   *
   * 51 is absent too, for the ordinary reason: neon glassmorphism on a palette
   * that was just unified to one cool family reads as lifted from another site.
   */

  /*
   * 29 and 44 (the two package-tier card renders) are deliberately absent.
   *
   * 44 is the worse of the pair: it prints "LOCAL SEO #1" and "REGIONAL
   * DOMINANCE" in large type. A guaranteed ranking is the single claim this
   * site never makes, on any page, for any price.
   *
   * Both also name packages that do not exist — Starter Presence, Regional
   * Authority Platform, Multi-Specialty Practice — none of which appear in
   * src/config/pricing.ts, which check-prices.mjs guards precisely so that
   * nothing on the site can contradict that file. 44 additionally labels 8.2s
   * as "FAST", which is roughly seven times the load target published two
   * pages away.
   *
   * Their text is large and crisp, so unlike every other mockup here they
   * cannot be defused by rendering them small.
   *
   * It reads "Local Google Map dominance" and "Dominant Search & Map
   * Authority" across three cards, and this site's one unbreakable promise is
   * that it never promises a ranking. It also names three packages — Starter
   * Presence, Complete Practice, Regional Authority — that do not exist in
   * src/config/pricing.ts, on the page whose figures are guarded by
   * check-prices.mjs precisely so nothing can contradict that file. The neon
   * glassmorphism and the magenta are a distant third problem.
   *
   * The text is large and crisp, so unlike the other mockups here it cannot be
   * made illegible by rendering it small.
   */

  // ── Fourth drop ──────────────────────────────────────────────────────────
  /*
   * Rajkot, the tenth area page and the first outside North Gujarat. The nine
   * existing area photographs are each that town's own landmark — Rani ki Vav
   * for Patan, the Bohra havelis for Siddhpur, a pumpjack for Kalol — so this
   * is the Watson Museum in Jubilee Garden, Indo-Saracenic, 1888, and the
   * oldest museum in Saurashtra. Checked against a source before generating,
   * because a town's landmark got wrong is obvious to anyone who lives there
   * and undoes the point of writing the page at all.
   *
   * 1000px to match the nine it sits beside in the /areas grid, not the 1200
   * default: both slots crop it into a fixed-height band.
   */
  { n: '57', src: '57-area-rajkot.png', out: 'editorial/area-rajkot.webp', ratio: 'wide', width: 1000, grade: 3.0 },
];

/** No committed asset should exceed this; the whole point is a fast site. */
const SIZE_CEILING_KB = 170;

/**
 * Mean Lab b* over the whole frame. Positive is the yellow axis — the warm
 * cast the palette bans in flat colour and merely keeps on a leash in
 * photography. Sampled at 96x96 because a cast is a global property and
 * averaging every pixel of a 1376px source measures the same number slower.
 */
async function meanB(input) {
  const { data, info } = await sharp(input)
    .resize(96, 96, { fit: 'fill' })
    .toColourspace('lab')
    .raw({ depth: 'float' })
    .toBuffer({ resolveWithObject: true });
  const f = new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4);
  let sum = 0;
  for (let i = 2; i < f.length; i += info.channels) sum += f[i];
  return sum / (f.length / info.channels);
}

/**
 * Cool a frame until its mean b* reaches `target`.
 *
 * b* falls close to monotonically as blue gain rises, so a short bisection
 * lands within a fraction of a unit in four passes — far more reliable than a
 * fixed multiplier, which over-corrects a nearly-neutral frame and barely
 * touches a heavily amber one. Red is pulled down at a third of the blue gain
 * so skin does not go magenta as the frame cools.
 */
async function coolTo(buffer, target) {
  const before = await meanB(buffer);
  if (before <= target) return { buffer, before, after: before, gain: 1 };

  let lo = 1;
  let hi = 1.35;
  let best = null;
  for (let i = 0; i < 5; i += 1) {
    const gain = (lo + hi) / 2;
    const candidate = await sharp(buffer)
      .linear([1 - (gain - 1) / 3, 1, gain], [0, 0, 0])
      .toBuffer();
    const after = await meanB(candidate);
    best = { buffer: candidate, before, after, gain };
    if (after > target) lo = gain;
    else hi = gain;
  }
  return best;
}

if (!existsSync(SRC_DIR)) {
  throw new Error(
    `Source folder not found: ${SRC_DIR}\n` +
      'Generated drops live in the gitignored generated_images/ folder at the repo root.',
  );
}

await mkdir(root('src/assets/editorial'), { recursive: true });
await mkdir(root('src/assets/mockups'), { recursive: true });

let oversize = 0;
let warm = 0;

for (const item of DROP) {
  const srcPath = `${SRC_DIR}${item.src}`;
  if (!existsSync(srcPath)) {
    console.error(`MISSING  ${item.n}  ${item.src}`);
    continue;
  }

  const meta = await sharp(srcPath).metadata();
  let pipeline = sharp(srcPath);

  if (item.crop) {
    pipeline = pipeline.extract({
      left: Math.round(item.crop.left * meta.width),
      top: Math.round(item.crop.top * meta.height),
      width: Math.round(item.crop.width * meta.width),
      height: Math.round(item.crop.height * meta.height),
    });
  }

  // Remove any region of invented text at full resolution, before the frame is
  // scaled down, so the edit is applied to the pixels it is actually hiding.
  if (item.patch) {
    let base = await pipeline.toBuffer();
    for (const region of item.patch) {
      const bm = await sharp(base).metadata();
      const rect = {
        left: Math.round(region.left * bm.width),
        top: Math.round(region.top * bm.height),
        width: Math.round(region.width * bm.width),
        height: Math.round(region.height * bm.height),
      };
      const cover = region.fill
        ? await sharp({
            create: { ...rect, channels: 3, background: region.fill },
          })
            .png()
            .toBuffer()
        : await sharp(base).extract(rect).blur(region.sigma ?? 6).toBuffer();
      base = await sharp(base)
        .composite([{ input: cover, left: rect.left, top: rect.top }])
        .toBuffer();
    }
    pipeline = sharp(base);
  }

  // Never upscale: the ceiling is the source's own width after cropping.
  const cropped = await pipeline.toBuffer();
  const croppedMeta = await sharp(cropped).metadata();
  const ratio = RATIOS[item.ratio];
  const width = Math.min(item.width ?? DEFAULT_WIDTH, croppedMeta.width);
  const height = Math.round(width / ratio);

  let framed = await sharp(cropped)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .toBuffer();

  let note = '';
  if (item.grade !== undefined) {
    const graded = await coolTo(framed, item.grade);
    framed = graded.buffer;
    note = `b* ${graded.before.toFixed(2).padStart(6)} → ${graded.after.toFixed(2).padStart(6)}`;
    if (graded.after > item.grade + 0.75) {
      console.warn(`  ${item.out}: b* ${graded.after.toFixed(2)} still above target ${item.grade}`);
      warm += 1;
    }
  } else {
    note = `b* ${(await meanB(framed)).toFixed(2).padStart(6)} (ungraded)`;
  }

  const outPath = root(`src/assets/${item.out}`);
  await sharp(framed).webp({ quality: 82 }).toFile(outPath);

  const kb = (await stat(outPath)).size / 1024;
  if (kb > SIZE_CEILING_KB) {
    console.warn(`  ${item.out}: ${kb.toFixed(0)}KB is over the ${SIZE_CEILING_KB}KB ceiling`);
    oversize += 1;
  }
  console.log(
    `${item.n}  ${item.out.padEnd(44)} ${String(width).padStart(4)}x${String(height).padEnd(4)} ` +
      `${kb.toFixed(0).padStart(4)}KB  ${note}`,
  );
}

const total = (
  await Promise.all(
    ['editorial', 'mockups'].flatMap(async (dir) => {
      const files = await readdir(root(`src/assets/${dir}`));
      return Promise.all(files.map(async (f) => (await stat(root(`src/assets/${dir}/${f}`))).size));
    }),
  )
)
  .flat()
  .reduce((a, b) => a + b, 0);

console.log(`\n${DROP.length} assets written. editorial + mockups total ${(total / 1024 / 1024).toFixed(2)}MB.`);
if (oversize) console.log(`${oversize} over the size ceiling.`);
if (warm) console.log(`${warm} still warmer than target.`);
