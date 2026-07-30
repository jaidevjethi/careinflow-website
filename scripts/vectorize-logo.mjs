/**
 * Trace the CareInflow logo PNG into an exact SVG vector.
 * 1. Auto-crop the mark (ignoring the page rule at the top of the source).
 * 2. Threshold to pure black/white.
 * 3. Potrace → SVG path, normalized to fill="currentColor".
 * Outputs: src/assets/careinflow-mark.svg + docs/brand/careinflow-mark-cropped.png
 */
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const SRC = root('docs/brand/careinflow-logo-original.png');

// --- 1. Find the mark's bounding box (dark pixels, skipping the top rule) ---
const img = sharp(SRC).greyscale();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const SKIP_TOP = Math.round(height * 0.15);

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = SKIP_TOP; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[y * width + x] < 100) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.03);
const box = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(width, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(height, maxY + pad) - Math.max(0, minY - pad),
};
console.log('mark bbox:', box);

// --- 2. Crop + threshold to clean black on white ---
const cropped = await sharp(SRC)
  .extract(box)
  .flatten({ background: '#ffffff' })
  .greyscale()
  .threshold(150)
  .png()
  .toBuffer();
await mkdir(root('docs/brand'), { recursive: true });
await writeFile(root('docs/brand/careinflow-mark-cropped.png'), cropped);

// --- 3. Trace ---
// Trace at the source resolution. Downscaling first closes the thin white
// counters where the strokes nearly meet, which silently fills the lobes.
const svg = await new Promise((resolve, reject) => {
  potrace.trace(
    cropped,
    {
      threshold: 150,
      turdSize: 20,
      optTolerance: 1.2,
      alphaMax: 1,
    },
    (err, out) => (err ? reject(err) : resolve(out)),
  );
});

const srcW = Number(svg.match(/width="(\d+(?:\.\d+)?)"/)?.[1]);
const srcH = Number(svg.match(/height="(\d+(?:\.\d+)?)"/)?.[1]);

// Normalize to a 1000-unit box and round coordinates: at any size the mark is
// ever displayed (26px header … 512px icon) this is sub-pixel accurate, and it
// cuts the path payload by roughly two thirds.
const scale = 1000 / srcW;
const viewH = Math.round(srcH * scale);
const round = (n) => {
  const v = Math.round(Number(n) * scale * 10) / 10;
  return String(v === Math.trunc(v) ? Math.trunc(v) : v);
};

const paths = [...svg.matchAll(/ d="([^"]+)"/g)].map(
  (m) => m[1].replace(/-?\d+(?:\.\d+)?/g, round).replace(/\s+/g, ' ').trim(),
);

// fill-rule must stay evenodd: potrace winds every subpath the same way and
// relies on it for the counters inside the two lobes.
const body = paths.map((d) => `<path fill-rule="evenodd" d="${d}"/>`).join('');
const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${viewH}"`;

// Source of truth (inherits colour), plus the two flat variants that ship in
// public/ so the browser fetches and caches the mark once for the whole site.
const variants = [
  ['src/assets/careinflow-mark.svg', `${head} fill="currentColor" aria-hidden="true">${body}</svg>`],
  ['public/logo.svg', `${head} fill="#0A1622">${body}</svg>`],
  ['public/logo-light.svg', `${head} fill="#F5F8FA">${body}</svg>`],
];
for (const [file, svgOut] of variants) {
  await writeFile(root(file), svgOut);
  console.log(`wrote ${file} — ${svgOut.length} bytes`);
}

// Favicon: the mark reversed out of an ink tile — at 16px a filled tile holds
// far more contrast against a browser chrome than the bare mark does.
const TILE = 64;
const markW = 42;
const scale2 = markW / 1000;
const tx = (TILE - markW) / 2;
const ty = (TILE - viewH * scale2) / 2;
const favicon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE} ${TILE}">` +
  `<rect width="${TILE}" height="${TILE}" rx="14" fill="#0A1622"/>` +
  `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale2.toFixed(5)})" fill="#F5F8FA">${body}</g>` +
  `</svg>`;
await writeFile(root('public/favicon.svg'), favicon);
console.log(`wrote public/favicon.svg — ${favicon.length} bytes`);

console.log(`viewBox 0 0 1000 ${viewH}, ${paths.length} path(s)`);
