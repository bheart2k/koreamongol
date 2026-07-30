'use client';

import { usePathname } from 'next/navigation';
import { HangulHubBanner } from '@/components/promo/hangulhub-banner';
import { KidslandBanner } from '@/components/promo/kidsland-banner';

// 자사·협력 서비스 교차 홍보 배너 — layout-shell.jsx의 <Footer /> 바로 위에 배치.
// 배너 실물은 components/promo/ (몽골어 사이트라 카피만 몽골어로 손본 hangulhub·kidsland 2종 — carepedia와 동일한 확정 디자인).
// 경로 해시로 페이지마다 1개를 "고정" 로테이션한다: 정적/ISR 캐시·하이드레이션과 무관하게
// 안전하고(같은 경로 = 항상 같은 배너), 페이지를 옮겨 다니면 자연스럽게 다른 서비스를 만난다.
const SELF_ID = 'koreamongol';
const BANNERS = [HangulHubBanner, KidslandBanner];

export function FamilyBanner() {
  const pathname = usePathname() || '/';
  let h = 0;
  for (let i = 0; i < pathname.length; i += 1) h = (h * 31 + pathname.charCodeAt(i)) | 0;
  const Banner = BANNERS[Math.abs(h) % BANNERS.length];

  return (
    <section aria-label="Манай бусад үйлчилгээ">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Banner selfId={SELF_ID} />
      </div>
    </section>
  );
}
