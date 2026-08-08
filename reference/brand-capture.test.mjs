// One runnable check for brand-capture.js. No test framework, no dependencies:
// node's built-in WebSocket drives headless Chrome over CDP.
//
//   node reference/brand-capture.test.mjs
//
// The fixture paints its brand colour and its type stack from JS AFTER load, the
// way a CSS-in-JS or runtime-theme site does. A curl of the served HTML shows
// none of it, which is exactly the gap this capture closes, so the assertions
// check that the runtime values come back, not the served ones.

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const CHROME = process.env.CHROME_PATH || 'google-chrome';
const SERVED_DECOY = '#00FF00'; // present in the served HTML, must NOT win
const RUNTIME_ACCENT = '#C9243F'; // painted only by JS, must win

const fixture = `<!doctype html><html><head><title>Fixture Brand</title>
<meta property="og:site_name" content="Fixture Brand">
<style>body{margin:0;font-family:serif}.decoy{color:${SERVED_DECOY};display:none}</style>
</head><body>
<header><img src="/logo.svg" alt="Fixture Brand logo" width="120" height="32"></header>
<h1>Fixture Brand</h1><p>Body copy that exists so the ink colour scores.</p>
<button id="cta">Start now</button>
<article id="card">A card with a border and rounding.</article>
<span class="decoy">decoy</span>
<script>
  // runtime theme: nothing below appears in the served markup
  const s = document.createElement('style');
  s.textContent = \`
    body{background:#FFFFFF;color:#141414;font-family:Georgia,serif}
    h1{font-family:"Playfair Display",Georgia,serif;font-size:56px}
    #cta{background:${RUNTIME_ACCENT};color:#fff;border:0;border-radius:10px;
         padding:14px 28px;font-size:16px;transition:transform 220ms ease-out}
    #card{border:1px solid #E4E4E4;border-radius:10px;padding:24px;width:420px;
          box-shadow:0 4px 12px rgba(0,0,0,.06)}\`;
  document.head.appendChild(s);
</script></body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'brandcap-'));
const page = join(dir, 'index.html');
writeFileSync(page, fixture);

const capture = readFileSync(new URL('./brand-capture.js', import.meta.url), 'utf8')
  .replace(/\nif \(typeof module[\s\S]*$/, '');

const port = 9223 + (process.pid % 500);
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=1440,900',
  `--user-data-dir=${join(dir, 'profile')}`,
  `file://${page}`,
]);
chrome.on('error', (e) => {
  console.error(`cannot start ${CHROME}: ${e.message}`);
  process.exit(1);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const t = list.find((x) => x.type === 'page' && x.webSocketDebuggerUrl);
      if (t) return t.webSocketDebuggerUrl;
    } catch {
      /* chrome not up yet */
    }
    await wait(250);
  }
  throw new Error('chrome never exposed a page target');
}

function cdp(url) {
  const ws = new WebSocket(url);
  const pending = new Map();
  let id = 0;
  const ready = new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result);
  };
  return {
    ready,
    send: (method, params = {}) =>
      new Promise((res, rej) => {
        id += 1;
        pending.set(id, { res, rej });
        ws.send(JSON.stringify({ id, method, params }));
      }),
    close: () => ws.close(),
  };
}

let failed = false;
try {
  const client = cdp(await targetWs());
  await client.ready;
  await wait(600); // let the runtime <style> apply
  const { result, exceptionDetails } = await client.send('Runtime.evaluate', {
    expression: `JSON.stringify((${capture})())`,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
  const data = JSON.parse(result.value);

  // the whole point: the runtime accent is captured, the served decoy is not
  assert.equal(data.roles.accent, RUNTIME_ACCENT, `accent should be the runtime colour, got ${data.roles.accent}`);
  assert.ok(
    !data.palette.some((p) => p.hex === SERVED_DECOY),
    'a display:none colour in the served CSS must never reach the palette',
  );
  // roles resolve off the rendered canvas, not off defaults
  assert.equal(data.roles.background, '#FFFFFF');
  assert.equal(data.roles.foreground, '#141414');
  // typography comes from the runtime stack, not the served `font-family: serif`
  const display = data.typography.specs.find((s) => s.role === 'display');
  assert.equal(display.family, 'Playfair Display', `display family, got ${display.family}`);
  assert.equal(display.size, '56px');
  // components and posture are read, not invented
  assert.equal(data.components.button.background, 'rgb(201, 36, 63)');
  assert.equal(data.posture.corners, 'rounded');
  assert.equal(data.posture.elevation, 'shadowed');
  assert.equal(data.posture.radius, '10px');
  // motion vocabulary and brand mark
  assert.ok(data.motion.durations.some((d) => d.value.includes('0.22s')), 'the 220ms transition should rank');
  assert.ok(data.logos.marks.some((m) => m.matchesBrandName), 'the header logo should match the brand name');
  assert.ok(data.elementsRead > 0);

  console.log(`ok — ${data.elementsRead} elements, accent ${data.roles.accent}, display ${display.family}`);
} catch (err) {
  failed = true;
  console.error('FAIL', err);
} finally {
  chrome.kill();
}
process.exit(failed ? 1 : 0);
