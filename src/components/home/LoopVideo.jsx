'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { prefersLightAssets } from './connection';
import styles from './chapters.module.css';

// 클로즈업 위에 겹치는 6초 루프 — 화면 근처에서만 로딩·재생, 첫=끝 프레임이라 정지 이미지와 이음새가 없다.
// 5초 넘게 반복되므로 일시정지 버튼 제공 (WCAG 2.2.2).
export default function LoopVideo({ base, name, labels }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [src, setSrc] = useState(null);
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || prefersLightAssets()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const v = ref.current;
    const small = window.matchMedia('(max-width: 767px)').matches;
    const near = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSrc(`${base}/${name}${small ? '-m' : ''}.mp4`); near.disconnect(); }
    }, { rootMargin: '400px 0px' });
    const vis = new IntersectionObserver(([e]) => {
      if (!v) return;
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    near.observe(v);
    vis.observe(v);
    return () => { near.disconnect(); vis.disconnect(); };
  }, [enabled, base, name]);

  if (!enabled) return null;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; v.pause(); setPaused(true); }
  };

  return (
    <>
      <video
        ref={ref}
        className={styles.video}
        data-shown={shown || undefined}
        src={src || undefined}
        muted
        loop
        autoPlay={Boolean(src) && !userPaused.current}
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setShown(true)}
      />
      <button type="button" className={styles.pause} onClick={toggle} aria-label={paused ? labels.play : labels.pause}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
    </>
  );
}
