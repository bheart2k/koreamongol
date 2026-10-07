'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useMotion } from './SkyRoot';
import c from './chapters.module.css';

// 챕터 6장 — 고정 스크롤 없이 흐르는 카드. 화면에 가장 많이 보이는 카드 1개만 루프 영상 재생
export default function Chapters({ chapters, asset }) {
  const { mode, portrait, videoPaused } = useMotion();
  const rootRef = useRef(null);
  const [active, setActive] = useState(null);
  const full = mode === 'full';

  // 가장 많이 보이는(55% 이상) 미디어 하나를 고름
  useEffect(() => {
    if (!full) return;
    const medias = [...rootRef.current.querySelectorAll('[data-chapter]')];
    const ratios = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
      let best = null;
      let bestRatio = 0.55;
      ratios.forEach((r, el) => {
        if (r > bestRatio) { best = el; bestRatio = r; }
      });
      setActive(best ? Number(best.dataset.chapter) : null);
    }, { threshold: [0, 0.3, 0.55, 0.75, 0.95] });
    medias.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [full]);

  // 동시에 재생되는 영상은 최대 1개. 영상 파일은 처음 재생될 때만 내려받음
  useEffect(() => {
    if (!full) return;
    rootRef.current.querySelectorAll('video').forEach((v) => {
      const on = Number(v.dataset.index) === active && !videoPaused;
      const media = v.parentElement;
      if (on) {
        if (!v.getAttribute('src')) v.src = v.dataset.src;
        v.play().then(() => media.setAttribute('data-playing', '')).catch(() => {});
      } else {
        v.pause();
        media.removeAttribute('data-playing');
      }
    });
  }, [active, videoPaused, full, portrait]);

  return (
    <div ref={rootRef} className={c.chapters}>
      <div className={c.grid}>
        {chapters.map((ch, i) => (
          <section key={ch.id} id={`ch-${ch.id}`} className={c.card} aria-labelledby={`e-ch-${ch.id}`}>
            <div className={c.media} data-chapter={i}>
              <picture>
                <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/${ch.media}-m.webp`} />
                <img src={`${asset}/${ch.media}.webp`} alt="" crossOrigin="anonymous" width={1672} height={941} loading="lazy" decoding="async" />
              </picture>
              {full ? (
                <video
                  key={portrait ? 'm' : 'd'}
                  crossOrigin="anonymous"
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-index={i}
                  data-src={`${asset}/${ch.media}-loop${portrait ? '-m' : ''}.mp4`}
                  aria-hidden="true"
                />
              ) : null}
              <div className={c.shade} aria-hidden="true" />
              <span className={c.bigNo} aria-hidden="true">{ch.no}</span>
              <div className={c.cap}>
                <p className={c.kicker}>{ch.no}</p>
                <h2 id={`e-ch-${ch.id}`} className={c.title}>{ch.title}</h2>
              </div>
            </div>
            <ul className={c.links}>
              {ch.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={c.link}>
                    <span className={c.linkTitle}>{l.title}</span>
                    {l.desc ? <span className={c.linkDesc}>{l.desc}</span> : null}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className={c.skyMarkEnd} data-sky-stop="golden" aria-hidden="true" />
    </div>
  );
}
