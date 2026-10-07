'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import styles from './finale.module.css';

const DIGITS = '0123456789';

// 숫자 한 자리씩 세로로 굴러 멈추는 오도미터 (₮ / 1,000 ₩) — 값은 /api/exchange-rate
function Odometer({ value, run }) {
  return (
    <span className={styles.odo} aria-hidden="true">
      {[...value].map((ch, i) => {
        if (!DIGITS.includes(ch)) return <span key={i} className={styles.odoSep}>{ch}</span>;
        const d = Number(ch);
        return (
          <span key={i} className={styles.odoCol}>
            <span
              className={styles.odoReel}
              style={{ transform: `translateY(${run ? -(d + 10) * 5 : 0}%)`, transitionDelay: `${i * 90}ms` }}
            >
              {[...DIGITS, ...DIGITS].map((n, k) => <span key={k}>{n}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function ExchangeTicker({ exchange }) {
  const [rate, setRate] = useState(null);
  const [run, setRun] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    fetch(exchange.api)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.rate) setRate(data.rate); })
      .catch(() => {});
  }, [exchange.api]);

  useEffect(() => {
    if (!rate || !ref.current) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(() => setRun(true)); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rate]);

  const value = rate ? Math.round(rate * 1000).toLocaleString('en-US') : null;

  return (
    <Link ref={ref} href={exchange.href} className={styles.exchange} data-tilt="">
      <span className={styles.exHead}><Calculator aria-hidden="true" />{exchange.title}</span>
      <span className={styles.exValue}>
        <span className={styles.exCurrency}>₮</span>
        {value ? (
          <>
            <span className="sr-only">{value}</span>
            <Odometer value={value} run={run} />
          </>
        ) : '—'}
      </span>
      <span className={styles.exUnit}>{exchange.unit}</span>
      <span className={styles.exCta}>{exchange.cta}<ArrowRight aria-hidden="true" /></span>
    </Link>
  );
}
