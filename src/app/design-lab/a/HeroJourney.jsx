'use client';

import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useMotion } from './SkyRoot';
import { FrameSequence, loadManifest } from './sequence';
import sky from './sky.module.css';
import s from './hero.module.css';
import fx from './heroFx.module.css';
import nw from './heroNow.module.css';

const SEQ_END = 0.84; // 이 지점에서 서울 착지(마지막 프레임)

function formatCoord(lat, lon) {
  const dm = (v) => {
    const d = Math.floor(v);
    const m = Math.round((v - d) * 60);
    return `${d}°${String(m).padStart(2, '0')}′`;
  };
  return `${dm(lat)}N  ${dm(lon)}E`;
}

// 서버에서 글자 단위로 쪼개 둔다 → JS 없이도 CSS 등장 애니메이션
function SplitTitle({ lines }) {
  let i = 0;
  return lines.map((line, li) => (
    <span key={li} className={s.titleLine}>
      {line.split(' ').map((word, wi, arr) => (
        <span key={wi} className={s.word}>
          {[...word].map((c, ci) => (
            <span key={ci} className={s.ch}>
              <span className={`${s.chi} ${li === 1 ? s.accent : ''}`} style={{ '--i': i++ }}>{c}</span>
            </span>
          ))}
          {wi < arr.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  ));
}

export default function HeroJourney({ hero, situationsHeading, situations, copy, route, asset }) {
  const { mode, portrait } = useMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mode !== 'full') return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const q = gsap.utils.selector(section);
    const stage = q(`.${s.stage}`)[0];
    const screen2 = q(`.${s.screen2}`)[0];
    const hudCity = q(`.${fx.hudCity}`)[0];
    const hudCoord = q(`.${fx.hudCoord}`)[0];
    const hudBar = q(`.${fx.hudBar}`)[0];

    let seq = null;
    let raf = 0;
    let alive = true;
    let active = true;
    let progress = 0;

    const lerp = gsap.utils.interpolate;
    const updateHud = (p) => {
      const t = gsap.utils.clamp(0, 1, (p - 0.08) / (SEQ_END - 0.14));
      const e = t * t * (3 - 2 * t);
      hudCoord.textContent = formatCoord(lerp(route.from.lat, route.to.lat, e), lerp(route.from.lon, route.to.lon, e));
      const city = t < 0.55 ? route.from.city : route.to.city;
      if (hudCity.textContent !== city) hudCity.textContent = city;
      hudBar.style.setProperty('--p', t.toFixed(3));
    };

    const ctx = gsap.context(() => {
      const chars = q(`.${s.ch}`);
      const introRest = q(`.${s.eyebrow}, .${s.lead}, .${s.cta}`);
      const lineBWords = q(`.${fx.lineBWord} > span`);
      const navH = parseFloat(getComputedStyle(stage).top) || 64;

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
            updateHud(progress);
            // 시퀀스가 아직 없으면 착지 구간에서 서울 정지 이미지로 대체 (필요할 때만 표시·로딩)
            const fallback = !seq?.endReady && progress > 0.62;
            screen2.style.display = fallback ? 'block' : '';
            screen2.style.opacity = fallback ? gsap.utils.clamp(0, 1, (progress - 0.7) / 0.14) : '';
          },
        },
      });

      // 1) 상승: 제목이 하늘로 흩어짐
      tl.to(q(`.${fx.cue}`), { autoAlpha: 0, duration: 0.03 }, 0)
        .to(chars, {
          yPercent: -140, autoAlpha: 0, filter: 'blur(10px)', rotate: () => gsap.utils.random(-12, 12),
          duration: 0.12, ease: 'power2.in', stagger: { each: 0.004, from: 'random' },
        }, 0.03)
        .to(introRest, { y: -36, autoAlpha: 0, duration: 0.08, stagger: 0.012, ease: 'power1.in' }, 0.02)
        // 2) 안개 속: Мөнх хөх тэнгэр
        .fromTo(q(`.${fx.lineA}`), { autoAlpha: 0, letterSpacing: '0.9em' }, { autoAlpha: 1, letterSpacing: '0.5em', duration: 0.09, ease: 'power2.out' }, 0.17)
        .to(q(`.${fx.lineA}`), { autoAlpha: 0, y: -24, duration: 0.06, ease: 'power1.in' }, 0.3)
        // 3) 운해 위: Нэг тэнгэр дор
        .fromTo(q(`.${fx.lineB}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.35)
        .fromTo(lineBWords, { yPercent: 115 }, { yPercent: 0, duration: 0.1, stagger: 0.025, ease: 'power3.out' }, 0.35)
        .fromTo(q(`.${fx.lineBRoute}`), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.43)
        .to(q(`.${fx.lineB}`), { autoAlpha: 0, scale: 1.08, filter: 'blur(8px)', duration: 0.08, ease: 'power1.in' }, 0.56)
        // 4) 서울 착지: 유리 패널 + 제목 하강 + 지금 필요한 것
        .fromTo(q(`.${s.panelBg}`), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.1, ease: 'power3.out' }, 0.8)
        .to(chars, {
          yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', rotate: 0,
          duration: 0.1, ease: 'power3.out', stagger: { each: 0.003, from: 'start' },
        }, 0.81)
        .to(portrait ? q(`.${s.eyebrow}`) : introRest, { y: 0, autoAlpha: 1, duration: 0.07, stagger: 0.012, ease: 'power2.out' }, 0.85)
        .fromTo(q(`.${s.landing}`), { autoAlpha: 0, y: portrait ? 40 : 0 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.86)
        .fromTo(q(`.${nw.situations} li`), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.01, ease: 'power2.out' }, 0.88)
        .to({}, { duration: 0.01 }, 0.99);
    }, section);

    // 시퀀스는 첫 화면 이후(페이지 load + idle) 점진 로딩
    const base = `${asset}/${portrait ? 'seq-hero-m' : 'seq-hero'}`;
    const start = async () => {
      try {
        const manifest = await loadManifest(base);
        if (!alive) return;
        seq = new FrameSequence(canvas, base, manifest, {
          onFirstFrame: () => canvas.classList.add(s.ready),
        });
        seq.seek(progress / SEQ_END);
        seq.load(portrait ? 4 : 6);
      } catch {
        // 시퀀스 실패 → 정지 이미지 유지
      }
    };
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const kick = () => idle(start);
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });

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
      window.removeEventListener('load', kick);
      seq?.destroy();
      canvas.classList.remove(s.ready);
      screen2.style.opacity = '';
      screen2.style.display = '';
      ctx.revert();
    };
  }, [mode, portrait, asset, route]);

  return (
    <section ref={sectionRef} className={s.hero} data-sky-stop="dawn" aria-labelledby="a-title">
      <div className={s.stage}>
        <div className={s.screen1}>
          <picture className={s.media}>
            <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k1-m.webp`} width={828} height={1471} />
            <img src={`${asset}/k1.webp`} alt="" width={1672} height={941} fetchPriority="high" />
          </picture>
          <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
          <div className={s.veil} aria-hidden="true" />
        </div>

        <div className={s.screen2}>
          <picture className={s.media}>
            <source media="(max-aspect-ratio: 3/4)" srcSet={`${asset}/k3-m.webp`} width={828} height={1471} />
            <img src={`${asset}/k3.webp`} alt="" width={1672} height={941} loading="lazy" />
          </picture>
          <div className={s.veil} aria-hidden="true" />
        </div>

        <div className={s.content}>
          <div className={`${s.panelBg} ${sky.glass}`} aria-hidden="true" />
          <header className={s.intro}>
            <p className={`${s.eyebrow} ${s.fadeUp}`} style={{ '--d': '80ms' }}>
              <span className={s.rule} aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <h1 id="a-title" className={s.title}>
              <span className={sky.srOnly}>{hero.title}</span>
              <span aria-hidden="true"><SplitTitle lines={hero.titleLines} /></span>
            </h1>
            <p className={`${s.lead} ${s.fadeUp}`} style={{ '--d': '700ms' }}>{hero.lead}</p>
            <a href={hero.cta.href} className={`${s.cta} ${s.fadeUp}`} style={{ '--d': '850ms' }}>
              {hero.cta.label}
              <ArrowDown aria-hidden="true" />
            </a>
          </header>

          <div className={`${s.landing} ${sky.glass}`}>
            <h2 className={nw.nowTitle}>{situationsHeading}</h2>
            <ul className={nw.situations}>
              {situations.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className={nw.situation}>
                    <span className={nw.emoji} aria-hidden="true">{item.emoji}</span>
                    <span>{item.label}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={fx.lines} aria-hidden="true">
          <p className={fx.lineA}>{copy.skyKicker}</p>
          <div className={fx.lineB}>
            <p className={fx.lineBTitle}>
              {copy.skyTitle.split(' ').map((w, i, arr) => (
                <Fragment key={w}>
                  <span className={fx.lineBWord}><span>{w}</span></span>
                  {i < arr.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </p>
            <p className={fx.lineBRoute}>{copy.skyRoute}</p>
          </div>
        </div>

        <div className={fx.hud} aria-hidden="true">
          <span className={fx.hudCity}>{route.from.city}</span>
          <span className={fx.hudCoord}>{formatCoord(route.from.lat, route.from.lon)}</span>
          <span className={fx.hudBar}><i /></span>
        </div>

        <p className={fx.cue} aria-hidden="true">
          <span>{copy.scrollCue}</span>
          <i />
        </p>
      </div>
      <div className={fx.skyEnd} data-sky-stop="blue" aria-hidden="true" />
    </section>
  );
}
