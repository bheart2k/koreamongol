'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { useMotion } from './SkyRoot';
import { setupStack, setupWideTrack } from './chapterMotion';
import c from './chapters.module.css';
import u from './chapterUi.module.css';
import l from './chapterLinks.module.css';

// 5초 넘게 자동 재생되는 루프 영상의 일시정지 (WCAG 2.2.2)
function PauseButton({ paused, onToggle, labels }) {
  const label = paused ? labels.play : labels.pause;
  return (
    <button type="button" className={u.pause} onClick={onToggle} aria-pressed={paused} aria-label={label} title={label}>
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  );
}

export default function ChapterTrack({ chapters, section, labels, asset }) {
  const { mode, wide } = useMotion();
  const sectionRef = useRef(null);
  const glCanvasRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const videosRef = useRef([]);
  const n = chapters.length;
  const stack = mode === 'full' && !wide;
  const togglePause = () => setPaused((p) => !p);

  useEffect(() => {
    pausedRef.current = paused;
    videosRef.current.forEach((v) => {
      if (paused) v.pause();
      else if (v.dataset.active === '1') v.play().catch(() => {});
    });
  }, [paused]);

  useEffect(() => {
    if (mode !== 'full') return;
    const q = gsap.utils.selector(sectionRef.current);
    const isPaused = () => pausedRef.current;
    const { videos, cleanup } = wide
      ? setupWideTrack({
        chapters,
        asset,
        isPaused,
        els: {
          section: sectionRef.current,
          stage: q(`.${c.stage}`)[0],
          track: q(`.${c.track}`)[0],
          panels: q(`.${c.panel}`),
          nums: q(`.${c.bigNo}`),
          bodies: q(`.${c.body}`),
          counterNow: q(`.${u.counterNow}`)[0],
          bar: q(`.${u.progress}`)[0],
          canvas: glCanvasRef.current,
          glOnClass: c.glOn,
        },
      })
      : setupStack({
        isPaused,
        els: {
          section: sectionRef.current,
          panels: q(`.${c.panel}`),
          inners: q(`.${c.inner}`),
          titleSpans: q(`.${c.titleWord} > span`),
        },
      });
    videosRef.current = videos;
    return () => {
      videosRef.current = [];
      cleanup();
    };
  }, [mode, wide, chapters, asset]);

  return (
    <section ref={sectionRef} id={section.id} className={c.chapters} aria-labelledby="a-guides-title" style={{ '--n': n }}>
      <div className={`${c.skyMark} ${c.skyMarkStart}`} data-sky-stop="day" aria-hidden="true" />
      <div className={c.stage}>
        <canvas ref={glCanvasRef} className={c.gl} aria-hidden="true" />
        <div className={c.glShade} aria-hidden="true" />
        <header className={u.head}>
          <h2 id="a-guides-title" className={u.headTitle}>{section.title}</h2>
          <p className={u.headSub}>{section.subtitle}</p>
          <p className={u.counter} aria-hidden="true">
            <span className={u.counterNow}>{chapters[0].no}</span>
            <span>/ {chapters[n - 1].no}</span>
          </p>
        </header>

        <div className={c.track}>
          {chapters.map((ch) => (
            <article key={ch.id} className={c.panel} aria-labelledby={`a-ch-${ch.id}`}>
              <div className={c.inner}>
                <div className={c.media}>
                  <picture>
                    <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/${ch.media}-m.webp`} />
                    <img src={`${asset}/${ch.media}.webp`} alt="" crossOrigin="anonymous" width={1672} height={941} loading="lazy" decoding="async" />
                  </picture>
                  {stack ? (
                    <video
                      crossOrigin="anonymous"
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={`${asset}/${ch.media}-m.webp`}
                      src={`${asset}/${ch.media}-loop-m.mp4`}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <div className={c.shade} aria-hidden="true" />
                <span className={c.bigNo} aria-hidden="true">{ch.no}</span>
                <div className={c.body}>
                  <p className={c.kicker}>
                    <span>{ch.no}</span>
                    <span className={c.dot} aria-hidden="true" />
                    <time>{ch.time}</time>
                  </p>
                  <h3 id={`a-ch-${ch.id}`} className={c.title}>
                    {ch.title.split(' ').map((w, i, arr) => (
                      <Fragment key={i}>
                        <span className={c.titleWord}><span>{w}</span></span>
                        {i < arr.length - 1 ? ' ' : null}
                      </Fragment>
                    ))}
                  </h3>
                  <ul className={l.links}>
                    {ch.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={l.link}>
                          <span className={l.linkTitle}>{link.title}</span>
                          {link.desc ? <span className={l.linkDesc}>{link.desc}</span> : null}
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {stack ? <PauseButton paused={paused} onToggle={togglePause} labels={labels} /> : null}
              </div>
            </article>
          ))}
        </div>

        <div className={u.progress} aria-hidden="true"><i /></div>
        {mode === 'full' && wide ? <PauseButton paused={paused} onToggle={togglePause} labels={labels} /> : null}
      </div>
      <div className={`${c.skyMark} ${c.skyMarkEnd}`} data-sky-stop="golden" aria-hidden="true" />
    </section>
  );
}
