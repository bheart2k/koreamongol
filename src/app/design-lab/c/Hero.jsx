'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Plane } from 'lucide-react';
import { createSequence, prefersLightAssets } from './frameSequence';
import { Pins, PinSheet, PlaceChips } from './MapPins';
import { Art, DayNightToggle, PORTRAIT, Title } from './HeroParts';
import styles from './hero.module.css';
import cx from './heroCopy.module.css';
import ux from './heroUi.module.css';

gsap.registerPlugin(ScrollTrigger);

const SEQ_END = 0.74; // 스크롤 진행도 중 플라이스루가 차지하는 구간
const SETTLE = SEQ_END + 0.03;

export default function Hero({ hero, art, places, guideMap, copy, alts }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(null);
  const [settledState, setSettledState] = useState(false); // 정착 전에는 핀·칩을 inert 로 (키보드 포커스 차단)
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);
  const tiltRef = useRef(null);
  const canvasRef = useRef(null);
  const routeRef = useRef(null);
  const night = mounted && resolvedTheme === 'dark';
  // 밤 장면은 다크 테마를 실제로 쓸 때만 받는다 (라이트 첫 방문 용량 절약)
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (night) setNightSeen(true); }, [night]);
  const kind = portrait ? art.mobile : art.desktop;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia(PORTRAIT);
    const rq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setPortrait(mq.matches); setReduced(rq.matches); };
    update();
    mq.addEventListener('change', update);
    rq.addEventListener('change', update);
    return () => { mq.removeEventListener('change', update); rq.removeEventListener('change', update); };
  }, []);

  // Esc 로 핀 카드 닫기
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // 스크롤 연출: 문구 퇴장 → 플라이스루(캔버스) → 정착 → 핀 등장
  useEffect(() => {
    if (!mounted || reduced) return undefined;
    let seq = null;
    let ctx = null;
    let cancelled = false;
    const stage = stageRef.current;
    const box = boxRef.current;
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) * 16 || 64;

    const build = (useSeq) => {
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(stage);
        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        tl.to(q('[data-char]'), { yPercent: -118, rotate: -4, opacity: 0, stagger: 0.0028, duration: 0.09, ease: 'power2.in' }, 0.015)
          .to(q('[data-fade]'), { y: -28, opacity: 0, duration: 0.08, stagger: 0.012, ease: 'power2.in' }, 0.015)
          .to(q('[data-cue]'), { y: 20, opacity: 0, duration: 0.05 }, 0)
          .to(routeRef.current, { opacity: 1, duration: 0.04 }, 0.06)
          .to(routeRef.current, { opacity: 0, duration: 0.04 }, SEQ_END - 0.02);
        if (!useSeq) {
          // 정지 이미지 전환: 전경을 서울 섬 쪽으로 밀고 들어가며 정착 장면으로 교차
          const origin = portrait ? '62% 74%' : '72% 60%';
          // 교차 순간 구름층을 통과하듯 초점이 풀렸다가(블러 + 옅은 베일) 정착 장면에서 다시 맺힌다
          gsap.set(q('[data-settle]'), { scale: 1.12, opacity: 0, filter: 'blur(7px)' });
          tl.to(q('[data-start]'), { scale: 1.55, transformOrigin: origin, duration: SEQ_END, ease: 'power1.in' }, 0)
            .to(q('[data-start]'), { opacity: 0, filter: 'blur(5px)', duration: 0.16 }, SEQ_END - 0.18)
            .to(q('[data-settle]'), { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' }, SEQ_END - 0.2)
            .fromTo(q('[data-veil]'), { opacity: 0 }, { opacity: 0.45, duration: 0.09, ease: 'sine.inOut', yoyo: true, repeat: 1 }, SEQ_END - 0.21);
        } else {
          // 시퀀스 끝 프레임 → 정착 이미지(핀 좌표 기준)로 교차. 영상 크롭 차이(약 1%)는 살짝 줄어드는 스케일로 흡수
          gsap.set(q('[data-settle]'), { opacity: 0, scale: 1.012 });
          tl.to(q('[data-settle]'), { opacity: 1, scale: 1, duration: 0.05, ease: 'power1.out' }, SEQ_END - 0.02);
        }
        gsap.set(q('[data-pin]'), { scale: 0, opacity: 0 });
        gsap.set(q('[data-map-ui]'), { y: 26, opacity: 0 });
        tl.to(q('[data-pin]'), { scale: 1, opacity: 1, duration: 0.05, stagger: 0.007, ease: 'back.out(2.6)' }, SETTLE)
          .to(q('[data-map-ui]'), { y: 0, opacity: 1, duration: 0.06, stagger: 0.015, ease: 'power3.out' }, SETTLE + 0.02)
          .to({}, { duration: 0.001 }, 1);

        let settled = false;
        ScrollTrigger.create({
          trigger: trackRef.current,
          start: () => `top top+=${navH()}`,
          end: 'bottom bottom',
          scrub: true,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const sp = Math.min(1, p / SEQ_END);
            routeRef.current?.style.setProperty('--route', sp.toFixed(3));
            if (seq) box.dataset.seq = seq.draw(sp) && p > 0.004 && p < SEQ_END + 0.03 ? 'on' : 'off';
            const now = p >= SETTLE;
            if (now !== settled) {
              settled = now;
              if (now) stage.dataset.settled = '';
              else { delete stage.dataset.settled; setActive(null); }
              setSettledState(now);
            }
          },
        });
      }, stage);
    };

    (async () => {
      const base = night ? kind.seq.night : kind.seq.day;
      let useSeq = Boolean(base) && !prefersLightAssets();
      if (useSeq) {
        try {
          seq = await createSequence(base, canvasRef.current);
        } catch {
          useSeq = false;
        }
      }
      if (cancelled) { seq?.destroy(); return; }
      build(useSeq);
      if (seq) {
        // 첫 화면 이후 유휴 시간에 점진 로딩
        const start = () => seq?.load(portrait ? 3 : 4);
        if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
        else setTimeout(start, 400);
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      seq?.destroy();
      if (box) delete box.dataset.seq;
      if (stage) delete stage.dataset.settled;
      setSettledState(false);
    };
  }, [mounted, reduced, portrait, night, kind]);

  // 미세 틸트 패럴랙스: 데스크톱은 마우스, 세로 화면은 자이로(권한 요청이 필요 없는 기기만)
  useEffect(() => {
    if (!mounted || reduced) return undefined;
    const stage = stageRef.current;
    const rx = gsap.quickTo(tiltRef.current, 'rotationX', { duration: 1.1, ease: 'power3.out' });
    const ry = gsap.quickTo(tiltRef.current, 'rotationY', { duration: 1.1, ease: 'power3.out' });
    if (portrait) {
      const DOE = window.DeviceOrientationEvent;
      if (!DOE || typeof DOE.requestPermission === 'function') return undefined;
      let base = null;
      const onOrient = (e) => {
        if (e.beta == null || e.gamma == null) return;
        base ??= { b: e.beta, g: e.gamma };
        ry(gsap.utils.clamp(-3, 3, (e.gamma - base.g) * 0.12));
        rx(gsap.utils.clamp(-2.5, 2.5, -(e.beta - base.b) * 0.1));
      };
      window.addEventListener('deviceorientation', onOrient);
      return () => window.removeEventListener('deviceorientation', onOrient);
    }
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 3.2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 2.4);
    };
    const onLeave = () => { rx(0); ry(0); };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); };
  }, [mounted, reduced, portrait]);

  const toggle = <DayNightToggle night={night} mounted={mounted} setTheme={setTheme} copy={copy} />;

  const mapUi = (interactive) => (
    <div inert={!interactive || undefined} style={{ display: 'contents' }}>
      <div className={ux.mapHead} data-map-ui="">
        <p className={ux.mapTitle}>{copy.mapTitle}</p>
        <p className={ux.mapHint}>{copy.mapHint}</p>
      </div>
      <div className={ux.chipsBar} data-map-ui="">
        <PlaceChips places={places} active={active} setActive={setActive} label={copy.mapTitle} />
      </div>
      {portrait && <PinSheet places={places} guideMap={guideMap} active={active} setActive={setActive} closeLabel={copy.close} />}
    </div>
  );

  const pins = (interactive) => <Pins places={places} guideMap={guideMap} active={active} setActive={setActive} portrait={portrait} inert={!interactive} />;

  return (
    <section className={styles.hero} aria-labelledby="c-title" data-static={reduced || undefined}>
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage} data-stage="">
          <div className={styles.sky} />
          <div className={`${styles.sky} ${styles.skyNight}`} />
          <div className={styles.tilt}>
            <div ref={tiltRef} className={styles.tiltInner}>
              <div ref={boxRef} className={styles.box}>
                <div className={`${styles.group} ${styles.startGroup}`} data-start="">
                  <Art desktop={art.desktop.start} mobile={art.mobile.start} alt={alts.start} priority withNight={nightSeen} />
                </div>
                <canvas ref={canvasRef} className={`${styles.art} ${styles.canvas}`} aria-hidden="true" />
                <div className={styles.veil} data-veil="" aria-hidden="true" />
                {!reduced && (
                  <div className={`${styles.group} ${styles.settleGroup}`} data-settle="">
                    <Art desktop={art.desktop.settle} mobile={art.mobile.settle} alt={alts.settle} withNight={nightSeen} />
                  </div>
                )}
                {!reduced && pins(settledState)}
              </div>
            </div>
          </div>

          <div className={cx.copy}>
            <span className={cx.scrim} data-fade="" aria-hidden="true" />
            <p className={cx.eyebrow} data-fade="">{hero.eyebrow}</p>
            <Title lines={hero.titleLines} srText={hero.title} />
            <p className={cx.lead} data-fade="">{hero.lead}</p>
          </div>

          <div className={cx.bottom}>
            <div data-fade="">
              <Link href={hero.cta.href} className={cx.cta} data-magnetic="">
                {hero.cta.label}
                <span className={cx.ctaIcon}><ArrowRight aria-hidden="true" /></span>
              </Link>
            </div>
            <p className={cx.cue} data-cue=""><span className={cx.cueLine} aria-hidden="true" />{copy.scrollCue}</p>
          </div>

          <div ref={routeRef} className={ux.route} aria-hidden="true">
            <span>Улаанбаатар</span>
            <span className={ux.routeTrack}><span className={ux.routeFill} /><Plane className={ux.routePlane} /></span>
            <span>Сөүл</span>
          </div>

          {toggle}
          {!reduced && mapUi(settledState)}
        </div>

        {reduced && (
          <div className={`${styles.stage} ${styles.mapStatic}`} data-stage="" data-settled="" data-static-map="">
            <div className={styles.sky} />
            <div className={`${styles.sky} ${styles.skyNight}`} />
            <div className={styles.tilt}>
              <div className={styles.tiltInner}>
                <div className={styles.box}>
                  <div className={`${styles.group} ${styles.settleGroup}`}>
                    <Art desktop={art.desktop.settle} mobile={art.mobile.settle} alt={alts.settle} withNight={nightSeen} />
                  </div>
                  {pins(true)}
                </div>
              </div>
            </div>
            {mapUi(true)}
          </div>
        )}
      </div>
    </section>
  );
}
