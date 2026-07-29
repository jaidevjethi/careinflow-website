/**
 * One-off generator for raster brand assets (favicons, touch icons, OG image).
 * Run `node scripts/vectorize-logo.mjs` first if the logo artwork changed —
 * this script consumes the vector it produces.
 * Run: node scripts/generate-assets.mjs — outputs are committed to public/.
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pub = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

const faviconSvg = await readFile(pub('favicon.svg'));

// Reuse the traced logo path so the OG image can never drift from the mark.
const markSvg = await readFile(pub('logo.svg'), 'utf8');
const markPath = markSvg.match(/ d="([^"]+)"/)?.[1] ?? '';
const markViewH = Number(markSvg.match(/viewBox="0 0 1000 (\d+)"/)?.[1] ?? 923);
const markAt = (x, y, width, fill) => {
  const s = width / 1000;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" fill-rule="evenodd"><path d="${markPath}"/></g>`;
};

// PNG icons from the favicon mark.
for (const [size, name] of [
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  await sharp(faviconSvg, { density: 300 }).resize(size, size).png().toFile(pub(name));
  console.log('wrote', name);
}

// favicon.ico (32px PNG payload — valid for modern browsers).
const png32 = await sharp(faviconSvg, { density: 300 }).resize(32, 32).png().toBuffer();
// Minimal ICO wrapper around a single PNG entry.
const ico = Buffer.concat([
  Buffer.from([0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0]),
  (() => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(png32.length, 0);
    b.writeUInt32LE(22, 4);
    return b;
  })(),
  png32,
]);
await writeFile(pub('favicon.ico'), ico);
console.log('wrote favicon.ico');

// OG image 1200×630 — canvas, tick rule, wordmark, tagline, chips.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F7F6F3"/>
  <g>
    ${Array.from({ length: 19 }, (_, i) => `<rect x="${96 + i * 11}" y="96" width="1.5" height="7" fill="#D5D9DE"/>`).join('')}
  </g>
  <text x="96" y="146" font-family="Segoe UI, Arial, sans-serif" font-size="21" letter-spacing="4" fill="#0B5D4E">HEALTHCARE PRACTICES ONLY · MEHSANA, GUJARAT</text>
  ${markAt(96, 196 + (72 - (72 * markViewH) / 1000) / 2, 72, '#101613')}
  <text x="192" y="248" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="-2" fill="#101613">CareInflow</text>
  <text x="96" y="360" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="-1" fill="#101613">We design the three screens that decide</text>
  <text x="96" y="416" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="-1" fill="#101613">whether a patient chooses you.</text>
  <g font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#3A4441">
    <rect x="96" y="486" width="204" height="52" rx="26" fill="#FFFFFF" stroke="#E4E1DA"/>
    <text x="120" y="519">Google listing</text>
    <rect x="316" y="486" width="150" height="52" rx="26" fill="#FFFFFF" stroke="#E4E1DA"/>
    <text x="340" y="519">Website</text>
    <rect x="482" y="486" width="160" height="52" rx="26" fill="#FFFFFF" stroke="#E4E1DA"/>
    <text x="506" y="519">AI answer</text>
  </g>
  <text x="96" y="586" font-family="Segoe UI, Arial, sans-serif" font-size="19" fill="#61645C">careinflow.com — websites, local SEO and Google Business Profile for healthcare practices</text>
</svg>`;
await sharp(Buffer.from(ogSvg), { density: 150 }).png().toFile(pub('og-default.png'));
console.log('wrote og-default.png');
