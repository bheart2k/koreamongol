'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useMotion } from './SkyRoot';
import b from './chipbar.module.css';

// 히어로가 끝나면 Navbar 바로 아래 고정되는 챕터 칩 바 — 누르면 이동, 현재 위치 표시
export default function ChipBar({ chips, label, labels }) {
  const { lenis, mode, videoPaused, setVideoPaused } = useMotion();
  const [current, setCurrent] = useState(null);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const lockRef = useRef(null); // 칩으로 이동한 챕터 — 2열 배치에서 같은 줄 챕터보다 우선 표시

  // 현재 챕터 추적 (화면 위쪽 40% 지점에 걸린 섹션)
  useEffect(() => {
    const sections = chips.map((c) => document.getElementById(c.target)).filter(Boolean);
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
      if (lockRef.current) {
        setCurrent(lockRef.current);
        return;
      }
      const hit = sections.find((s) => visible.get(s.id));
      setCurrent(hit ? hit.id : null);
    }, { rootMargin: '-38% 0px -58% 0px' });
    sections.forEach((s) => io.observe(s));
    // 사용자가 직접 스크롤하면 칩 잠금 해제
    const release = () => { lockRef.current = null; };
    const opts = { passive: true };
    window.addEventListener('wheel', release, opts);
    window.addEventListener('touchstart', release, opts);
    window.addEventListener('keydown', release);
    return () => {
      io.disconnect();
      window.removeEventListener('wheel', release, opts);
      window.removeEventListener('touchstart', release, opts);
      window.removeEventListener('keydown', release);
    };
  }, [chips]);

  // 활성 칩 아래 금빛 인디케이터 이동 + 모바일에서 활성 칩을 가로 스크롤로 보이게
  useEffect(() => {
    const list = listRef.current;
    const ind = indicatorRef.current;
    const el = current ? list?.querySelector(`[data-target="${current}"]`) : null;
    if (!el) {
      ind.style.opacity = '0';
      return;
    }
    ind.style.opacity = '1';
    ind.style.width = `${el.offsetWidth}px`;
    ind.style.transform = `translateX(${el.offsetLeft}px)`;
    const left = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2;
    list.scrollTo({ left, behavior: mode === 'full' ? 'smooth' : 'auto' });
  }, [current, mode]);

  const go = (e, target) => {
    const el = document.getElementById(target);
    if (!el) return;
    e.preventDefault();
    lockRef.current = target;
    setCurrent(target);
    // 위 여백(Navbar + 칩 바)은 대상의 CSS scroll-margin-top 하나로 처리 (Lenis·네이티브 모두 반영)
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: mode === 'full' ? 'smooth' : 'auto' });
    history.replaceState(null, '', `#${target}`);
  };

  const pauseLabel = videoPaused ? labels.play : labels.pause;

  return (
    <nav className={b.bar} aria-label={label}>
      <div className={b.inner}>
        <div ref={listRef} className={b.chips}>
          <span ref={indicatorRef} className={b.indicator} aria-hidden="true" />
          <ul className={b.list}>
          {chips.map((c) => (
            <li key={c.target}>
              <a
                href={`#${c.target}`}
                data-target={c.target}
                className={b.chip}
                aria-current={current === c.target ? 'location' : undefined}
                onClick={(e) => go(e, c.target)}
              >
                <span className={b.no}>{c.no}</span>
                {c.title}
              </a>
            </li>
          ))}
          </ul>
        </div>
        {mode === 'full' ? (
          <button
            type="button"
            className={b.pause}
            onClick={() => setVideoPaused(!videoPaused)}
            aria-pressed={videoPaused}
            aria-label={pauseLabel}
            title={pauseLabel}
          >
            {videoPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
