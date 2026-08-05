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
  // Demo build, not a client. Captured the same way as the real sites because
  // it is a real deployed page — what makes it a demo is the case study saying
  // so, not the screenshot being softer.
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/', out: 'lavanya-desktop.webp', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/lavanya-skin-clinic/', out: 'lavanya-mobile.webp', width: 500, height: 900 },
];

await mkdir(root('src/assets/work'), { recursive: true });

for (const shot of SHOTS) {
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

    // A clipped capture is worse than none: it shows a client's site as broken
    // when it is not. The last column of a complete page is page background.
    const { data, info } = await sharp(raw)
      .extract({ left: (await sharp(raw).metadata()).width - 4, top: 0, width: 4, height: 200 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let sum = 0;
    for (let i = 0; i < data.length; i += info.channels) sum += data[i];
    const edge = sum / (data.length / info.channels);
    if (edge < 235) {
      console.warn(`  WARNING ${shot.out}: right edge is dark (${edge.toFixed(0)}), page may be clipped`);
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
