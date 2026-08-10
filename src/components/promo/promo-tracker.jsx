'use client';

import { useEffect, useRef } from 'react';

// 교차 홍보 클릭/실노출 수집 — 허브(family-promo)로 sendBeacon 전송. 원본은 pedia-factory/template.
// 실패는 무시(fire-and-forget)라 배너 동작·페이지 이동에 영향이 없고, 개인 식별 정보는 보내지 않는다
// (기기·지역은 허브 서버가 요청 헤더에서 추출). 수집 스키마: family-promo/docs/02-클릭추적-검토.md
const HUB_URL = 'https://family-promo.vercel.app/api/click';

function send(type, from, to) {
  try {
    const body = JSON.stringify({ type, from, to, path: window.location.pathname });
    navigator.sendBeacon(HUB_URL, new Blob([body], { type: 'text/plain' }));
  } catch {
    // 수집 실패는 무시
  }
}

// 배너를 감싸 실노출(50% 이상 보임, 1회) 임프레션과 클릭을 전송한다.
export function PromoTracker({ from, to, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          send('imp', from, to);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [from, to]);

  return (
    <div ref={ref} onClickCapture={() => send('click', from, to)}>
      {children}
    </div>
  );
}
