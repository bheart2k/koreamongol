'use client';

import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Heart } from 'lucide-react';
import { useMotion } from './SkyRoot';
import { FrameSequence, loadManifest } from './sequence';
import sky from './sky.module.css';
import f from './finale.module.css';

const SEQ_END = 0.78;

export default function Finale({ line, community, donate, asset }) {
  const { mode, portrait } = useMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mode !== 'full') return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const q = gsap.utils.selector(section);
    const stage = q(`.${f.stage}`)[0];
    const endStill = q(`.${f.mediaEnd}`)[0];
    let seq = null;
    let raf = 0;
    let alive = true;
    let active = false;
    let progress = 0;
    let started = false;

    const start = async () => {
      if (started) return;
      started = true;
      const base = `${asset}/${portrait ? 'seq-finale-m' : 'seq-finale'}`;
      try {
        const manifest = await loadManifest(base);
        if (!alive) return;
        seq = new FrameSequence(canvas, base, manifest, { onFirstFrame: () => canvas.classList.add(f.ready) });
        seq.seek(progress / SEQ_END);
        seq.load(portrait ? 3 : 5);
      } catch {
        // 실패 시 정지 이미지 유지
      }
    };

    const ctx = gsap.context(() => {
      const navH = parseFloat(getComputedStyle(stage).top) || 64;
      // 섹션에 가까워지면 시퀀스 로딩 시작
      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 400%', onEnter: start } });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: `top ${navH}px`,
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            progress = self.progress;
            seq?.seek(progress / SEQ_END);
            // 시퀀스가 아직 없으면 은하수 정지 이미지로 대체 (필요할 때만 표시·로딩)
            const fallback = !seq?.endReady && progress > 0.5;
            endStill.style.display = fallback ? 'block' : '';
            endStill.style.opacity = fallback ? gsap.utils.clamp(0, 1, (progress - 0.55) / 0.2) : '';
          },
        },
      });
      tl.fromTo(q(`.${f.word} > span`), { yPercent: 115 }, { yPercent: 0, duration: 0.14, stagger: 0.025, ease: 'power3.out' }, 0.2)
        .to(q(`.${f.line}`), { y: () => -stage.clientHeight * 0.04, duration: 0.2 }, 0.5)
        .fromTo(q(`.${f.card}`), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.04, ease: 'power3.out' }, 0.76)
        .to({}, { duration: 0.01 }, 0.99);
    }, section);

    const loop = () => {
      if (active) seq?.render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => seq?.resize());
    ro.observe(canvas);
    // 화면에 보이는 동안 렌더 (트리거 끝에 정확히 멈춰도 마지막 프레임까지 그림)
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; });
    io.observe(canvas);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      seq?.destroy();
      canvas.classList.remove(f.ready);
      endStill.style.display = '';
      endStill.style.opacity = '';
      ctx.revert();
    };
  }, [mode, portrait, asset]);

  return (
    <section ref={sectionRef} className={f.finale} aria-labelledby="a-finale-title">
      <div className={`${f.skyMark} ${f.skyMarkStart}`} data-sky-stop="night" aria-hidden="true" />
      <div className={f.stage}>
        {/* 정적 모드: 은하수 아래 게르 / full 모드: 서울 야경에서 시작 */}
        <picture className={`${f.media} ${f.mediaEnd}`}>
          <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k5-m.webp`} />
          <img src={`${asset}/k5.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" />
        </picture>
        <picture className={`${f.media} ${f.mediaStart}`}>
          <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k4-m.webp`} />
          <img src={`${asset}/k4.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" />
        </picture>
        <canvas ref={canvasRef} className={f.canvas} aria-hidden="true" />
        <div className={f.veil} aria-hidden="true" />

        <h2 id="a-finale-title" className={f.line}>
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
