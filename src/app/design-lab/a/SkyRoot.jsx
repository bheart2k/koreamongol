'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import styles from './sky.module.css';

gsap.registerPlugin(ScrollTrigger);

// mode: 'static'(SSR·JS 없음) → 'full' | 'lite'(saveData·느린 망: 정지 이미지 + 느린 줌) | 'reduced'(모션 최소화)
const MotionContext = createContext({ mode: 'static', portrait: false, wide: false, lenis: null });
export const useMotion = () => useContext(MotionContext);

const PORTRAIT_MQ = '(max-aspect-ratio: 3/4)';
const WIDE_MQ = '(min-width: 900px) and (min-aspect-ratio: 1/1)';

function detectMode() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
  const c = navigator.connection;
  if (c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))) return 'lite';
  return 'full';
}

function makeGrainTile() {
  const size = 160;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

// data-sky-stop="dawn" 을 가진 요소 위치마다 팔레트를 고정하고, 경계 부근에서 스크롤로 보간
function useSkyInterpolation(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    const css = getComputedStyle(root);
    const pal = (name) => ({
      top: css.getPropertyValue(`--pal-${name}-top`).trim(),
      bottom: css.getPropertyValue(`--pal-${name}-bottom`).trim(),
      accent: css.getPropertyValue(`--pal-${name}-accent`).trim(),
    });
    let stops = [];
    const measure = () => {
      const vh = window.innerHeight;
      stops = [...root.querySelectorAll('[data-sky-stop]')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          const top = r.top + window.scrollY;
          const at = el.dataset.skyAt === 'end' ? top + r.height - vh : top - vh * 0.35;
          return { y: Math.max(0, at), pal: pal(el.dataset.skyStop) };
        })
        .sort((a, b) => a.y - b.y);
    };
    const apply = (y) => {
      if (!stops.length) return;
      let i = stops.findIndex((s) => s.y > y);
      if (i === -1) i = stops.length;
      const a = stops[Math.max(0, i - 1)];
      const b = stops[Math.min(stops.length - 1, i)];
      // 섹션 동안은 팔레트 유지, 다음 경계 직전 구간(최대 0.6화면)에서만 전환 → 읽는 동안 대비 유지
      const span = Math.min(window.innerHeight * 0.6, b.y - a.y);
      const t = a === b || span <= 0 ? 0 : gsap.utils.clamp(0, 1, (y - (b.y - span)) / span);
      root.style.setProperty('--sky-top', gsap.utils.interpolate(a.pal.top, b.pal.top, t));
      root.style.setProperty('--sky-bottom', gsap.utils.interpolate(a.pal.bottom, b.pal.bottom, t));
      root.style.setProperty('--sky-accent', gsap.utils.interpolate(a.pal.accent, b.pal.accent, t));
    };
    measure();
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onRefresh: () => { measure(); apply(window.scrollY); },
      onUpdate: (self) => apply(self.scroll()),
    });
    apply(window.scrollY);
    return () => st.kill();
  }, [rootRef, enabled]);
}

export default function SkyRoot({ children }) {
  const rootRef = useRef(null);
  const grainRef = useRef(null);
  const [state, setState] = useState({ mode: 'static', portrait: false, wide: false, lenis: null });

  // 모드·화면 비율 감지
  useEffect(() => {
    const portraitMq = window.matchMedia(PORTRAIT_MQ);
    const wideMq = window.matchMedia(WIDE_MQ);
    const read = () => setState((s) => ({ ...s, mode: detectMode(), portrait: portraitMq.matches, wide: wideMq.matches }));
    read();
    portraitMq.addEventListener('change', read);
    wideMq.addEventListener('change', read);
    return () => {
      portraitMq.removeEventListener('change', read);
      wideMq.removeEventListener('change', read);
    };
  }, []);

  // 필름 그레인 타일
  useEffect(() => {
    if (grainRef.current) grainRef.current.style.backgroundImage = `url(${makeGrainTile()})`;
  }, []);

  // Lenis 관성 스크롤 (full 모드만) — ScrollTrigger와 같은 틱에서 구동
  useEffect(() => {
    if (state.mode !== 'full') return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 } });
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setState((s) => ({ ...s, lenis }));
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setState((s) => ({ ...s, lenis: null }));
    };
  }, [state.mode]);

  useSkyInterpolation(rootRef, state.mode !== 'static');

  // 이미지·폰트 로딩 후 위치 재계산
  useEffect(() => {
    if (state.mode === 'static') return;
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, [state.mode]);

  return (
    <MotionContext.Provider value={state}>
      <div
        ref={rootRef}
        className={styles.root}
        data-motion={state.mode}
        data-portrait={state.portrait ? '' : undefined}
        data-wide={state.wide ? '' : undefined}
      >
        <div className={styles.skyBg} aria-hidden="true" />
        {children}
        <div ref={grainRef} className={styles.grain} aria-hidden="true" />
      </div>
    </MotionContext.Provider>
  );
}
