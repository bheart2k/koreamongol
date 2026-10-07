'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Pins, PinSheet, PlaceChips } from './MapPins';
import { Art, DayNightToggle, PORTRAIT, Title } from './HeroParts';
import styles from './hero.module.css';
import cx from './heroCopy.module.css';
import ux from './heroUi.module.css';

gsap.registerPlugin(ScrollTrigger);

const DOLLY_END = 0.74; // 스크롤 진행도 중 카메라 돌리가 차지하는 구간
const SETTLE = 0.8;     // 이 지점을 넘으면 핀 안무(시간 기반)를 재생

// 근접 프레임 = 전경의 crop 영역을 다시 렌더한 것 → 전경을 그 영역으로 정확히 확대하는 배율·기준점.
// crop 이 없으면(세로 화면: 근접 프레임이 다른 구도) focus 지점으로 zoom 배 다가가며 초점 이동으로 교차한다.
function dollyOf(kind) {
  if (!kind.crop) return { scale: kind.zoom, origin: `${kind.focus.x}% ${kind.focus.y}%` };
  const { x, y, w } = kind.crop;
  const s = 100 / w;
  return { scale: s, origin: `${(100 * x) / (100 - w)}% ${(100 * y) / (100 - w)}%` };
}

export default function Hero({ hero, art, places, guideMap, copy, alts }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(null);
  const [settledState, setSettledState] = useState(false); // 정착 전에는 핀·칩을 inert 로 (키보드 포커스 차단)
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const night = mounted && resolvedTheme === 'dark';
  // 야간 조명 장면은 다크 테마를 실제로 쓸 때만 받는다 (라이트 첫 방문 용량 절약)
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (night) setNightSeen(true); }, [night]);
  const kind = portrait ? art.mobile : art.desktop;
  const exact = Boolean(kind.crop);

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

  // 스크롤 연출: 벽 글자 퇴장 → 카메라 돌리(전경 확대) → 근접 프레임으로 초점 이동 → 핀 안무
  useEffect(() => {
    if (!mounted || reduced) return undefined;
    const stage = stageRef.current;
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) * 16 || 64;
    const { scale, origin } = dollyOf(kind);
    const exact = Boolean(kind.crop);
    let pinsTl = null;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      gsap.set(q('[data-camera]'), { transformOrigin: origin, force3D: false });
      tl.to(q('[data-char]'), { yPercent: -120, opacity: 0, stagger: 0.003, duration: 0.12, ease: 'power2.in' }, 0)
        .to(q('[data-fade]'), { y: -24, opacity: 0, duration: 0.1, stagger: 0.015, ease: 'power2.in' }, 0)
        .to(q('[data-cue]'), { y: 16, opacity: 0, duration: 0.06 }, 0)
        // 돌리: 전경 전체를 crop 영역이 화면을 채울 때까지 — 끝에서 속도를 죽여 '안착'하는 느낌
        .to(q('[data-camera]'), { scale, duration: DOLLY_END, ease: 'power2.inOut' }, 0)
        // 갤러리 스포트라이트가 서울 모형으로 좁혀진다
        .to(q('[data-spot]'), { opacity: 1, duration: DOLLY_END * 0.8, ease: 'power1.inOut' }, 0.05)
        // 초점 이동: 확대된 전경(흐려짐) → 근접 프레임(선명)
        .to(q('[data-start-art]'), { filter: 'blur(3px)', duration: 0.2 }, DOLLY_END - 0.24)
        .to({}, { duration: 0.001 }, 1);
      if (exact) {
        tl.fromTo(q('[data-settle]'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, DOLLY_END - 0.2);
      } else {
        // 다른 구도의 근접 프레임: 살짝 크게·흐리게 시작해 제자리에서 초점이 맺힌다
        tl.fromTo(q('[data-settle]'), { opacity: 0, scale: 1.1, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.26, ease: 'power2.out' }, DOLLY_END - 0.24);
      }

      // 핀 안무 — 스크럽이 아니라 정착 순간 한 번 재생 (뒤로 가면 빠르게 되감기)
      pinsTl = gsap.timeline({ paused: true })
        .fromTo(q('[data-pin-stem]'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, stagger: 0.07, ease: 'expo.out' }, 0)
        .fromTo(q('[data-pin]'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'back.out(2.2)' }, 0)
        .fromTo(q('[data-map-ui]'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, 0.25);

      let settled = false;
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: () => `top top+=${navH()}`,
        end: 'bottom bottom',
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const now = self.progress >= SETTLE;
          if (now === settled) return;
          settled = now;
          if (now) { stage.dataset.settled = ''; pinsTl.timeScale(1).play(); }
          else { delete stage.dataset.settled; setActive(null); pinsTl.timeScale(2.4).reverse(); }
          setSettledState(now);
        },
      });
    }, stage);

    return () => {
      ctx.revert();
      if (stage) delete stage.dataset.settled;
      setSettledState(false);
    };
  }, [mounted, reduced, kind]);

  // 미세 틸트 패럴랙스: 데스크톱은 마우스, 세로 화면은 자이로(권한 요청이 필요 없는 기기만)
  useEffect(() => {
    if (!mounted || reduced) return undefined;
    const stage = stageRef.current;
    const rx = gsap.quickTo(tiltRef.current, 'rotationX', { duration: 1.2, ease: 'power3.out' });
    const ry = gsap.quickTo(tiltRef.current, 'rotationY', { duration: 1.2, ease: 'power3.out' });
    if (portrait) {
      const DOE = window.DeviceOrientationEvent;
      if (!DOE || typeof DOE.requestPermission === 'function') return undefined;
      let base = null;
      const onOrient = (e) => {
        if (e.beta == null || e.gamma == null) return;
        base ??= { b: e.beta, g: e.gamma };
        ry(gsap.utils.clamp(-2.5, 2.5, (e.gamma - base.g) * 0.1));
        rx(gsap.utils.clamp(-2, 2, -(e.beta - base.b) * 0.08));
      };
      window.addEventListener('deviceorientation', onOrient);
      return () => window.removeEventListener('deviceorientation', onOrient);
    }
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 2.6);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const onLeave = () => { rx(0); ry(0); };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); };
  }, [mounted, reduced, portrait]);

  const cropStyle = {
    '--dcx': `${art.desktop.crop.x}%`, '--dcy': `${art.desktop.crop.y}%`, '--dcw': `${art.desktop.crop.w}%`,
  };

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
  const toggle = <DayNightToggle night={night} mounted={mounted} setTheme={setTheme} copy={copy} />;

  return (
    <section className={styles.hero} aria-labelledby="d-title" data-static={reduced || undefined}>
      {reduced && (
        <div className={cx.staticCopy}>
          <p className={cx.eyebrow}>{hero.eyebrow}</p>
          <Title lines={hero.titleLines} srText={hero.title} />
          <p className={cx.lead}>{hero.lead}</p>
          <Link href={hero.cta.href} className={cx.cta}>
            {hero.cta.label}
            <span className={cx.ctaIcon}><ArrowRight aria-hidden="true" /></span>
          </Link>
        </div>
      )}
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage} data-stage="" data-active={active ? '' : undefined}>
          <div className={styles.wall} />
          <div className={styles.tilt}>
            <div ref={tiltRef} className={styles.tiltInner}>
              <div className={styles.box} style={cropStyle}>
                {!reduced && (
                  <div className={styles.camera} data-camera="">
                    <div className={styles.group} data-start-art="">
                      <Art desktop={art.desktop.start} mobile={art.mobile.start} alt={alts.start} priority withNight={nightSeen} />
                    </div>
                    {exact && (
                      <div className={styles.settleGroup} data-settle="">
                        <Art desktop={art.desktop.settle} mobile={art.mobile.settle} alt={alts.settle} withNight={nightSeen} />
                      </div>
                    )}
                  </div>
                )}
                {!reduced && !exact && (
                  <div className={`${styles.group} ${styles.settleFull}`} data-settle="">
                    <Art desktop={art.desktop.settle} mobile={art.mobile.settle} alt={alts.settle} withNight={nightSeen} />
                  </div>
                )}
                {reduced && (
                  <div className={styles.group}>
                    <Art desktop={art.desktop.settle} mobile={art.mobile.settle} alt={alts.settle} priority withNight={nightSeen} />
                  </div>
                )}
                <div className={styles.spot} data-spot="" aria-hidden="true" />
                {pins(reduced || settledState)}
              </div>
            </div>
          </div>
          <div className={styles.lights} aria-hidden="true" />

          {!reduced && (
            <>
              <div className={cx.copy}>
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
              <p className={cx.label} data-fade="" aria-hidden="true">
                <span>{copy.exhibit}</span>
                <span>Монгол · Солонгос</span>
              </p>
            </>
          )}

          {toggle}
          {mapUi(reduced || settledState)}
        </div>
      </div>

    </section>
  );
}
