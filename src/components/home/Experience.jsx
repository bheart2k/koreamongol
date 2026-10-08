'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

// 페이지 공통 연출: Lenis 관성 스크롤 + data-* 기반 등장 안무 + 마그네틱 버튼 + 3D 스프링 카드
//   data-reveal="rise"   : 아래에서 떠오름
//   data-reveal="clip"   : inset 와이프 + 내부 이미지 1.18→1
//   data-reveal="stagger": 자식 [data-item] 순차 등장
//   data-magnetic        : 커서 쪽으로 끌리는 버튼
//   data-tilt            : 포인터 위치에 따라 기울어지는 카드
//   data-zoom            : 스크롤에 맞춰 1.16→1 로 다가오는 이미지
export default function Experience({ children }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cleanups = [];

    if (!reduced) {
      // 앵커 이동 시 네비바 높이는 섹션의 scroll-margin-top 으로 보정된다
      const lenis = new Lenis({ lerp: 0.11, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => { gsap.ticker.remove(tick); lenis.destroy(); });
    }

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray('[data-reveal="rise"]').forEach((el) => {
        gsap.from(el, {
          y: 56, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray('[data-reveal="clip"]').forEach((el) => {
        const inner = el.querySelector('[data-clip-inner]');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        tl.fromTo(el, { clipPath: 'inset(18% 12% 18% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.5, ease: 'expo.out' });
        if (inner) tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
      });
      gsap.utils.toArray('[data-reveal="stagger"]').forEach((el) => {
        gsap.from(el.querySelectorAll('[data-item]'), {
          y: 40, opacity: 0, rotateX: -12, transformOrigin: '50% 100%', duration: 1, stagger: 0.06, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });
      gsap.utils.toArray('[data-zoom]').forEach((el) => {
        gsap.fromTo(el, { scale: 1.16, yPercent: 4 }, {
          scale: 1, yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
      });
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 12;
        gsap.fromTo(el, { yPercent: -amt }, {
          yPercent: amt, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
    cleanups.push(() => ctx.revert());

    if (fine && !reduced) {
      // 마그네틱 버튼: 포인터를 따라 살짝 끌려오고, 떠나면 탄성 있게 복귀
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.36);
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
      // 스프링 카드: 포인터 위치 기준 3D 기울기
      document.querySelectorAll('[data-tilt]').forEach((el) => {
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        gsap.set(el, { transformPerspective: 900 });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 9);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
        };
        const leave = () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
    }

    // 이미지·폰트 로딩 뒤 위치 재계산
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    cleanups.push(() => window.removeEventListener('load', refresh));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return children;
}
