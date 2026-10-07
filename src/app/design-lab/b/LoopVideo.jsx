'use client';

// 시네마그래프 루프 영상: 페이지 로드 후 유휴 시간에 로딩, 화면에 보일 때만 재생,
// 재생 가능해지면 정지 이미지 위로 페이드인. 전역 일시정지(useMotion().paused)를 따른다.
import { useEffect, useRef, useState } from 'react';
import { useMotion } from './MotionRoot';

function whenIdle(cb, delay) {
  const run = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(cb, { timeout: 2500 });
    else setTimeout(cb, 300);
  };
  const start = () => setTimeout(run, delay);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

export default function LoopVideo({ src, srcMobile, className, delay = 0 }) {
  const ref = useRef(null);
  const { ready, reduced, lite, paused } = useMotion();
  const enabled = ready && !reduced && !lite;
  const pausedRef = useRef(paused);
  const [on, setOn] = useState(false);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;
    let io;
    let alive = true;
    whenIdle(() => {
      if (!alive) return;
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      // srcMobile === null: 모바일에서는 영상 없이 정지 이미지만
      if (mobile && srcMobile === null) return;
      // 화면 근처(위아래 25%)에 올 때 처음 로딩 — 점진 로딩
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !v.getAttribute('src')) {
          v.src = mobile && srcMobile ? srcMobile : src;
          v.load();
        }
        v.dataset.visible = e.isIntersecting ? 'true' : 'false';
        if (e.isIntersecting && !pausedRef.current) v.play().catch(() => {});
        else v.pause();
      }, { rootMargin: '25% 0px' });
      io.observe(v);
    }, delay);
    const onPlaying = () => setOn(true);
    v.addEventListener('playing', onPlaying);
    return () => {
      alive = false;
      io?.disconnect();
      v.removeEventListener('playing', onPlaying);
    };
  }, [enabled, src, srcMobile, delay]);

  if (!enabled) return null;
  return (
    <video
      ref={ref}
      className={className}
      data-loop=""
      data-on={on ? 'true' : 'false'}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
