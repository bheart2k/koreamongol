// 히어로 탈것 움직임 계산 — 경로(상자 기준 %)를 따라 시각별 위치·폭·투명도를 낸다.
// 거리는 16:9 상자 비율(x%×16, y%×9)로 재서 화면 크기와 무관하게 같은 속도로 움직인다.

const EASE = {
  linear: (u) => u,
  in: (u) => u * u,
  out: (u) => 1 - (1 - u) * (1 - u),
  inOut: (u) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)),
};

const XFADE = 0.24; // 자세 전환 크로스페이드(초)

function buildPath(points) {
  const lens = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i][0] - points[i - 1][0]) * 16;
    const dy = (points[i][1] - points[i - 1][1]) * 9;
    lens.push(lens[i - 1] + Math.hypot(dx, dy));
  }
  return { points, lens, total: lens[lens.length - 1] };
}

function pointAt(path, u) {
  const { points, lens, total } = path;
  if (!total) return points[0];
  const d = u * total;
  let i = 1;
  while (i < lens.length - 1 && lens[i] < d) i++;
  const k = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
  const a = points[i - 1];
  const b = points[i];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}

// 경로 진행 방향(화면 각도, 시계 방향 +) — 앞뒤 조금씩 떨어진 두 점으로 재서 꺾임 없이 부드럽게
function tangentAt(path, e) {
  const d = 0.006;
  const a = pointAt(path, Math.max(0, e - d));
  const b = pointAt(path, Math.min(1, e + d));
  return (Math.atan2((b[1] - a[1]) * 9, (b[0] - a[0]) * 16) * 180) / Math.PI;
}

// headings: 자세 그림별 머리 방향(°). rot: 'path' 이면 진행 방향 - 머리 방향만큼 그림을 돌린다.
// rot: ['prev', 끝값] 이면 앞 구간 끝 회전값에서 시작한다. ref: 기준점 높이(0 = 위, 0.5 = 가운데, 1 = 바닥), [시작, 끝]이면 구간 안에서 옮긴다.
export function compileTrack(track, headings = {}) {
  let t = 0;
  let lastTurn = 0;
  const segs = track.segments.map((s) => {
    const seg = { ...s, t0: t, t1: t + s.dur, path: buildPath(s.path), ease: EASE[s.ease] || EASE.linear };
    if (seg.rot === 'path') {
      seg.heading = headings[seg.pose] || 0;
      lastTurn = tangentAt(seg.path, 1) - seg.heading;
    } else if (Array.isArray(seg.rot)) {
      seg.rot = [seg.rot[0] === 'prev' ? lastTurn : seg.rot[0], seg.rot[1]];
      lastTurn = seg.rot[1];
    } else {
      lastTurn = seg.rot || 0;
    }
    t += s.dur;
    return seg;
  });
  return { cycle: track.cycle, offset: track.offset || 0, segs, end: t };
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// 시각 time(초)의 상태 목록 [{ pose, x, y, w, alpha, shadow, turn, refY }] — 자세 전환 직후에는 앞 자세도 함께(그 아래에 깔림).
// 앞 자세는 전환 구간 전반부까지만 남기고 빠르게 지워, 두 대로 겹쳐 보이는 시간을 최소로 한다.
export function sample(track, time) {
  const t = (time + track.offset) % track.cycle;
  if (t >= track.end) return [];
  const i = track.segs.findIndex((s) => t < s.t1);
  const s = track.segs[i];
  const u = (t - s.t0) / s.dur;
  const e = s.ease(u);
  const [x, y] = pointAt(s.path, e);
  let alpha = 1;
  if (s.fadeIn) alpha *= clamp01(u / s.fadeIn);
  if (s.fadeOut) alpha *= clamp01((1 - u) / s.fadeOut);
  let shadow = s.shadowFrom != null ? clamp01((u - s.shadowFrom) / (1 - s.shadowFrom || 1)) : 1;
  if (s.noShadow) shadow = 0;
  let turn = 0;
  if (s.rot === 'path') turn = tangentAt(s.path, e) - s.heading;
  else if (Array.isArray(s.rot)) turn = s.rot[0] + (s.rot[1] - s.rot[0]) * EASE.inOut(u);
  else if (s.rot) turn = s.rot;
  // refFrom: 구간 진행도가 이 값을 넘은 뒤에만 기준점을 옮긴다 (예: 착지 직전 가운데 → 바퀴)
  const rk = s.refFrom != null ? clamp01((u - s.refFrom) / (1 - s.refFrom)) : u;
  const refY = Array.isArray(s.ref) ? s.ref[0] + (s.ref[1] - s.ref[0]) * EASE.inOut(rk) : (s.ref ?? 1);
  const out = [{ pose: s.pose, x, y, w: s.w[0] + (s.w[1] - s.w[0]) * e, alpha, shadow, turn, refY }];

  const prev = track.segs[i - 1];
  const since = t - s.t0;
  if (prev && prev.pose !== s.pose && since < XFADE) {
    const k = since / XFADE;
    out[0].alpha *= k;
    // 앞 자세도 지금 자세와 같은 기준점·회전으로 같은 자리에 그린다 (두 그림이 어긋나 보이지 않게)
    out.push({ pose: prev.pose, x, y, w: prev.w[1], alpha: Math.min(1, 2 * (1 - k)), shadow: prev.noShadow ? 0 : 1, turn, refY });
  }
  return out;
}

// 자세별 최대 표시 폭 (스프라이트 기본 폭 — 실제 폭은 scale 로 줄인다)
export function maxWidths(tracks) {
  const out = {};
  tracks.forEach((tr) => tr.segments.forEach((s) => {
    out[s.pose] = Math.max(out[s.pose] || 0, s.w[0], s.w[1]);
  }));
  return out;
}

// 다각형들(상자 기준 %)을 뺀 마스크 — 상자 전체에서 구멍을 뚫는다
export function holeMask(polys) {
  const d = polys.map((p) => `M${p.map(([x, y]) => `${x} ${y}`).join('L')}Z`).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path fill-rule='evenodd' d='M0 0H100V100H0Z${d}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
