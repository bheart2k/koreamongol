'use client';

// 상황별 바로가기 — 스크롤 속도·방향에 반응하는 마키 띠 (두 줄, 서로 반대 방향)
// 첫 번째 사본만 실제 링크(포커스 가능), 나머지 사본은 inert. hover·focus·전역 일시정지 시 멈춤.
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useMotion } from './MotionRoot';
import s from './b.module.css';

gsap.registerPlugin(ScrollTrigger);

const COPIES = 3;

function Row({ items, offset }) {
  return (
    <div className={s.mqRow} data-row="">
      <div className={s.mqTrack} data-track="">
        {Array.from({ length: COPIES }, (_, c) => (
          <ul key={c} className={s.mqSet} inert={c > 0 ? true : undefined} aria-hidden={c > 0 ? 'true' : undefined}>
            {items.map((it, i) => (
              <li key={it.href + it.label}>
                <Link href={it.href} className={s.mqItem} tabIndex={c > 0 ? -1 : undefined}>
                  <span className={s.mqNo}>{String(i + 1 + offset).padStart(2, '0')}</span>
                  <span className={s.mqLabel}>{it.label}</span>
                  <ArrowUpRight aria-hidden="true" className={s.mqArrow} />
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Marquee({ heading, items }) {
  const ref = useRef(null);
  const { ready, reduced, paused } = useMotion();
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const root = ref.current;
    if (!ready || reduced || !root) return;
    const rows = [...root.querySelectorAll('[data-row]')].map((row, i) => ({
      row,
      track: row.querySelector('[data-track]'),
      dir: i % 2 === 0 ? -1 : 1,
      x: 0,
      hover: false,
    }));
    rows.forEach((r) => {
      const on = () => { r.hover = true; };
      const off = () => { r.hover = false; };
      r.row.addEventListener('pointerenter', on);
      r.row.addEventListener('pointerleave', off);
      r.row.addEventListener('focusin', on);
      r.row.addEventListener('focusout', off);
      r.cleanup = () => {
        r.row.removeEventListener('pointerenter', on);
        r.row.removeEventListener('pointerleave', off);
        r.row.removeEventListener('focusin', on);
        r.row.removeEventListener('focusout', off);
      };
    });

    let boost = 0;
    let scrollDir = 1;
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity();
        scrollDir = v < 0 ? -1 : 1;
        boost = Math.min(Math.abs(v) / 260, 14);
      },
    });

    // 사본 1개 폭은 크기가 바뀔 때만 다시 잰다 (매 프레임 레이아웃 읽기 방지)
    const measure = () => rows.forEach((r) => { r.setW = r.track.scrollWidth / COPIES; });
    measure();
    const ro = new ResizeObserver(measure);
    rows.forEach((r) => ro.observe(r.track));

    const BASE = 0.55; // px / frame @60fps
    let speed = BASE;
    const tick = (time, delta) => {
      if (!st.isActive) return; // 화면 밖이면 쉰다
      const f = Math.min(delta / 16.67, 3);
      speed += (BASE + boost - speed) * 0.08;
      boost *= 0.92;
      rows.forEach((r) => {
        if (r.hover || pausedRef.current || !r.setW) return;
        r.x += r.dir * scrollDir * speed * f;
        if (r.x <= -r.setW) r.x += r.setW;
        if (r.x > 0) r.x -= r.setW;
        r.track.style.transform = `translate3d(${r.x}px,0,0)`;
      });
    };
    // 두 번째 줄은 반 사본만큼 어긋나서 시작
    rows.forEach((r, i) => { if (i % 2) r.x = -r.setW / 2; });
    gsap.ticker.add(tick);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
      st.kill();
      rows.forEach((r) => r.cleanup());
    };
  }, [ready, reduced]);

  const half = Math.ceil(items.length / 2);
  return (
    <section ref={ref} className={s.marquee} aria-labelledby="b-situations">
      <div className={s.wrap}>
        <div className={s.kicker}>
          <span className={s.kickerMark} aria-hidden="true">✳</span>
          <h2 id="b-situations" className={s.kickerText}>{heading}</h2>
          <span className={s.kickerRule} data-reveal="rule" aria-hidden="true" />
        </div>
      </div>
      <Row items={items.slice(0, half)} offset={0} />
      <Row items={items.slice(half)} offset={half} />
    </section>
  );
}
