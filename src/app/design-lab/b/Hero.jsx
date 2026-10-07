'use client';

// 히어로: 몽골(지평선)·한국(수평선) 딥틱이 스크롤에 따라 가운데로 모여 한 장으로 합쳐진다.
// 초기 배치는 CSS 만으로 그려지고(JS 없이 첫 페인트), JS 가 붙으면 sticky 스테이지 + 스크럽.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { useMotion } from './MotionRoot';
import LoopVideo from './LoopVideo';
import h from './hero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ hero, media }) {
  const wrapRef = useRef(null);
  const { ready, reduced, lite } = useMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!ready || reduced || !wrap) return;
    const q = gsap.utils.selector(wrap);
    const stage = q(`.${h.stage}`)[0];
    const mm = gsap.matchMedia();

    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
      const { desktop } = c.conditions;
      wrap.dataset.armed = 'true';
      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;
      const overlap = 0.14; // 이음매 블렌드 폭 (화면 폭 대비)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top+=64',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // 1) 소개 문구·캡션 퇴장
      tl.to(q(`.${h.intro}`), { autoAlpha: 0, y: -40, duration: 0.18 }, 0)
        .to(q(`.${h.cap}`), { autoAlpha: 0, y: 12, duration: 0.14 }, 0)
        .to(q(`.${h.cue}`), { autoAlpha: 0, duration: 0.08 }, 0);

      // 2) 두 패널이 가운데로 — 지평선은 CSS(cq 단위)로 항상 같은 높이에 고정
      tl.to(q(`.${h.mn}`), {
        left: 0, top: 0, width: () => W() * (0.5 + overlap / 2), height: () => H(),
        duration: 0.55, ease: 'power2.inOut',
      }, 0.04)
        .to(q(`.${h.kr}`), {
          left: () => W() * (0.5 - overlap / 2), top: 0, width: () => W() * (0.5 + overlap / 2), height: () => H(),
          duration: 0.55, ease: 'power2.inOut',
        }, 0.04)
        .to(q(`.${h.kr}`), { '--seam': () => `${W() * overlap}px`, duration: 0.16, ease: 'power1.out' }, 0.45);

      // 3) 제목은 하늘 쪽으로 물러남
      tl.to(q(`.${h.title}`), {
        y: () => (desktop ? -H() * 0.1 : 0), scale: desktop ? 0.82 : 0.92,
        duration: 0.55, ease: 'power2.inOut',
      }, 0.04);
      // 밝은 새벽 하늘 위에서는 테마와 관계없이 남색 잉크 (다크모드 대비)
      const skyInk = () => getComputedStyle(stage).getPropertyValue('--b-sky-ink').trim();
      tl.to(q(`.${h.title}, .${h.mast}`), { color: skyInk, duration: 0.3 }, 0.3)
        .to(q(`.${h.mastRule}`), { backgroundColor: skyInk, duration: 0.3 }, 0.3);

      // 4) 하나의 지평선 — 금선 드로잉 + 문구
      tl.fromTo(q(`.${h.horizon}`), { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: 'power2.inOut' }, 0.6)
        .fromTo(q(`.${h.unity}`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.7)
        .to(q(`.${h.mediaWrap}`), { scale: 1.045, duration: 0.4 }, 0.6);

      // 스크롤 속도에 반응하는 제목 기울기
      const skew = gsap.quickTo(q(`.${h.tLine}`), 'skewY', { duration: 0.5, ease: 'power3.out' });
      const st = tl.scrollTrigger;
      let lastSkew = 0;
      const onVel = () => {
        const v = st.isActive ? gsap.utils.clamp(-5, 5, st.getVelocity() / -320) : 0;
        if (Math.abs(v - lastSkew) < 0.01) return; // 변화 없으면 갱신 안 함
        lastSkew = v;
        skew(v);
      };
      gsap.ticker.add(onVel);

      // 히어로가 스크럽 길이만큼 늘어났으므로 아래 섹션들의 트리거 위치를 다시 계산
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(onVel);
        wrap.dataset.armed = 'false';
      };
    });

    return () => mm.revert();
  }, [ready, reduced]);

  const videoOk = ready && !reduced && !lite;

  return (
    <section ref={wrapRef} className={h.wrap} aria-labelledby="b-hero-title" data-armed="false">
      <div className={h.stage}>
        <p className={h.mast} aria-hidden="true">
          <span>KoreaMongol</span>
          <span className={h.mastRule} />
          <span>Хоёр нутаг</span>
          <span className={h.mastNo}>№ 01</span>
        </p>

        {['mn', 'kr'].map((key) => (
          <div key={key} className={`${h.panel} ${h[key]}`}>
            <div className={h.mediaWrap}>
              <picture>
                <source media="(max-width: 767px)" srcSet={media[key].mobile} />
                <img
                  className={h.media}
                  src={media[key].src}
                  alt={media[key].alt}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
              {videoOk && (
                <LoopVideo
                  className={h.media}
                  src={media[key].video}
                  srcMobile={media[key].videoMobile}
                  delay={key === 'mn' ? 0 : 400}
                />
              )}
            </div>
          </div>
        ))}

        <p className={`${h.cap} ${h.capMn}`}>
          <span className={h.capNo}>I</span> Монгол · Тал нутаг <span className={h.capGeo}>47°55′ N</span>
        </p>
        <p className={`${h.cap} ${h.capKr}`}>
          <span className={h.capNo}>II</span> Солонгос · Хан мөрөн <span className={h.capGeo}>37°33′ N</span>
        </p>

        <h1 id="b-hero-title" className={h.title}>
          <span className={h.tLine}><span className={h.tInner}>{hero.titleLines[0]}</span></span>
          <span className={h.tLine}><span className={h.tInner}>{hero.titleLines[1]}</span></span>
        </h1>

        <div className={h.intro}>
          <p className={h.lead}>{hero.lead}</p>
          <a className={h.cta} href={hero.cta.href}>
            {hero.cta.label}
            <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <span className={h.horizon} aria-hidden="true" />
        <p className={h.unity}>Хоёр нутаг — нэг тэнгэрийн хаяа</p>
        <span className={h.cue} aria-hidden="true" />
      </div>
    </section>
  );
}
