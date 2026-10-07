'use client';

// 01 가이드 목록 — 대형 타이포 행
// 데스크톱(hover 가능한 정밀 포인터): 커서를 따라오는 WebGL 물결 프리뷰
// 터치/모바일: 화면 중앙에 온 행이 펼쳐지며 이미지 노출
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useMotion } from './MotionRoot';
import g from './guides.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function GuideIndex({ items }) {
  const listRef = useRef(null);
  const hostRef = useRef(null);
  const { ready, reduced } = useMotion();

  // 데스크톱 프리뷰
  useEffect(() => {
    const list = listRef.current;
    const host = hostRef.current;
    if (!ready || reduced || !list || !host) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    if (!fine.matches) return;

    let preview = null;
    let alive = true;
    const W = Math.min(340, window.innerWidth * 0.22);
    const H = W * 1.25;
    host.style.width = `${W}px`;
    host.style.height = `${H}px`;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    const vel = [0, 0];
    const state = { reveal: 0, mix: 0 };
    let active = null;
    let revealTween = null;

    // 목록이 화면 근처에 오면 WebGL·텍스처 준비 (첫 화면 대역폭과 경쟁하지 않게)
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      import('./ripplePreview').then(({ RipplePreview }) => {
        if (!alive) return;
        preview = new RipplePreview(host);
        preview.resize(W, H);
        preview.preload([...new Set(items.map((i) => i.preview))]);
      });
    }, { rootMargin: '60% 0px' });
    near.observe(list);

    const onMove = (e) => { target.x = e.clientX; target.y = e.clientY; };
    const show = (url) => {
      if (!preview) return;
      if (url !== active) {
        preview.setNext(url);
        state.mix = 0;
        gsap.to(state, { mix: 1, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
        active = url;
      }
      revealTween?.kill();
      revealTween = gsap.to(state, { reveal: 1, duration: 0.8, ease: 'power3.out' });
    };
    const hide = () => {
      revealTween?.kill();
      revealTween = gsap.to(state, { reveal: 0, duration: 0.55, ease: 'power2.in' });
    };

    const rows = [...list.querySelectorAll('[data-preview]')];
    const enters = rows.map((row) => {
      const fn = () => show(row.dataset.preview);
      row.addEventListener('pointerenter', fn);
      return () => row.removeEventListener('pointerenter', fn);
    });
    list.addEventListener('pointerleave', hide);
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = (time) => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * 0.13;
      pos.y += dy * 0.13;
      vel[0] += (gsap.utils.clamp(-1, 1, dx / 260) - vel[0]) * 0.2;
      vel[1] += (gsap.utils.clamp(-1, 1, -dy / 260) - vel[1]) * 0.2;
      const visible = Boolean(preview) && state.reveal > 0.001;
      if (host.dataset.visible !== String(visible)) {
        host.dataset.visible = String(visible);
        host.style.visibility = visible ? 'visible' : 'hidden';
      }
      if (!visible) return; // 숨어 있을 땐 DOM·GL 갱신 없음
      // 커서 오른쪽으로 비켜서서 제목을 가리지 않게
      host.style.transform = `translate3d(${pos.x + 36}px, ${pos.y - H * 0.55}px, 0) rotate(${vel[0] * 4}deg)`;
      const u = preview.program.uniforms;
      u.uReveal.value = state.reveal;
      u.uMix.value = state.mix;
      preview.render(time, vel);
    };
    gsap.ticker.add(tick);

    return () => {
      alive = false;
      near.disconnect();
      gsap.ticker.remove(tick);
      enters.forEach((off) => off());
      list.removeEventListener('pointerleave', hide);
      window.removeEventListener('pointermove', onMove);
      preview?.destroy();
    };
  }, [ready, reduced, items]);

  // 터치/모바일: 중앙 행 펼침
  useEffect(() => {
    const list = listRef.current;
    if (!ready || !list) return;
    const coarse = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 767px)');
    if (!coarse.matches) return;
    const triggers = [...list.querySelectorAll('[data-preview]')].map((row) => ScrollTrigger.create({
      trigger: row,
      start: 'top 58%',
      end: 'bottom 42%',
      onToggle(self) { row.dataset.active = self.isActive ? 'true' : 'false'; },
    }));
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  return (
    <>
      <ol ref={listRef} className={g.list}>
        {items.map((item, i) => (
          <li key={item.id} className={g.row} data-preview={item.preview}>
            <span className={g.rule} data-reveal="rule" aria-hidden="true" />
            <Link href={item.href} className={g.link}>
              <span className={g.no}>{String(i + 1).padStart(2, '0')}</span>
              <span className={g.title}>{item.title}</span>
              <span className={g.desc}>{item.desc}</span>
              <ArrowUpRight aria-hidden="true" className={g.arrow} />
            </Link>
            <div className={g.reveal} aria-hidden="true">
              <div className={g.revealInner}>
                <img src={item.previewSm} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div ref={hostRef} className={g.preview} aria-hidden="true" />
    </>
  );
}
