/**
 * Save invoices as PDFs without opening a browser.
 *
 *   npm run invoice:pdf -- ci-2026-014            one invoice, by its file name
 *   npm run invoice:pdf -- ci-2026-014 ci-2026-015
 *   npm run invoice:pdf -- --all                  every invoice in invoices/
 *
 * Writes invoices/pdf/<invoice number>.pdf, which is gitignored with the rest
 * of the folder.
 *
 * It starts the Astro dev server itself (the invoice route exists only there)
 * and prints each page in headless Chrome over the DevTools protocol: the same
 * engine as the browser's own "Save as PDF", reading the A4 size and margins
 * from the invoice's CSS. No extra package: the protocol is spoken over
 * Node's built-in WebSocket.
 *
 * Chrome is looked for at CHROME_PATH, then where Chrome and Edge install on
 * Windows, macOS and Linux. Edge works too; it is the same engine.
 */

import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dev } from 'astro';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'invoices', 'pdf');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run invoice:pdf -- <invoice-id> [...]   or   npm run invoice:pdf -- --all');
  process.exit(1);
}

/* ---- find a browser ------------------------------------------------------ */

const which = (name) => {
  try {
    return execFileSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8' })
      .split(/\r?\n/)[0]
      .trim();
  } catch {
    return '';
  }
};

const local = process.env.LOCALAPPDATA ?? '';
const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  local && join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  which('google-chrome'),
  which('chromium'),
  which('chromium-browser'),
].filter(Boolean);

const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH to the browser executable and run this again.');
  process.exit(1);
}

/* ---- a minimal DevTools protocol client ----------------------------------- */

function connect(url) {
  const ws = new WebSocket(url);
  let next = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else {
      for (const listener of listeners) listener(msg);
    }
  };
  return {
    ready: new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = () => reject(new Error(`Could not connect to Chrome at ${url}`));
    }),
    send(method, params = {}, sessionId) {
      const id = ++next;
      ws.send(JSON.stringify({ id, method, params, sessionId }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    once(method, sessionId) {
      return new Promise((resolve) => {
        const listener = (msg) => {
          if (msg.method === method && msg.sessionId === sessionId) {
            listeners.delete(listener);
            resolve(msg.params);
          }
        };
        listeners.add(listener);
      });
    },
    close: () => ws.close(),
  };
}

function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), 'careinflow-invoice-'));
  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      // Wide enough that the sheet is laid out at its full A4 width, which the
      // one-page fit check measures against.
      '--window-size=1280,1000',
      '--no-first-run',
      '--no-default-browser-check',
      // Chrome refuses to run as root with its sandbox on, which is how it
      // runs in a container. Never needed on a studio machine.
      ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const endpoint = new Promise((resolve, reject) => {
    let log = '';
    child.stderr.on('data', (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) resolve(match[1]);
    });
    child.on('exit', () => reject(new Error(`Chrome exited before it was ready.\n${log}`)));
  });
  // Awaited later, once the dev server is up; until then a failure waits too.
  endpoint.catch(() => {});
  const stop = () => {
    child.kill();
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      // Chrome on Windows can hold the profile for a moment after exit.
    }
  };
  return { endpoint, stop };
}

/* ---- run ------------------------------------------------------------------- */

const server = await dev({ root: ROOT, logLevel: 'warn', devToolbar: { enabled: false } });
const origin = `http://localhost:${server.address.port}`;
const browser = launchChrome();
let failed = 0;

try {
  let ids = args.filter((a) => a !== '--all');
  if (args.includes('--all')) {
    const index = await (await fetch(`${origin}/invoices/`)).text();
    ids = [...new Set([...index.matchAll(/href="\/invoices\/([^/"]+)\/"/g)].map((m) => m[1]))];
  }

  const client = connect(await browser.endpoint);
  await client.ready;
  mkdirSync(OUT, { recursive: true });

  for (const id of ids.map((i) => i.toLowerCase().replace(/\.ya?ml$/, ''))) {
    const url = `${origin}/invoices/${id}/`;
    // Check the page first, so a mistake in an invoice file is reported in
    // words rather than printed as Astro's error page.
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      const reason =
        response.status === 404
          ? `no invoice file called "${id}" in invoices/ (use the file name, without .yaml)`
          : (text.match(/Invoice [^<"]+?: [^<"]+/)?.[0] ?? `HTTP ${response.status}`);
      console.error(`✗ ${id}: ${reason}`);
      failed++;
      continue;
    }

    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });
    await client.send('Page.enable', {}, sessionId);
    const loaded = client.once('Page.loadEventFired', sessionId);
    await client.send('Page.navigate', { url }, sessionId);
    await loaded;

    // Fonts settled and the one-page fit applied, then two frames for layout.
    const { result } = await client.send(
      'Runtime.evaluate',
      {
        expression: `document.fonts.ready
          .then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
          .then(() => document.querySelector('[data-number]')?.dataset.number ?? '')`,
        awaitPromise: true,
        returnByValue: true,
      },
      sessionId,
    );
    const number = String(result.value || id).replace(/[^\w.-]+/g, '-');

    const { data } = await client.send(
      'Page.printToPDF',
      { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false },
      sessionId,
    );
    const file = join(OUT, `${number}.pdf`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    console.log(`✓ ${id} → invoices/pdf/${number}.pdf`);
    await client.send('Target.closeTarget', { targetId });
  }

  if (ids.length === 0) console.error('No invoices found.');
  client.close();
} finally {
  browser.stop();
  await server.stop();
}

process.exit(failed ? 1 : 0);
