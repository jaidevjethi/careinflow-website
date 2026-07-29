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

const SHOTS = [
  { url: 'https://pramukhdentalclinic.com/', out: 'pramukh-dental-mobile.png', width: 430, height: 900 },
  { url: 'https://pramukhdentalclinic.com/treatments.html', out: 'pramukh-dental-desktop.png', width: 1440, height: 900 },
  { url: 'https://jaidevjethi.github.io/divyam-website/', out: 'divyam-desktop.png', width: 1440, height: 900 },
];

await mkdir(root('src/assets/work'), { recursive: true });

for (const shot of SHOTS) {
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
      .png({ compressionLevel: 9 })
      .toFile(root(`src/assets/work/${shot.out}`));
    console.log('captured', shot.out);
  } catch (err) {
    console.error('FAILED', shot.out, err.message.slice(0, 160));
  } finally {
    await rm(profile, { recursive: true, force: true });
    await rm(outDir, { recursive: true, force: true });
  }
}

console.log('files:', await readdir(root('src/assets/work')));
