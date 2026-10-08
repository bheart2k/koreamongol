'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ArrowRight, MapPin, Pause, Play } from 'lucide-react';
import { Pins, PinSheet, PlaceChips } from './MapPins';
import { Art, DayNightToggle, PORTRAIT } from './HeroParts';
import HeroMotion from './HeroMotion';
import { prefersSaveData } from './connection';
import styles from './hero.module.css';
import cx from './heroCopy.module.css';
import ux from './heroUi.module.css';

// 히어로 — 한 화면: 서울 섬 기준 그림 + 움직임 레이어(데스크톱 낮) 위에 핀 지도와 문구.
// H1·리드는 서버 렌더링 그대로 첫 페인트에 보이고, 핀은 뜨자마자 누를 수 있다(CSS 순차 등장 0.6초 이내).
export default function Hero({ hero, art, motion, places, guideMap, copy, alt }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [active, setActive] = useState(null);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const night = mounted && resolvedTheme === 'dark';
  // 밤 장면은 다크 테마를 실제로 쓸 때만 받는다 (라이트 첫 방문 용량 절약)
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (night) setNightSeen(true); }, [night]);

  // 움직임은 데스크톱 낮만 (밤·모바일은 그림 준비 전까지 정지 그림). 모션 축소·데이터 절약이면 정지.
  const motionOn = mounted && !portrait && !night && !reduced && !saveData;

  useEffect(() => {
    setMounted(true);
    setSaveData(prefersSaveData());
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

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div ref={stageRef} className={`${styles.stage} h-content`}>
        <div className={styles.sky} />
        <div className={`${styles.sky} ${styles.skyNight}`} />
        <div className={styles.tilt}>
          <div ref={tiltRef} className={styles.tiltInner}>
            <div className={styles.box}>
              <div className={styles.scene}>
                <Art desktop={art.desktop} mobile={art.mobile} alt={alt} priority withNight={nightSeen} />
                {motionOn && <HeroMotion data={motion} paused={motionPaused} />}
              </div>
              <Pins places={places} guideMap={guideMap} active={active} setActive={setActive} portrait={portrait} />
            </div>
          </div>
        </div>

        <div className={cx.copy}>
          <p className={cx.eyebrow}>{hero.eyebrow}</p>
          <h1 id="home-title" className={cx.title}>
            {hero.titleLines.map((line, i) => (
              <span key={line}>{i > 0 && ' '}<span className={cx.line}>{line}</span></span>
            ))}
          </h1>
          <p className={cx.lead}>{hero.lead}</p>
          <Link href={hero.cta.href} className={cx.cta} data-magnetic="">
            {hero.cta.label}
            <span className={cx.ctaIcon}><ArrowRight aria-hidden="true" /></span>
          </Link>
        </div>

        <div className={ux.mapBar}>
          <p className={ux.mapHint}>
            <MapPin aria-hidden="true" />
            <span><strong>{copy.mapTitle}</strong> {copy.mapHint}</span>
          </p>
          <div className={ux.chipsBar}>
            <PlaceChips places={places} active={active} setActive={setActive} label={copy.mapTitle} />
          </div>
        </div>
        {portrait && <PinSheet places={places} guideMap={guideMap} active={active} setActive={setActive} closeLabel={copy.close} />}

        <div className={ux.controls}>
          {motionOn && (
            <button type="button" className={ux.pause} onClick={() => setMotionPaused((v) => !v)}
              aria-label={motionPaused ? copy.play : copy.pause} aria-pressed={motionPaused}>
              {motionPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          )}
          <DayNightToggle night={night} mounted={mounted} setTheme={setTheme} copy={copy} />
        </div>
      </div>
    </section>
  );
}
