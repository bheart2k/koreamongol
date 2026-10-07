'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useMotion } from './SkyRoot';
import x from './sections.module.css';

// 단어 단위로 쪼개 두고, 스크롤에 따라 하나씩 불이 켜지듯 밝아짐
function Words({ text }) {
  return text.split(' ').map((w, i, arr) => (
    <span key={i} className={x.w}>{w}{i < arr.length - 1 ? ' ' : ''}</span>
  ));
}

export default function AboutSection({ about }) {
  const { mode } = useMotion();
  const ref = useRef(null);
  const [lead, quote] = about.paragraphs;

  useEffect(() => {
    if (mode !== 'full') return;
    const ctx = gsap.context(() => {
      gsap.to(`.${x.w}`, {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={ref} className={`${x.section} ${x.about}`} aria-labelledby="a-about-title">
      <div className={x.skyMarkTop} data-sky-stop="dusk" aria-hidden="true" />
      <div className={x.wrap}>
        <h2 id="a-about-title" className={x.label}>{about.title}</h2>
        <p className={x.aboutLead}><Words text={lead} /></p>
        <p className={x.aboutQuote}><Words text={quote} /></p>
        <Link href={about.link.href} className={x.textLink}>
          {about.link.label}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
