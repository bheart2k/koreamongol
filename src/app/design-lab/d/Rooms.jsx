'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Zap } from 'lucide-react';
import { GuideIcon } from './icons';
import FloorPlan from './FloorPlan';
import base from './d.module.css';
import styles from './rooms.module.css';

gsap.registerPlugin(ScrollTrigger);

// 클로즈업: 모바일 828w / 데스크톱 1440w
// 4:3 프레임에 16:9 원본을 cover 로 채우므로 실제 그려지는 폭은 프레임 폭의 1.34배
const SIZES = '(max-width: 1023px) calc((100vw - 32px) * 1.34), 910px';
const srcSet = (src) => `${src.replace('.webp', '-m.webp')} 828w, ${src} 1672w`;
const nightOf = (src) => src.replace('.webp', '-night.webp');

function GuideRows({ room, guideMap }) {
  return (
    <ul className={styles.rows}>
      {room.guides.map((id) => {
        const g = guideMap[id];
        if (!g) return null;
        return (
          <li key={id} data-room-row="">
            <Link href={g.href} className={styles.row}>
              <span className={styles.rowIcon}><GuideIcon name={g.iconName} strokeWidth={1.5} /></span>
              <span className={styles.rowText}><strong>{g.title}</strong><span>{g.desc}</span></span>
              <ArrowUpRight className={styles.rowArrow} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
      {room.extra && (
        <li data-room-row="">
          <Link href={room.extra.href} className={styles.row}>
            <span className={styles.rowIcon}><Zap aria-hidden="true" strokeWidth={1.5} /></span>
            <span className={styles.rowText}><strong>{room.extra.label}</strong></span>
            <ArrowUpRight className={styles.rowArrow} aria-hidden="true" />
          </Link>
        </li>
      )}
    </ul>
  );
}

export default function Rooms({ rooms, guideMap, copy, crop, planImg, alts }) {
  const rootRef = useRef(null);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (resolvedTheme === 'dark') setNightSeen(true); }, [resolvedTheme]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const arts = gsap.utils.toArray('[data-room]');
      ScrollTrigger.create({
        trigger: arts[0],
        endTrigger: arts[arts.length - 1],
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => setVisible(self.isActive),
      });
      arts.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => { if (self.isActive) setActive(i); },
        });
        if (reduced) return;
        const q = gsap.utils.selector(el);
        const dir = el.dataset.side === 'right' ? -1 : 1;
        // 조명이 켜지듯: 세로 슬릿에서 벽면 전체로 열리고, 그림자가 길게 드리워진다
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 72%', once: true } })
          .fromTo(q('[data-room-frame]'), { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
          .fromTo(q('[data-room-img]'), { scale: 1.22, filter: 'brightness(0.55)' }, { scale: 1, filter: 'brightness(1)', duration: 2, ease: 'expo.out' }, 0.2)
          .fromTo(q('[data-room-sweep]'), { xPercent: -120 * dir }, { xPercent: 120 * dir, duration: 1.6, ease: 'power2.inOut' }, 0.35)
          .fromTo(q('[data-room-shadow]'), { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: 26 * dir, y: 30, duration: 1.8, ease: 'expo.out' }, 0.5)
          .from(q('[data-room-no]'), { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.2)
          .from(q('[data-room-rule]'), { scaleX: 0, duration: 1.1, ease: 'expo.inOut' }, 0.3)
          .from(q('[data-room-title] > span'), { yPercent: 110, duration: 1.1, ease: 'expo.out' }, 0.4)
          .from(q('[data-room-line]'), { y: 18, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.55)
          .from(q('[data-room-row]'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.65);
        // 스크롤하는 동안 조명이 천천히 움직이며 그림자가 따라 돈다
        gsap.fromTo(q('[data-room-shadow-wrap]'), { x: -14 * dir }, {
          x: 14 * dir, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.rooms} aria-labelledby="d-rooms">
      <header className={`${base.wrap} ${styles.head}`} data-reveal="rise">
        <p className={base.kicker}>{copy.roomsKicker}</p>
        <h2 id="d-rooms" className={styles.headTitle}>{copy.roomsTitle}</h2>
      </header>

      {rooms.map((r, i) => (
        <article key={r.id} id={`room-${r.no}`} className={`${base.wrap} ${styles.room}`} data-side={i % 2 ? 'right' : 'left'}
          data-room="" aria-labelledby={`d-room-${r.id}`}>
          <div className={styles.media}>
            <div className={styles.shadowWrap} data-room-shadow-wrap="" aria-hidden="true">
              <span className={styles.shadow} data-room-shadow="" />
            </div>
            <div className={styles.frame} data-room-frame="">
              <img src={r.img} srcSet={srcSet(r.img)} sizes={SIZES} alt={alts[r.id] || ''} loading="lazy"
                decoding="async" className={styles.img} data-room-img="" />
              {/* 야간 조명: .dark 에서 낮 장면 위로 크로스페이드 */}
              {nightSeen && (
                <img src={nightOf(r.img)} srcSet={srcSet(nightOf(r.img))} sizes={SIZES} alt="" aria-hidden="true"
                  loading="lazy" decoding="async" className={`${styles.img} ${styles.night}`}
                  onLoad={(e) => { e.currentTarget.dataset.loaded = ''; }} />
              )}
              <span className={styles.sweep} data-room-sweep="" aria-hidden="true" />
            </div>
          </div>

          <div className={styles.text}>
            <p className={styles.no} data-room-no="">
              <span>{copy.room}</span><strong>{r.no}</strong>
            </p>
            <span className={styles.rule} data-room-rule="" aria-hidden="true" />
            <h3 id={`d-room-${r.id}`} className={styles.title} data-room-title="">
              <span>{r.title}</span>
            </h3>
            <p className={styles.line} data-room-line="">{r.line}</p>
            <GuideRows room={r} guideMap={guideMap} />
          </div>
        </article>
      ))}

      <FloorPlan rooms={rooms} crop={crop} img={planImg} night={nightSeen ? nightOf(planImg) : null}
        active={active} visible={visible} label={copy.plan} roomLabel={copy.room} />
    </section>
  );
}
