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

// OG image 1200×630 — navy block on cool canvas, vivid teal rule, wordmark.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0A1628"/>
  <rect x="0" y="0" width="14" height="630" fill="#FFB020"/>
  <text x="96" y="120" font-family="Segoe UI, Arial, sans-serif" font-size="21" letter-spacing="4" fill="#FFB020">HEALTHCARE PRACTICES ONLY · MEHSANA, GUJARAT</text>
  ${markAt(96, 168 + (72 - (72 * markViewH) / 1000) / 2, 72, '#F7F4EE')}
  <text x="192" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="-2" fill="#F7F4EE">CareInflow</text>
  <text x="96" y="336" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" letter-spacing="-1" fill="#F7F4EE">Healthcare websites that patients</text>
  <text x="96" y="394" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" letter-spacing="-1" fill="#FFB020">find, trust and book.</text>
  <g font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600">
    <rect x="96" y="452" width="230" height="52" rx="10" fill="#14243E"/>
    <text x="120" y="485" fill="#B9C6D6">Website design</text>
    <rect x="342" y="452" width="176" height="52" rx="10" fill="#14243E"/>
    <text x="366" y="485" fill="#B9C6D6">Local SEO</text>
    <rect x="534" y="452" width="284" height="52" rx="10" fill="#14243E"/>
    <text x="558" y="485" fill="#B9C6D6">Google Business Profile</text>
  </g>
  <text x="96" y="570" font-family="Segoe UI, Arial, sans-serif" font-size="19" fill="#8797AA">careinflow.com — websites, local SEO and Google Business Profile for clinics in North Gujarat</text>
</svg>`;
await sharp(Buffer.from(ogSvg), { density: 150 }).png().toFile(pub('og-default.png'));
console.log('wrote og-default.png');
