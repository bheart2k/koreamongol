'use client';

import { Moon, Sun } from 'lucide-react';
import styles from './hero.module.css';
import ux from './heroUi.module.css';

export const PORTRAIT = '(max-aspect-ratio: 1/1)';

// 낮/밤 두 장을 겹쳐 두고 .dark 에서 밤 장면으로 크로스페이드. 세로 화면은 9:16 전용 소스.
export function Art({ desktop, mobile, alt, priority, withNight }) {
  return (
    <>
      <picture>
        <source media={PORTRAIT} srcSet={mobile.day} />
        <img src={desktop.day} alt={alt} className={styles.art} decoding="async"
          loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
      </picture>
      {withNight && (
        <picture>
          <source media={PORTRAIT} srcSet={mobile.night} />
          <img src={desktop.night} alt="" aria-hidden="true" className={`${styles.art} ${styles.artNight}`}
            decoding="async" onLoad={(e) => { e.currentTarget.dataset.loaded = ''; }} />
        </picture>
      )}
    </>
  );
}

// 낮/밤 토글 — 사이트 테마(next-themes)를 바꾸고, 디오라마는 밤 장면으로 크로스페이드
export function DayNightToggle({ night, mounted, setTheme, copy }) {
  return (
    <div className={ux.toggle} role="group" aria-label={`${copy.day} / ${copy.night}`}>
      <span className={ux.toggleKnob} aria-hidden="true" />
      <button type="button" className={ux.toggleBtn} aria-pressed={mounted && !night} onClick={() => setTheme('light')} aria-label={copy.day}><Sun aria-hidden="true" /></button>
      <button type="button" className={ux.toggleBtn} aria-pressed={night} onClick={() => setTheme('dark')} aria-label={copy.night}><Moon aria-hidden="true" /></button>
    </div>
  );
}
