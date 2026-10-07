'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useMotion } from './SkyRoot';
import sky from './sky.module.css';
import x from './sections.module.css';

const DIGITS = [...'0123456789'];

// 숫자 롤링 카운터 — 자릿수마다 0~9 띠를 굴려 목표 숫자에 멈춤
function Odometer({ value, rollRef }) {
  return (
    <span className={x.odo} aria-hidden="true" ref={rollRef}>
      {[...value].map((ch, i) => (/\d/.test(ch) ? (
        <span key={i} className={x.odoCol} data-digit={ch}>
          <span className={x.odoStrip}>
            {[...DIGITS, ...DIGITS].map((d, j) => <span key={j}>{d}</span>)}
          </span>
        </span>
      ) : (
        <span key={i} className={x.odoSep}>{ch}</span>
      )))}
    </span>
  );
}

export default function TodaySection({ exchange, updatesHeading, updates, emergency, emergencyGuide }) {
  const { mode } = useMotion();
  const sectionRef = useRef(null);
  const rollRef = useRef(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    let alive = true;
    let timer = 0;
    const load = (retry) => fetch(exchange.api)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // ExchangeMiniCard 와 같은 계산: 1,000 ₩ 당 ₮
        if (alive && data?.rate) setValue(Math.round(data.rate * 1000).toLocaleString('en-US'));
        else if (alive && retry) timer = setTimeout(() => load(false), 3000);
      })
      .catch(() => { if (alive && retry) timer = setTimeout(() => load(false), 3000); });
    load(true);
    return () => { alive = false; clearTimeout(timer); };
  }, [exchange.api]);

  // 숫자가 준비되고 화면에 들어오면 굴림
  useEffect(() => {
    if (!value || !rollRef.current) return;
    const cols = [...rollRef.current.querySelectorAll(`.${x.odoCol}`)];
    const strips = cols.map((col) => col.firstChild);
    const target = (col) => -(10 + Number(col.dataset.digit)) * 5; // 띠(20칸) 중 두 번째 0~9에 정지 (%)
    if (mode === 'static' || mode === 'reduced') {
      strips.forEach((s, i) => gsap.set(s, { yPercent: target(cols[i]) }));
      return;
    }
    const ctx = gsap.context(() => {
      strips.forEach((s, i) => gsap.set(s, { yPercent: 0 }));
      gsap.to(strips, {
        yPercent: (i) => target(cols[i]),
        duration: (i) => 1.6 + i * 0.18,
        ease: 'power4.out',
        scrollTrigger: { trigger: rollRef.current, start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [value, mode]);

  // 목록 등장
  useEffect(() => {
    if (mode !== 'full') return;
    const ctx = gsap.context(() => {
      gsap.from(`.${x.reveal}`, {
        y: 28, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.from(`.${x.list}`, {
        '--rule': 0, duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={sectionRef} className={`${x.section} ${x.light} ${x.today}`} aria-labelledby="a-rate-title">
      <div className={x.skyMarkTop} data-sky-stop="golden" aria-hidden="true" />
      <div className={`${x.wrap} ${x.todayGrid}`}>
        <div className={x.rate}>
          <h2 id="a-rate-title" className={`${x.label} ${x.reveal}`}>{exchange.title}</h2>
          <p className={`${x.rateValue} ${x.reveal}`}>
            <span className={x.tugrik}>₮</span>
            {value ? <Odometer value={value} rollRef={rollRef} /> : <span className={x.odoWait}>—</span>}
            {value ? <span className={sky.srOnly}>₮ {value}</span> : null}
          </p>
          <p className={`${x.rateUnit} ${x.reveal}`}>{exchange.unit}</p>
          <Link href={exchange.href} className={`${x.textLink} ${x.reveal}`}>
            {exchange.cta}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={x.updates}>
          <h2 className={`${x.label} ${x.reveal}`}>{updatesHeading}</h2>
          <ul className={x.list}>
            {updates.map((u) => (
              <li key={u.href} className={x.reveal}>
                <Link href={u.href} className={x.row}>
                  <span>
                    <small className={x.cat}>{u.category}</small>
                    {u.title}
                  </span>
                  <time dateTime={u.lastUpdated}>{u.lastUpdated}</time>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${x.sos} ${x.reveal}`} aria-label={emergency.ariaLabel} role="group">
          <ul className={x.sosNums}>
            {emergency.items.map((e) => (
              <li key={e.number}>
                <a href={`tel:${e.number}`} className={x.sosNum}>
                  <span aria-hidden="true">{e.emoji}</span>
                  <span>{e.label}</span>
                  <strong>{e.number}</strong>
                </a>
              </li>
            ))}
          </ul>
          <Link href={emergencyGuide.href} className={x.sosGuide}>
            <span>{emergencyGuide.title}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
