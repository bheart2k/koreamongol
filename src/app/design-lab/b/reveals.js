// 공통 등장 연출 — 마크업의 data-reveal 속성으로 지정
//   wipe   : clip-path inset 아래→위 와이프 + 안쪽 [data-reveal-media] 1.2→1.0 스케일
//   wipe-x : 왼쪽→오른쪽 와이프
//   rule   : 괘선 드로잉 (scaleX 0→1)
//   lines  : 줄 단위 마스크 상승 (SplitText)
//   fade   : 살짝 떠오르며 나타남
// JS 가 없거나 reduced-motion 이면 아무 것도 숨기지 않는다.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'expo.out';

function trigger(el, start = 'top 86%') {
  return { trigger: el, start, once: true };
}

export function setupReveals(root, { reduced }) {
  if (!root || reduced) return null;
  const splits = [];

  const ctx = gsap.context(() => {
    root.querySelectorAll('[data-reveal="wipe"], [data-reveal="wipe-x"]').forEach((el) => {
      const horizontal = el.dataset.reveal === 'wipe-x';
      const media = el.querySelector('[data-reveal-media]');
      const tl = gsap.timeline({ scrollTrigger: trigger(el, 'top 90%') });
      tl.fromTo(el,
        { clipPath: horizontal ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', delay: Number(el.dataset.delay || 0) });
      if (media) tl.fromTo(media, { scale: 1.22 }, { scale: 1, duration: 2.1, ease: EASE }, 0.05 + Number(el.dataset.delay || 0));
    });

    root.querySelectorAll('[data-reveal="rule"]').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1, duration: 1.6, ease: 'expo.inOut', transformOrigin: el.dataset.origin || '0% 50%',
        delay: Number(el.dataset.delay || 0), scrollTrigger: trigger(el, 'top 94%'),
      });
    });

    // 패럴랙스: data-parallax="8" → 스크롤 동안 yPercent -8 → 8
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      const v = Number(el.dataset.parallax) || 0;
      gsap.fromTo(el, { yPercent: -v }, {
        yPercent: v, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    root.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1, y: 0, duration: 1.2, ease: EASE,
        delay: Number(el.dataset.delay || 0), scrollTrigger: trigger(el),
      });
    });
  }, root);

  // 줄 단위 분할은 웹폰트 로딩 뒤 (줄바꿈 위치가 바뀌므로)
  document.fonts?.ready.then(() => {
    root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'b-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110, duration: 1.25, ease: EASE, stagger: 0.09,
            delay: Number(el.dataset.delay || 0), scrollTrigger: trigger(el),
          });
        },
      });
      splits.push(split);
    });
    ScrollTrigger.refresh();
  });

  return {
    revert() {
      splits.forEach((sp) => sp.revert());
      ctx.revert();
    },
  };
}
