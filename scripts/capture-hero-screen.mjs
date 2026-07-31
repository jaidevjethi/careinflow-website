/**
 * Capture the frame that goes on the phone in the homepage hero.
 *
 * Deliberately the live client site rather than a render: the homepage tells
 * visitors to open our work on their own phone, so the hero has to show the
 * thing they would actually see.
 *
 * The window is 500x1045 because Chrome on Windows will not open a window
 * narrower than about 500px (see capture-work-shots.mjs) and because 500:1045
 * is the aspect of the handset's screen in the plate photograph. Matching it
 * here means the perspective warp does not have to stretch the page.
 *
 * Run: node scripts/capture-hero-screen.mjs
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const URL_ = 'https://pramukhdentalclinic.com/';
const W = 500;
const H = 1045;

const profile = join(tmpdir(), 'ci-hero-screen-profile');
const outDir = join(tmpdir(), 'ci-hero-screen-out');
await mkdir(outDir, { recursive: true });
await mkdir(root('scripts/assets'), { recursive: true });
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
      `--window-size=${W},${H}`,
      '--virtual-time-budget=9000',
      `--screenshot=${raw}`,
      URL_,
    ],
    { timeout: 90_000 },
  );

  await sharp(raw).resize({ width: W }).png().toFile(root('scripts/assets/hero-screen.png'));
  console.log(`captured scripts/assets/hero-screen.png (${W}x${H})`);
  console.log('next: python scripts/composite-hero-screen.py');
} finally {
  await rm(profile, { recursive: true, force: true });
  await rm(outDir, { recursive: true, force: true });
}
