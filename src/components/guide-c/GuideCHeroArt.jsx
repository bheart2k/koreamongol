'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import LoopVideo from '@/components/home/LoopVideo';
import s from './guideC.module.css';

// 머리 그림 — 홈 장소 챕터와 같은 방식: 낮 정지 그림 위에 루프 영상, 다크모드는 밤 그림으로 크로스페이드하고 그 위에 밤 루프
const srcSet = (src) => `${src.replace('.webp', '-m.webp')} 828w, ${src} 1200w`;
const SIZES = '(max-width: 1023px) calc(100vw - 32px), 520px';

export default function GuideCHeroArt({ image, alt, loop, loopNight, base, labels }) {
  const { resolvedTheme } = useTheme();
  const [nightSeen, setNightSeen] = useState(false);
  useEffect(() => { if (resolvedTheme === 'dark') setNightSeen(true); }, [resolvedTheme]);
  const night = image.replace('.webp', '-night.webp');

  return (
    <div className={s.heroArt}>
      <img src={image} srcSet={srcSet(image)} sizes={SIZES} alt={alt || ''} width={1200} height={900}
        decoding="async" fetchPriority="high" className={s.heroStill} />
      {loop && resolvedTheme !== 'dark' && <LoopVideo base={base} name={loop} labels={labels} />}
      {nightSeen && (
        <img src={night} srcSet={srcSet(night)} sizes={SIZES} alt="" aria-hidden="true" decoding="async"
          className={`${s.heroStill} ${s.heroNight}`} onLoad={(e) => { e.currentTarget.dataset.loaded = ''; }} />
      )}
      {loopNight && resolvedTheme === 'dark' && <LoopVideo base={base} name={loopNight} labels={labels} night />}
    </div>
  );
}
