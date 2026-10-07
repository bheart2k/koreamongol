// 캔버스 프레임 시퀀스 플레이어
// - manifest.json (scripts/design-lab/video2frames.mjs 출력)을 읽어 WebP 프레임을 거친→촘촘한 순서로 점진 로딩
// - 스크롤 진행도에 맞춰 cover-fit으로 그리고, 인접 프레임을 크로스페이드해 낮은 fps도 부드럽게 보이게 함

export async function loadManifest(base) {
  const res = await fetch(`${base}/manifest.json`);
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  return res.json();
}

function frameUrl(base, m, i) {
  const n = i + (m.startIndex ?? 1);
  const name = m.pattern.replace(/%0(\d+)d/, (_, w) => String(n).padStart(Number(w), '0'));
  return `${base}/${name}`;
}

// 거친 간격부터: 첫·끝 프레임 → 24 간격 → 12 → … → 전부
function loadOrder(count) {
  const seen = new Uint8Array(count);
  const out = [];
  const push = (i) => { if (i >= 0 && i < count && !seen[i]) { seen[i] = 1; out.push(i); } };
  push(0);
  push(count - 1);
  for (const step of [24, 12, 6, 3, 2, 1]) for (let i = 0; i < count; i += step) push(i);
  return out;
}

export class FrameSequence {
  constructor(canvas, base, manifest, { onFirstFrame, onComplete } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.base = base;
    this.m = manifest;
    this.count = manifest.count;
    this.frames = new Array(this.count).fill(null);
    this.loaded = 0;
    this.target = 0;
    this.current = 0;
    this.dirty = true;
    this.alive = true;
    this.onFirstFrame = onFirstFrame;
    this.onComplete = onComplete;
    this.resize();
  }

  get complete() {
    return this.loaded === this.count;
  }

  // 마지막(착지) 프레임이 준비됐는지 — 아직이면 호출 측이 정지 이미지로 대체
  get endReady() {
    return !!this.frames[this.count - 1];
  }

  async load(concurrency = 6) {
    const queue = loadOrder(this.count);
    let next = 0;
    const worker = async () => {
      while (this.alive && next < queue.length) {
        const i = queue[next++];
        const img = new Image();
        img.crossOrigin = 'anonymous'; // CDN 이미지를 캔버스에 그리므로 CORS 모드로 요청
        img.decoding = 'async';
        img.src = frameUrl(this.base, this.m, i);
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (!this.alive) return;
        this.frames[i] = img;
        this.loaded += 1;
        this.dirty = true;
        if (this.loaded === 1) this.onFirstFrame?.();
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    if (this.alive && this.complete) this.onComplete?.();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.imageSmoothingQuality = 'high';
    this.dirty = true;
  }

  // progress 0..1
  seek(progress) {
    const t = Math.min(1, Math.max(0, progress)) * (this.count - 1);
    if (t !== this.target) {
      this.target = t;
      this.dirty = true;
    }
  }

  nearest(i) {
    if (this.frames[i]) return i;
    for (let d = 1; d < this.count; d++) {
      if (this.frames[i - d]) return i - d;
      if (this.frames[i + d]) return i + d;
    }
    return -1;
  }

  drawCover(img, alpha) {
    const { width: cw, height: ch } = this.canvas;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  }

  // 매 rAF 호출. 실제로 그렸으면 true
  render() {
    const diff = this.target - this.current;
    if (Math.abs(diff) > 0.002) {
      this.current += diff * 0.22;
      this.dirty = true;
    } else if (this.current !== this.target) {
      this.current = this.target;
      this.dirty = true;
    }
    if (!this.dirty) return false;
    const a = Math.floor(this.current);
    const f = this.current - a;
    const ia = this.nearest(a);
    if (ia < 0) return false;
    this.dirty = false;
    this.drawCover(this.frames[ia], 1);
    if (ia === a && f > 0.02 && this.frames[a + 1]) this.drawCover(this.frames[a + 1], f);
    return true;
  }

  destroy() {
    this.alive = false;
    this.frames = [];
  }
}
