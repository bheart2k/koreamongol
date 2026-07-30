import { familyUrl } from '@/lib/family-sites';

// 한글허브 홍보 배너 — 한글허브 브랜드 스타일(한지·단청·인장·세리프)로 제작.
// 브랜드 정체성 표현을 위해 이 파일에 한해 한글허브 고유 색 hex를 직접 쓴다(호스트 토큰 예외).

// 한지 섬유 질감 — SVG 노이즈 (외부 이미지 없이 자체 생성)
const HANJI_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.36 0 0 0 0 0.22 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

// 단청 오방색 스트립 (한글허브 팔레트: 주홍·치자·뇌록·삼청·자주)
const DANCHONG =
  'linear-gradient(90deg, #C4432F 0% 20%, #D9A62E 20% 40%, #2E6B54 40% 60%, #3E63B0 60% 80%, #7A3B69 80% 100%)';

export function HangulHubBanner({ selfId }) {
  return (
    <a
      href={familyUrl({ url: 'https://hangulhub.co.kr' }, selfId)}
      target="_blank"
      rel="noopener"
      className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-[#e0d5b8] bg-[#f7f1e3] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(139,58,58,0.18)]"
    >
      {/* 단청 스트립 */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: DANCHONG }} />
      {/* 한지 질감 */}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: HANJI_NOISE }} />
      {/* 책판식 안쪽 괘선 */}
      <span aria-hidden className="pointer-events-none absolute inset-[7px] top-[10px] rounded-xl border border-[#8B3A3A]/15" />

      {/* justify-center는 CTA가 줄바꿈됐을 때만 효과 — 한 줄일 땐 flex-1 텍스트가
          남는 공간을 다 차지해 정렬 차이가 없다(뷰포트 아닌 실제 폭 기준으로 동작). */}
      <span className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-4 px-6 py-5">
        {/* 전각 인장 — 세로쓰기, 도장 찍힌 듯 살짝 기울임 */}
        <span className="flex size-16 shrink-0 -rotate-3 items-center justify-center rounded-[10px] bg-[#C4432F] shadow-[0_2px_10px_rgba(196,67,47,0.35),inset_0_0_0_2px_rgba(247,241,227,0.9),inset_0_0_0_4px_#C4432F,inset_0_0_14px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:rotate-0">
          <span className="font-serif text-[21px] font-bold leading-[1.05] text-[#f7f1e3] [writing-mode:vertical-rl]">
            한글
          </span>
        </span>

        <span className="min-w-0 flex-1 basis-56">
          <span className="block text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#a08d6f]">
            Experience the beauty of Hangul
          </span>
          <span className="mt-1 block font-serif text-[22px] font-bold leading-snug tracking-tight text-[#292019]">
            한글의 <span className="border-b-2 border-[#C4432F]/45">아름다움</span>을 담다
          </span>
          <span className="mt-1 block text-[13px] text-[#7d6b52]">
            Солонгос нэр · тамга · үнэгүй фонт — хангылтай холбоотой бүх зүйл
          </span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#8B3A3A] px-5 py-2.5 text-[13.5px] font-bold text-[#f7f1e3] shadow-sm transition-colors group-hover:bg-[#C4432F]">
          HangulHub үзэх
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </span>
    </a>
  );
}
