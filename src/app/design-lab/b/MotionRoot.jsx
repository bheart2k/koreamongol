'use client';

// 시안 B 모션 루트: Lenis 부드러운 스크롤 + GSAP ScrollTrigger + 공통 등장 연출 + 전역 모션 토글
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Pause, Play } from 'lucide-react';
import { setupReveals } from './reveals';
import s from './b.module.css';

gsap.registerPlugin(ScrollTrigger);

const MotionContext = createContext({ ready: false, reduced: false, lite: false, paused: false });
export const useMotion = () => useContext(MotionContext);

// 데이터 절약·느린 망 → 영상 대신 정지 이미지
function detectLite() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType || '');
}

export default function MotionRoot({ className, children }) {
  const rootRef = useRef(null);
  const [state, setState] = useState({ ready: false, reduced: false, lite: false });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = detectLite();
    setState({ ready: true, reduced, lite });
    if (lite) setPaused(true);

    let lenis = null;
    let tick = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 0.9, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // 같은 페이지 앵커(#guides 등)는 Lenis 로 부드럽게 이동
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !rootRef.current?.contains(a)) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -64, duration: 1.4 });
      else target.scrollIntoView();
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onAnchor);

    const ctx = setupReveals(rootRef.current, { reduced });

    return () => {
      document.removeEventListener('click', onAnchor);
      ctx?.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  // 전역 일시정지: 루프 영상·마키 정지 (WCAG 2.2.2)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.paused = paused ? 'true' : 'false';
    root.querySelectorAll('video[data-loop]').forEach((v) => {
      if (paused) v.pause();
      else if (v.dataset.visible === 'true') v.play().catch(() => {});
    });
  }, [paused, state.ready]);

  const showToggle = state.ready && !state.reduced;

  return (
    <MotionContext.Provider value={{ ...state, paused }}>
      <div ref={rootRef} className={className} data-ready={state.ready ? 'true' : 'false'}>
        {children}
        {showToggle && (
          <button
            type="button"
            className={s.motionToggle}
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            <span>{paused ? 'Хөдөлгөөнийг эхлүүлэх' : 'Хөдөлгөөнийг зогсоох'}</span>
          </button>
        )}
      </div>
    </MotionContext.Provider>
  );
}
