// 캔버스 프레임 시퀀스 — manifest.json(video2frames 출력)을 읽어 WebP 프레임을 점진 로딩하고
// 진행도(0~1)에 맞는 프레임을 그린다. 아직 안 받은 프레임은 가장 가까운 로드된 프레임으로 대체.

function frameUrl(base, m, i) {
  const n = i + (m.startIndex ?? 1);
  return `${base}/${m.pattern.replace(/%0(\d+)d/, (_, w) => String(n).padStart(Number(w), '0'))}`;
}

// 첫·끝 → 거친 간격 → 촘촘한 간격 순서 (어느 시점에 스크롤해도 대략적인 프레임이 있게)
function loadOrder(count) {
  const seen = new Uint8Array(count);
  const out = [];
  const push = (i) => {
    if (i >= 0 && i < count && !seen[i]) { seen[i] = 1; out.push(i); }
  };
  push(0);
  push(count - 1);
  for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) push(i);
  return out;
}

export async function createSequence(base, canvas) {
  const res = await fetch(`${base}/manifest.json`);
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  const m = await res.json();
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = m.width;
  canvas.height = m.height;

  const frames = new Array(m.count).fill(null);
  let alive = true;
  let drawn = -1;
  let want = 0;
  let loaded = 0;
  const listeners = new Set();

  const nearest = (i) => {
    if (frames[i]) return i;
    for (let d = 1; d < m.count; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  };

  const draw = (progress) => {
    want = Math.round(Math.min(1, Math.max(0, progress)) * (m.count - 1));
    const i = nearest(want);
    if (i < 0 || i === drawn) return i >= 0;
    ctx.drawImage(frames[i], 0, 0, m.width, m.height);
    drawn = i;
    return true;
  };

  const load = async (concurrency = 4) => {
    const queue = loadOrder(m.count);
    let next = 0;
    const worker = async () => {
      while (alive && next < queue.length) {
        const i = queue[next++];
        const img = new Image();
        img.crossOrigin = 'anonymous'; // CDN 이미지를 캔버스에 그리므로 CORS 모드로 받는다
        img.decoding = 'async';
        img.src = frameUrl(base, m, i);
        try {
          await img.decode();
          if (!alive) return;
          frames[i] = img;
          loaded++;
          // 지금 보여줘야 할 프레임 근처가 새로 들어왔으면 다시 그린다
          if (Math.abs(i - want) < Math.abs(drawn - want) || drawn < 0) {
            drawn = -1;
            draw(want / (m.count - 1));
          }
          listeners.forEach((fn) => fn(loaded, m.count));
        } catch {
          /* 프레임 하나 실패는 무시 — nearest 로 대체 */
        }
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  };

  return {
    manifest: m,
    draw,
    load,
    get ready() { return frames[0] != null; },
    get complete() { return loaded === m.count; },
    onProgress(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    destroy() { alive = false; listeners.clear(); },
  };
}

// 데이터 절약·느린 망이면 시퀀스 대신 정지 이미지 전환
export function prefersLightAssets() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType || '') || c.effectiveType === '3g';
}
