'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics-events';

// 가이드 페이지 조회 기록 (세션당 1회) — HelpfulWidget의 tip_view와 같은 방식
export function GuideViewTracker({ guideId }) {
  useEffect(() => {
    const viewKey = `km_guide_view:${guideId}`;
    if (!sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, '1');
      analytics.guideView(guideId);
    }
  }, [guideId]);

  return null;
}
