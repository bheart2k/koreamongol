'use client';

// 03 오늘의 환율 — 대형 에디토리얼 숫자 + 오도미터(자릿수 롤링)
// 계산은 ExchangeMiniCard 와 동일: Math.round(rate * 1000) (1,000 ₩ 당 ₮)
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useMotion } from './MotionRoot';
import s from './b.module.css';

gsap.registerPlugin(ScrollTrigger);

const DIGITS = '0123456789';

function Odometer({ text }) {
  // 숫자는 0–9 세로 띠, 쉼표는 고정
  return (
    <span className={s.odo} aria-hidden="true">
      {text.split('').map((ch, i) => (DIGITS.includes(ch) ? (
        <span key={i} className={s.odoCol}>
          <span className={s.odoStrip} data-digit={ch}>
            {DIGITS.split('').concat(DIGITS.split('')).map((d, k) => <span key={k}>{d}</span>)}
          </span>
        </span>
      ) : (
        <span key={i} className={s.odoSep}>{ch}</span>
      )))}
    </span>
  );
}

export default function ExchangeFigure({ exchange }) {
  const ref = useRef(null);
  const [value, setValue] = useState(null);
  const { ready, reduced } = useMotion();

  useEffect(() => {
    let alive = true;
    fetch(exchange.api)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.rate) setValue(Math.round(d.rate * 1000)); })
      .catch(() => {});
    return () => { alive = false; };
  }, [exchange.api]);

  const text = value != null ? value.toLocaleString('en-US') : null;

  useEffect(() => {
    const el = ref.current;
    if (!text || !ready || !el) return;
    const strips = [...el.querySelectorAll('[data-digit]')];
    // 각 자리: 두 번째 0–9 묶음의 목표 숫자까지 굴림 (1em = 한 칸)
    const to = (strip) => -(10 + Number(strip.dataset.digit));
    if (reduced) {
      strips.forEach((st) => gsap.set(st, { yPercent: (to(st) * 100) / 20 }));
      return;
    }
    const tl = gsap.timeline({ paused: true });
    strips.forEach((st, i) => {
      tl.fromTo(st, { yPercent: 0 }, { yPercent: (to(st) * 100) / 20, duration: 1.6 + i * 0.12, ease: 'expo.out' }, i * 0.06);
    });
    const trig = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => tl.play() });
    return () => { trig.kill(); tl.kill(); };
  }, [text, ready, reduced]);

  return (
    <div ref={ref} className={s.fx}>
      <p className={s.fxFigure}>
        <span className={s.fxCur}>₮</span>
        {text ? (
          <>
            <Odometer text={text} />
            <span className={s.srOnly}>{text}</span>
          </>
        ) : (
          <span className={s.fxDash}>—</span>
        )}
      </p>
      <p className={s.fxUnit}>{exchange.unit}</p>
      <Link href={exchange.href} className={s.arrowLink}>
        {exchange.cta}
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </div>
  );
}
