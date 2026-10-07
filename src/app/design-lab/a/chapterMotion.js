// 챕터 섹션 모션 — 넓은 화면(가로 트랙 + WebGL) / 세로 화면(카드 스택)
import gsap from 'gsap';
import { createChapterGL } from './chapterGL';

const HOLD = 0.2; // 각 챕터에서 머무는 구간 비율 (전환 전후)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// 스크롤 진행도(0..1) → 패널 위치(0..n-1), 각 패널에서 잠시 머물도록
function trackPosition(progress, n) {
  const s = progress * (n - 1);
  const i = Math.min(Math.floor(s), n - 2);
  const f = s - i;
  const e = gsap.utils.clamp(0, 1, (f - HOLD) / (1 - 2 * HOLD));
  return i + easeInOut(e);
}

/**
 * 넓은 화면: 고정 스테이지 안에서 패널 트랙을 가로로 이동, 배경은 WebGL로 전환
 * els: { section, stage, track, panels, nums, bodies, counterNow, bar, canvas, glOnClass }
 * 반환: { videos, cleanup }
 */
export function setupWideTrack({ els, chapters, asset, isPaused }) {
  const { section, stage, track, panels, nums, bodies, counterNow, bar, canvas, glOnClass } = els;
  const n = chapters.length;
  const gl = createChapterGL(canvas, chapters.map((ch) => `${asset}/${ch.media}.webp`));
  if (gl) stage.classList.add(glOnClass);

  // GL용 루프 영상 (DOM 밖). 현재·다음 패널만 재생
  const videos = chapters.map((ch, i) => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous'; // WebGL 텍스처용 CORS 요청
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';
    v.src = `${asset}/${ch.media}-loop.mp4`;
    v.dataset.active = '0';
    gl?.attachVideo(i, v);
    return v;
  });

  let pos = 0;
  let current = -1;
  let inView = false;
  let near = false;
  let raf = 0;
  const t0 = performance.now();

  const setActiveVideos = (a, b) => {
    videos.forEach((v, i) => {
      const on = inView && (i === a || i === b);
      v.dataset.active = on ? '1' : '0';
      if (on) {
        if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
        if (!isPaused() && v.paused) v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    });
  };

  const apply = (progress) => {
    pos = trackPosition(progress, n);
    gsap.set(track, { xPercent: (-pos * 100) / n });
    const w = stage.clientWidth;
    panels.forEach((_, i) => {
      const d = i - pos;
      gsap.set(nums[i], { x: d * w * 0.35 });
      gsap.set(bodies[i], { x: d * w * 0.12 });
    });
    bar.style.setProperty('--p', progress.toFixed(4));
    const idx = Math.round(pos);
    if (idx !== current) {
      current = idx;
      panels.forEach((p, i) => {
        if (i === idx) p.dataset.current = '';
        else delete p.dataset.current;
      });
      counterNow.textContent = chapters[idx].no;
      gsap.fromTo(counterNow, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    }
    const a = Math.min(Math.floor(pos), n - 1);
    setActiveVideos(a, Math.min(a + 1, n - 1));
  };

  const ctx = gsap.context(() => {
    const navH = parseFloat(getComputedStyle(stage).top) || 64;
    // 섹션 1.5화면 전부터 텍스처 준비·렌더
    gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top 250%', end: 'bottom -50%',
        onToggle: (self) => { near = self.isActive; if (near) gl?.prime(); },
      },
    });
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: `top ${navH}px`,
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => apply(self.progress),
        onToggle: (self) => { inView = self.isActive; apply(self.progress); },
        onRefresh: (self) => apply(self.progress),
      },
    });
  }, section);

  const loop = () => {
    if (gl && near) {
      const a = Math.min(Math.floor(pos), n - 1);
      const b = Math.min(a + 1, n - 1);
      gl.frame(a, b, a === n - 1 ? 0 : pos - a, (performance.now() - t0) / 1000);
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const ro = new ResizeObserver(() => gl?.resize());
  ro.observe(stage);
  apply(0);

  const cleanup = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    videos.forEach((v) => { v.pause(); v.removeAttribute('src'); v.load(); });
    gl?.destroy();
    stage.classList.remove(glOnClass);
    panels.forEach((p) => { delete p.dataset.current; });
    ctx.revert();
  };
  return { videos, cleanup };
}

/**
 * 세로 화면: 카드가 겹쳐 쌓이며, 뒤 카드는 작아지고 어두워짐. 보이는 카드의 루프 영상만 재생
 * els: { section, panels, inners, titleSpans }
 */
export function setupStack({ els, isPaused }) {
  const { section, panels, inners, titleSpans } = els;
  const videos = panels.map((p) => p.querySelector('video')).filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target.querySelector('video');
      if (!v) return;
      const on = e.intersectionRatio > 0.45;
      v.dataset.active = on ? '1' : '0';
      if (on && !isPaused()) {
        if (v.preload === 'none') v.preload = 'auto';
        v.play().catch(() => {});
      } else if (!on) v.pause();
    });
  }, { threshold: [0, 0.45, 0.9] });
  panels.forEach((p) => io.observe(p));

  const ctx = gsap.context(() => {
    panels.forEach((panel, i) => {
      if (i === panels.length - 1) return;
      gsap.to(inners[i], {
        scale: 0.9,
        filter: 'brightness(0.45)',
        borderRadius: 28,
        ease: 'none',
        scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top 15%', scrub: true },
      });
    });
    titleSpans.forEach((el) => {
      gsap.from(el, {
        yPercent: 105, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
      });
    });
  }, section);

  const cleanup = () => {
    io.disconnect();
    ctx.revert();
  };
  return { videos, cleanup };
}
