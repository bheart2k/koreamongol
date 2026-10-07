'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Zap } from 'lucide-react';
import { GuideIcon } from './icons';
import LoopVideo from './LoopVideo';
import base from './c.module.css';
import styles from './chapters.module.css';
import mm from './minimap.module.css';

gsap.registerPlugin(ScrollTrigger);

// 클로즈업: 모바일 828w / 데스크톱 1200w
const SIZES = '(max-width: 1023px) calc(100vw - 32px), 640px';
const srcSet = (src) => `${src.replace('.webp', '-m.webp')} 828w, ${src} 1200w`;

// 미니맵 좌표: k0 기준 % → 크롭 영역 기준 %
const toMini = ([x, y], c) => [((x - c.x0) / (c.x1 - c.x0)) * 100, ((y - c.y0) / (c.y1 - c.y0)) * 100];

function MiniMap({ chapters, crop, img, night, active, visible, label }) {
  const pts = chapters.map((c) => toMini(c.mini, crop));
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const style = {
    '--img-w': `${(100 / (crop.x1 - crop.x0)) * 100}%`,
    '--img-l': `${(-crop.x0 / (crop.x1 - crop.x0)) * 100}%`,
    '--img-t': `${(-crop.y0 / (crop.y1 - crop.y0)) * 100}%`,
    '--ratio': `${((crop.x1 - crop.x0) * 1672) / ((crop.y1 - crop.y0) * 940)}`,
  };
  return (
    <div className={mm.mini} data-visible={visible || undefined} aria-hidden="true" style={style}>
      <div className={mm.miniMap}>
        <img src={img} alt="" className={mm.miniImg} loading="lazy" decoding="async" />
        {night && <img src={night} alt="" className={`${mm.miniImg} ${mm.miniNight}`} loading="lazy" decoding="async" />}
        <svg className={mm.miniRoute} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={path} pathLength="1" style={{ strokeDashoffset: 1 - (active < 0 ? 0 : active / (chapters.length - 1)) }} />
        </svg>
        {pts.map(([x, y], i) => (
          <span key={chapters[i].id} className={mm.miniDot} data-on={i === active || undefined}
            data-done={i < active || undefined} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
      <p className={mm.miniLabel}>
        <span>{label}</span>
        <strong>{active >= 0 ? `${chapters[active].no} · ${chapters[active].title}` : ''}</strong>
      </p>
    </div>
  );
}

export default function Chapters({ chapters, guideMap, copy, crop, miniImg, assetBase, alts }) {
  const rootRef = useRef(null);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (resolvedTheme === 'dark') setNightSeen(true); }, [resolvedTheme]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const arts = gsap.utils.toArray('[data-chapter]');
      ScrollTrigger.create({
        trigger: arts[0],
        endTrigger: arts[arts.length - 1],
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => setVisible(self.isActive),
      });
      arts.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => { if (self.isActive) setActive(i); },
        });
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const q = gsap.utils.selector(el);
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', once: true } })
          .from(q('[data-ch-char]'), { yPercent: 115, rotate: 5, duration: 1.1, stagger: 0.025, ease: 'expo.out' })
          .from(q('[data-ch-line]'), { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.2)
          .from(q('[data-ch-card]'), { y: 34, opacity: 0, scale: 0.94, duration: 1, stagger: 0.08, ease: 'back.out(1.6)' }, 0.3);
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.chapters} aria-labelledby="c-chapters">
      <header className={`${base.wrap} ${styles.head}`} data-reveal="rise">
        <p className={base.kicker}>{copy.chaptersKicker}</p>
        <h2 id="c-chapters" className={styles.headTitle}>{copy.chaptersTitle}</h2>
      </header>

      {chapters.map((c, i) => (
        <article key={c.id} className={`${base.wrap} ${styles.chapter}`} data-side={i % 2 ? 'right' : 'left'}
          data-chapter="" aria-labelledby={`c-ch-${c.id}`}>
          <div className={styles.media} data-reveal="clip">
            <div className={styles.mediaInner} data-clip-inner="">
              <img src={c.img} srcSet={srcSet(c.img)} sizes={SIZES} alt={alts[c.id] || ''} loading="lazy"
                decoding="async" className={`${styles.still} ${c.loop ? '' : styles.drift}`} />
              {c.loop && resolvedTheme !== 'dark' && (
                <LoopVideo base={assetBase} name={c.loop} labels={{ pause: copy.pause, play: copy.play }} />
              )}
              {/* 밤 장면: .dark 에서 낮 장면 위로 크로스페이드 + 느린 드리프트 (밤에는 낮 루프를 받지 않음) */}
              {nightSeen && (
                <img src={c.img.replace('.webp', '-night.webp')} srcSet={srcSet(c.img.replace('.webp', '-night.webp'))}
                  sizes={SIZES} alt="" aria-hidden="true" loading="lazy"
                  decoding="async" className={`${styles.still} ${styles.night} ${styles.drift}`}
                  onLoad={(e) => { e.currentTarget.dataset.loaded = ''; }} />
              )}
            </div>
          </div>

          <div className={styles.text}>
            <span className={styles.no} aria-hidden="true" data-parallax="14">{c.no}</span>
            <h3 id={`c-ch-${c.id}`} className={styles.title}>
              <span className="sr-only">{c.title}</span>
              <span aria-hidden="true" className={styles.titleMask}>
                {[...c.title].map((ch, k) => <span key={k} data-ch-char="">{ch === ' ' ? ' ' : ch}</span>)}
              </span>
            </h3>
            <p className={styles.line} data-ch-line="">{c.line}</p>
            <ul className={styles.cards}>
              {c.guides.map((id) => {
                const g = guideMap[id];
                if (!g) return null;
                return (
                  <li key={id} data-ch-card="">
                    <Link href={g.href} className={styles.card} data-tilt="">
                      <span className={styles.cardIcon}><GuideIcon name={g.iconName} strokeWidth={1.6} /></span>
                      <span className={styles.cardText}><strong>{g.title}</strong><span>{g.desc}</span></span>
                      <ArrowUpRight className={styles.cardArrow} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
              {c.extra && (
                <li data-ch-card="">
                  <Link href={c.extra.href} className={`${styles.card} ${styles.cardGhost}`} data-tilt="">
                    <span className={styles.cardIcon}><Zap aria-hidden="true" strokeWidth={1.6} /></span>
                    <span className={styles.cardText}><strong>{c.extra.label}</strong></span>
                    <ArrowUpRight className={styles.cardArrow} aria-hidden="true" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </article>
      ))}

      <MiniMap chapters={chapters} crop={crop} img={miniImg} night={nightSeen ? miniImg.replace('.webp', '-night.webp') : null}
        active={active} visible={visible} label={copy.chaptersKicker} />
    </section>
  );
}
