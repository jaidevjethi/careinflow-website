/**
 * Price guard.
 *
 * CLAUDE.md has always said prices come from `src/config/pricing.ts` and
 * nowhere else. Nothing enforced it, so a repricing commit left nine literal
 * figures behind: /services published ₹40,000 for the build /pricing published
 * at ₹28,999, and the two contradicted each other inside one JSON-LD graph.
 *
 * This script fails the build on:
 *   1. a literal rupee figure anywhere in src/ outside pricing.ts
 *   2. an unresolved {{token}} left in the built HTML
 *
 * Run: node scripts/check-prices.mjs        (after `astro build` for check 2)
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** fileURLToPath, not URL.pathname — the repo path contains a space. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Where prices are allowed to be literals. */
const PRICE_SOURCE = join('src', 'config', 'pricing.ts');

/**
 * Figures that are not CareInflow's prices and must stay as written: the
 * handset a patient holds, and the domain fee a client pays someone else.
 */
const ALLOWED = [/₹12,000\s+Android/, /₹1,000 a year/];

/**
 * Comments explain the figures, they do not publish them — and this file's own
 * header quotes the prices that caused the bug. Strip them before scanning.
 */
const stripComments = (text) =>
  text
    // Blank out comment bodies but keep every newline, so offsets and the
    // line numbers derived from them still point at the real source line.
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/^[ \t]*\/\/.*$/gm, (m) => ' '.repeat(m.length));

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const problems = [];

/* ---- 1. literal rupee figures in source ---------------------------------- */

const RUPEE = /₹[\d][\d,]{2,}/g;
const SOURCE_EXT = /\.(astro|ts|tsx|mdx|md|json)$/;

for (const file of walk(join(ROOT, 'src'))) {
  const rel = relative(ROOT, file);
  if (rel === PRICE_SOURCE || !SOURCE_EXT.test(rel)) continue;

  const raw = readFileSync(file, 'utf8');
  const text = /\.(ts|astro)$/.test(rel) ? stripComments(raw) : raw;
  for (const match of text.matchAll(RUPEE)) {
    const context = raw.slice(match.index, match.index + 60);
    if (ALLOWED.some((re) => re.test(context))) continue;
    const line = text.slice(0, match.index).split('\n').length;
    problems.push(
      `${rel.split(sep).join('/')}:${line}  literal ${match[0]} — use a {{token}} from src/lib/prices.ts`,
    );
  }
}

/* ---- 2. unresolved tokens in the build ----------------------------------- */

const dist = join(ROOT, 'dist');
if (existsSync(dist)) {
  for (const file of walk(dist)) {
    if (!file.endsWith('.html')) continue;
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\{\{\w+\}\}/g)) {
      problems.push(`${relative(ROOT, file).split(sep).join('/')}  unresolved ${match[0]}`);
    }
  }
}

/* ---- report -------------------------------------------------------------- */

if (problems.length) {
  console.error(`\n✗ ${problems.length} price problem${problems.length > 1 ? 's' : ''}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nEvery published figure must come from src/config/pricing.ts.\n');
  process.exit(1);
}

console.log('✓ prices: every figure traces to src/config/pricing.ts');
