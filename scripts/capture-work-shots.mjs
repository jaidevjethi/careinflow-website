/**
 * Capture real screenshots of the live client sites for the work pages, using
 * headless Chrome directly (no extra browser download).
 * Run: node scripts/capture-work-shots.mjs
 * Outputs committed PNGs in src/assets/work/.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/**
 * Chrome on Windows will not open a window narrower than roughly 500px. Ask for
 * 430 and you still get a 500px layout, cropped back to 430 for the screenshot,
 * so the right edge of every phone capture is sliced off. Capture at the real
 * minimum instead: still a phone layout, and nothing is lost.
 */
const MIN_WINDOW_WIDTH = 500;

const SHOTS = [
  { url: 'https://pramukhdentalclinic.com/', out: 'pramukh-dental-mobile.webp', width: 500, height: 900 },
  { url: 'https://pramukhdentalclinic.com/treatments.html', out: 'pramukh-dental-desktop.webp', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/divyam-website/', out: 'divyam-desktop.webp', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/divyam-website/taxi-services/', out: 'divyam-service.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/divyam-website/fleet/', out: 'divyam-fleet.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/divyam-website/taxi-services/', out: 'divyam-service-mobile.webp', width: 500, height: 1000 },
  // Demo build, not a client. Captured the same way as the real sites because
  // it is a real deployed page — what makes it a demo is the case study saying
  // so, not the screenshot being softer.
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/', out: 'lavanya-desktop.webp', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/', out: 'lavanya-mobile.webp', width: 500, height: 900 },
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/treatments', out: 'lavanya-treatments.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/treatments', out: 'lavanya-treatments-mobile.webp', width: 500, height: 1000 },
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/contact', out: 'lavanya-contact.webp', width: 1440, height: 1000 },
  // The physiotherapy demo. Same treatment as Lavanya above: a real deployed
  // site, captured like one. Six shots rather than five because what this
  // sample demonstrates is an information architecture — the conditions index
  // and a single condition page have to be seen together for the structure to
  // read at all.
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/', out: 'gati-desktop.webp', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/', out: 'gati-mobile.webp', width: 500, height: 900 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/conditions', out: 'gati-conditions.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/conditions/tech-neck', out: 'gati-condition.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/treatments/sports-injury-rehab', out: 'gati-treatment.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/clinic', out: 'gati-clinic.webp', width: 1440, height: 1000 },
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/faq', out: 'gati-faq.webp', width: 1440, height: 1000 },
  /*
   * 800 tall, not 1000, and the reason is the gallery's crop rather than the
   * page. A phone shot renders in a 260px column and is capped at
   * `max-h-[420px] object-cover object-top`, so a 500x1000 capture displays at
   * 260x520 and loses its bottom 100px — which is precisely where a fixed
   * enquiry bar lives, and precisely what this shot exists to show. At 500x800
   * it displays at 260x416, under the cap, uncropped, bar intact.
   */
  { url: 'https://jaidevjethi.github.io/stride-physio-demo/', out: 'gati-home-mobile.webp', width: 500, height: 800 },
];

/** Capture only these outputs when names are passed on the command line. */
const only = new Set(process.argv.slice(2));
const shots = only.size ? SHOTS.filter((s) => only.has(s.out)) : SHOTS;

await mkdir(root('src/assets/work'), { recursive: true });

for (const shot of shots) {
  if (shot.width < MIN_WINDOW_WIDTH) {
    throw new Error(
      `${shot.out}: width ${shot.width} is below Chrome's ${MIN_WINDOW_WIDTH}px floor and would capture a clipped page.`,
    );
  }
  const profile = join(tmpdir(), `ci-shot-${shot.out}`);
  const outDir = join(tmpdir(), `ci-out-${shot.out}`);
  await mkdir(outDir, { recursive: true });
  const raw = join(outDir, 'shot.png');

  try {
    await run(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=2',
        `--user-data-dir=${profile}`,
        `--window-size=${shot.width},${shot.height}`,
        '--virtual-time-budget=8000',
        `--screenshot=${raw}`,
        shot.url,
      ],
      { timeout: 90_000 },
    );

    // Downscale the 2x capture to 1x for a crisp, right-sized asset.
    await sharp(raw)
      .resize({ width: shot.width })
      .webp({ quality: 82 })
      .toFile(root(`src/assets/work/${shot.out}`));

    /*
     * Assert the capture is the size we asked for.
     *
     * This slot held two different guesses at "does the right edge look
     * clipped", and both cried wolf. The first tested brightness, so every
     * site with a dark hero tripped it. The second tested variance, so every
     * site with a photographic hero tripped it instead — five false warnings
     * on five captures I had already checked by eye. A warning that fires on
     * good output is worse than no warning, because you learn to scroll past
     * it.
     *
     * The failure it was guarding against is Chrome laying the page out wider
     * than the window and cropping the difference, and that is already blocked
     * outright by the MIN_WINDOW_WIDTH throw above. What is left worth testing
     * is deterministic: the file is either the requested size or it is not.
     */
    const outMeta = await sharp(root(`src/assets/work/${shot.out}`)).metadata();
    if (outMeta.width !== shot.width || outMeta.height !== shot.height) {
      console.warn(
        `  WARNING ${shot.out}: got ${outMeta.width}x${outMeta.height}, asked for ${shot.width}x${shot.height}`,
      );
    }
    console.log('captured', shot.out);
  } catch (err) {
    console.error('FAILED', shot.out, err.message.slice(0, 160));
  } finally {
    await rm(profile, { recursive: true, force: true });
    await rm(outDir, { recursive: true, force: true });
  }
}

console.log('files:', await readdir(root('src/assets/work')));
