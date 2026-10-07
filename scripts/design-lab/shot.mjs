// headless Chrome(별도 프로필) + CDP 로 페이지 검증: 스크롤 지점별 스크린샷 · 콘솔 에러 · 전체 높이 · 전송 바이트
// usage: node scripts/design-lab/shot.mjs <plan.json>  (사용자 Chrome 과 무관한 별도 프로필로 실행)
// plan: { url, out, width, height, dpr, mobile, theme, reduced, noCache, settle, port,
//         steps: [{ y | yVh | sel(+offset), wait, name, eval, mouse: {x,y}|{sel}, measure, after, afterWait }] }
// 출력: <out>/<name>.jpg + report.json (pageHeight · viewports · errors · bytesKB · totalKB · art)
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const port = plan.port || 9333;
const profile = join(process.env.TEMP || '/tmp', `lab-shot-${port}`);
rmSync(profile, { recursive: true, force: true });
mkdirSync(plan.out, { recursive: true });

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--mute-audio',
  `--window-size=${plan.width},${plan.height}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const page = list.find((t) => t.type === 'page');
    if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break; }
  } catch { /* not ready */ }
  await sleep(200);
}
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

let id = 0;
const pending = new Map();
const errors = [];
const bytes = {};
const reqType = new Map();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Runtime.exceptionThrown') errors.push(`EXC ${msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text}`);
  if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) {
    errors.push(`${msg.params.type} ${msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300)}`);
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(`LOG ${msg.params.entry.text} ${msg.params.entry.url || ''}`);
  if (msg.method === 'Network.responseReceived') reqType.set(msg.params.requestId, { url: msg.params.response.url, type: msg.params.type });
  if (msg.method === 'Network.loadingFinished') {
    const r = reqType.get(msg.params.requestId);
    if (r) { (bytes[r.url] ??= { type: r.type, n: 0 }).n += msg.params.encodedDataLength; }
  }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');
await send('Page.enable');
if (plan.noCache) await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setDeviceMetricsOverride', {
  width: plan.width, height: plan.height, deviceScaleFactor: plan.dpr || 1, mobile: Boolean(plan.mobile),
});
if (plan.mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
if (plan.reduced) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `try { localStorage.setItem('theme', ${JSON.stringify(plan.theme || 'light')}); } catch (e) {}`,
});

await send('Page.navigate', { url: plan.url });
await new Promise((r) => {
  const h = (ev) => { const m = JSON.parse(ev.data); if (m.method === 'Page.loadEventFired') { ws.removeEventListener('message', h); r(); } };
  ws.addEventListener('message', h);
});
await sleep(plan.settle ?? 2500);

const report = { url: plan.url, viewport: `${plan.width}x${plan.height}`, shots: [] };
for (const [i, step] of (plan.steps || []).entries()) {
  if (step.eval) await evaluate(step.eval);
  if (step.sel) await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(step.sel)}); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - ${step.offset ?? 64}); })()`);
  else if (step.yVh != null) await evaluate(`window.scrollTo(0, innerHeight * ${step.yVh})`);
  else if (step.y != null) await evaluate(`window.scrollTo(0, ${step.y})`);
  await sleep(step.wait ?? 1400);
  if (step.mouse) {
    const pt = step.mouse.sel
      ? await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(step.mouse.sel)})?.getBoundingClientRect(); return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; })()`)
      : step.mouse;
    if (pt) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y, pointerType: 'mouse' });
  }
  if (step.measure) (report.measures ??= {})[step.name] = await evaluate(step.measure);
  if (step.after) await evaluate(step.after);
  if (step.afterWait) await sleep(step.afterWait);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  const file = join(plan.out, `${step.name || String(i + 1).padStart(2, '0')}.jpg`);
  writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  report.shots.push({ file, scrollY: await evaluate('Math.round(scrollY)') });
}

report.pageHeight = await evaluate('document.documentElement.scrollHeight');
report.viewports = +(report.pageHeight / plan.height).toFixed(2);
report.errors = errors;
const byType = {};
let total = 0;
for (const [url, v] of Object.entries(bytes)) {
  const k = url.includes('/design-lab/') && /\.(webp|png|jpg|mp4)$/.test(url) ? 'art' : v.type;
  byType[k] = (byType[k] || 0) + v.n;
  total += v.n;
}
report.bytesKB = Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)]));
report.totalKB = Math.round(total / 1024);
// design-lab 에셋(cdn.koreamongol.com/design-lab/v1/…)별 전송량
report.art = Object.entries(bytes)
  .filter(([u]) => /\/design-lab\/.+\.(webp|png|jpg|mp4|json)$/.test(u))
  .map(([u, v]) => `${u.split('/design-lab/').pop()} ${Math.round(v.n / 1024)}KB`);
writeFileSync(join(plan.out, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

ws.close();
chrome.kill();
