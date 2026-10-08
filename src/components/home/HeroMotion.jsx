'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { compileTrack, holeMask, maxWidths, sample } from './motion';
import styles from './heroMotion.module.css';

const SMOKE = [styles.s1, styles.s2, styles.s3, styles.s4];

// CSS 마스크는 CORS 모드로 받는다 → 일반 요청과 캐시가 섞이지 않게 쿼리로 분리 (CLAUDE.md R2 CORS 캐시 함정)
const maskUrl = (u) => `url("${u}?mask")`;
const mask = (value) => ({ WebkitMaskImage: value, maskImage: value });
const poseList = (track) => [...new Set(track.segments.map((s) => s.pose))];

function Art({ src, className, style, imgRef }) {
  return (
    <img ref={imgRef} src={src} alt="" aria-hidden="true" draggable={false} decoding="async" fetchPriority="low"
      className={className} style={style} />
  );
}

function CloudStrip({ cloud, base }) {
  const src = `${base}/${cloud.name}.webp`;
  return (
    <div className={styles.strip} style={{ '--top': cloud.top, '--tw': cloud.w, '--sec': cloud.sec }}>
      <Art src={src} />
      <Art src={src} />
      <Art src={src} />
    </div>
  );
}

// 히어로 움직임 레이어 — 기준 그림 위, 핀 아래. 첫 화면(load) 이후 그림을 받고, 다 받으면 페이드인하며 시작한다.
// 탈것은 rAF 로 transform·opacity 만 바꾸고, 나머지(구름·연기·불빛·연못)는 CSS 애니메이션.
// 멈춤: 일시정지 버튼(paused) · 히어로가 화면 밖 · 탭 숨김 · 로딩 중.
export default function HeroMotion({ data, paused }) {
  const rootRef = useRef(null);
  const els = useRef({});
  const clock = useRef(0);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);

  const tracks = useMemo(() => {
    const headings = Object.fromEntries(Object.entries(data.sprites).map(([k, v]) => [k, v.heading || 0]));
    return [compileTrack(data.plane, headings), compileTrack(data.bus, headings)];
  }, [data]);
  const widths = useMemo(() => maxWidths([data.plane, data.bus]), [data]);
  const planePoses = useMemo(() => poseList(data.plane), [data]);
  const busPoses = useMemo(() => poseList(data.bus), [data]);

  useEffect(() => {
    let idle = 0;
    const start = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setLoad(true), { timeout: 1500 });
      else idle = window.setTimeout(() => setLoad(true), 300);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    if (!load) return undefined;
    let alive = true;
    const imgs = [...rootRef.current.querySelectorAll('img')];
    Promise.allSettled(imgs.map((im) => im.decode())).then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, [load]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(rootRef.current);
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const running = ready && inView && !hidden && !paused;

  // 탈것: 시각 → 자세별 위치·크기·투명도 (멈추면 그 자리에 그대로 선다)
  useEffect(() => {
    if (!running) return undefined;
    const root = rootRef.current;
    let W = root.clientWidth;
    let H = root.clientHeight;
    const ro = new ResizeObserver(() => { W = root.clientWidth; H = root.clientHeight; });
    ro.observe(root);
    const shown = new Set();
    let last = performance.now();
    let raf = 0;

    const place = (st) => {
      const sp = data.sprites[st.pose];
      const sprite = els.current[st.pose];
      const shadow = els.current[`${st.pose}-shadow`];
      if (!sprite || !shadow) return;
      const wp = (widths[st.pose] / 100) * W;
      const hp = (wp * sp.px[1]) / sp.px[0];
      const ws = (wp * sp.shadow[0]) / sp.px[0];
      const hs = (ws * sp.shadow[1]) / sp.shadow[0];
      const s = st.w / widths[st.pose];
      const x = (st.x / 100) * W;
      const y = (st.y / 100) * H;
      // 기준점(가운데~바닥)을 경로 위 점에 두고, 그 점을 중심으로 회전·축소
      sprite.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${st.turn}deg) scale(${s}) translate(${-wp / 2}px, ${-hp * st.refY}px)`;
      sprite.style.opacity = st.alpha;
      // 그림자는 바퀴 닿는 점(바닥) 기준, 회전 없음
      const gy = y + hp * s * (1 - st.refY);
      shadow.style.transform = `translate3d(${x + W * 0.002}px, ${gy + H * 0.002}px, 0) scale(${s}) translate(${-ws / 2}px, ${-hs}px)`;
      shadow.style.opacity = st.alpha * st.shadow;
    };

    const frame = (now) => {
      clock.current += Math.min(0.1, (now - last) / 1000);
      last = now;
      const seen = new Set();
      tracks.forEach((tr) => sample(tr, clock.current).forEach((st) => { place(st); seen.add(st.pose); }));
      shown.forEach((pose) => {
        if (seen.has(pose)) return;
        els.current[pose].style.opacity = 0;
        els.current[`${pose}-shadow`].style.opacity = 0;
      });
      shown.clear();
      seen.forEach((p) => shown.add(p));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [running, tracks, widths, data]);

  const vehicle = (poses) => (
    <>
      {poses.map((p) => (
        <Art key={`${p}-shadow`} src={`${data.base}/${p}-shadow.webp`} className={styles.sprite}
          imgRef={(el) => { els.current[`${p}-shadow`] = el; }}
          style={{ width: `${(widths[p] * data.sprites[p].shadow[0]) / data.sprites[p].px[0]}%` }} />
      ))}
      {poses.map((p) => (
        <Art key={p} src={`${data.base}/${p}.webp`} className={styles.sprite}
          imgRef={(el) => { els.current[p] = el; }} style={{ width: `${widths[p]}%` }} />
      ))}
    </>
  );

  const pond = data.pond.box;

  return (
    <div ref={rootRef} className={styles.motion} data-ready={ready || undefined} data-paused={!running || undefined} aria-hidden="true">
      {load && (
        <>
          {/* 섬 뒤 먼 구름 — 섬 모양을 뺀 자리에만 */}
          <div className={`${styles.layer} ${styles.far}`} style={mask(`linear-gradient(#000 0 0), ${maskUrl(data.maskIsland)}`)}>
            <CloudStrip cloud={data.clouds.far} base={data.base} />
          </div>
          {/* 연못 빛 반사 */}
          <div className={styles.pond}
            style={{ left: `${pond[0]}%`, top: `${pond[1]}%`, width: `${pond[2]}%`, height: `${pond[3]}%`, ...mask(maskUrl(data.pond.mask)) }}>
            <span className={styles.sheen} />
          </div>
          {/* 불빛 */}
          {data.lights.map((l) => (
            <span key={`${l.x}-${l.y}`} className={`${styles.glow} ${styles[l.kind]}`}
              style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, height: `${l.h}%`, '--sec': l.sec, '--delay': l.delay || 0 }} />
          ))}
          {/* 굴뚝 연기 */}
          {[0, 1, 2].map((n) => (
            <div key={n} className={styles.puff} style={{ '--n': n }}>
              {data.smoke.puffs.map((p, k) => (
                <Art key={p.name} src={`${data.base}/${p.name}.webp`} className={`${styles.smoke} ${SMOKE[k]}`}
                  style={{ left: `${data.smoke.at[0]}%`, top: `${data.smoke.at[1]}%`, width: `${p.w}%` }} />
              ))}
            </div>
          ))}
          {/* 비행기 */}
          <div className={styles.layer}>{vehicle(planePoses)}</div>
          {/* 버스 — 지하차도 입구에서 터널 위로 비어져 나오는 지붕은 숨김 */}
          <div className={`${styles.layer} ${styles.busLayer}`} style={mask(holeMask(data.busHide))}>{vehicle(busPoses)}</div>
          {/* 앞가림: 지하차도 입구 · 연못 정원 나무(기준 그림을 잘라 덮음) */}
          {data.occluders.filter((o) => o.base).map((o) => (
            <Art key="base-occluder" src={data.baseImage} className={styles.baseOccluder}
              style={{ clipPath: `polygon(${o.clip.map(([x, y]) => `${x}% ${y}%`).join(', ')})` }} />
          ))}
          {data.occluders.filter((o) => !o.base).map((o) => (
            <Art key={o.name} src={`${data.base}/${o.name}.webp`} className={styles.occluder}
              style={{ left: `${o.box[0]}%`, top: `${o.box[1]}%`, width: `${o.box[2]}%`, height: `${o.box[3]}%`, ...(o.cut ? mask(holeMask([o.cut])) : null) }} />
          ))}
          {/* 구름 그림자 — 섬 위만 (탈것·앞가림 위로 지나감) */}
          <div className={`${styles.layer} ${styles.island}`} style={mask(maskUrl(data.maskIsland))}>
            <span className={styles.cloudShade} />
          </div>
          {/* 섬 밑면 앞 가까운 구름 */}
          <div className={styles.layer}><CloudStrip cloud={data.clouds.near} base={data.base} /></div>
        </>
      )}
    </div>
  );
}
