'use client';

import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Heart } from 'lucide-react';
import { useMotion } from './SkyRoot';
import sky from './sky.module.css';
import f from './finale.module.css';

// 마무리 — 고정 없이 짧게: 서울의 밤(K4)이 스크롤에 따라 은하수 아래 게르(K5)로 크로스페이드
export default function Finale({ line, community, donate, asset }) {
  const { mode } = useMotion();
  const ref = useRef(null);

  useEffect(() => {
    if (mode !== 'full') return;
    const q = gsap.utils.selector(ref.current);
    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 45%', scrub: true },
      })
        .fromTo(q(`.${f.night}`), { scale: 1.12 }, { scale: 1.02 }, 0)
        .fromTo(q(`.${f.stars}`), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1 }, 0.35);
      gsap.from(q(`.${f.word} > span`), {
        yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: q(`.${f.line}`)[0], start: 'top 80%' },
      });
      gsap.from(q(`.${f.card}`), {
        y: 36, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: q(`.${f.ctas}`)[0], start: 'top 90%' },
      });
    }, ref);
    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={ref} className={f.finale} aria-labelledby="e-finale-title">
      <div className={f.skyMark} data-sky-stop="night" aria-hidden="true" />
      <div className={f.media} aria-hidden="true">
        <picture className={f.night}>
          <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k4-m.webp`} />
          <img src={`${asset}/k4.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" />
        </picture>
        <picture className={f.stars}>
          <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k5-m.webp`} />
          <img src={`${asset}/k5.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" />
        </picture>
        <div className={f.veil} />
      </div>

      <div className={f.inner}>
        <h2 id="e-finale-title" className={f.line}>
          {line.split(' ').map((w, i, arr) => (
            <Fragment key={i}>
              <span className={f.word}><span>{w}</span></span>
              {i < arr.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </h2>

        <div className={f.ctas}>
          <Link href={community.href} className={`${f.card} ${sky.glass}`}>
            <div>
              <h3 className={f.cardTitle}>{community.title}</h3>
              <p className={f.cardText}>{community.desc}</p>
            </div>
            <span className={f.cardFoot}><ArrowRight aria-hidden="true" /></span>
          </Link>
          <Link href={donate.link.href} className={`${f.card} ${sky.glass}`}>
            <p className={f.cardText}><strong>{donate.strong}</strong> {donate.text}</p>
            <span className={`${f.cardFoot} ${f.donateBtn}`}>
              <Heart aria-hidden="true" />
              {donate.link.label}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
