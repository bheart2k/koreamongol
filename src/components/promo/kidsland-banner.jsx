import { familyUrl } from '@/lib/family-sites';

// 키즈랜드 홍보 배너 — 실제 키즈랜드 히어로 배너 무드 그대로:
// 크림 옐로 배경 · 곰돌이 마스코트 · 풍선/별/연필 장식 · "무료 프린트 학습지" 배지 · 산호색 CTA.
// 마스코트·장식 SVG는 kidsland 저장소 src/components/mascot/shapes.jsx에서 그대로 복사
// (곰은 happy 표정만). 브랜드 정체성 표현을 위해 이 파일에 한해 키즈랜드 고유 색 hex를 쓴다.

// 곰돌이 "쿠미" — kidsland MascotBear(happy) 원본 복사
function MascotBear({ className }) {
  const fur = '#FFC944';
  const cheek = '#FF8FA3';
  const belly = '#FFF1D6';
  const ink = '#3A2A1A';
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {/* 귀 — 머리 위로 또렷이 솟음 (곰 특징) */}
      <circle cx="56" cy="54" r="26" fill={fur} />
      <circle cx="144" cy="54" r="26" fill={fur} />
      <circle cx="56" cy="54" r="14" fill={belly} />
      <circle cx="144" cy="54" r="14" fill={belly} />
      {/* 얼굴 — 곰은 넓적하게 */}
      <ellipse cx="100" cy="108" rx="74" ry="66" fill={fur} />
      {/* 주둥이 — 작고 동그랗게 (코·입 주변만) */}
      <ellipse cx="100" cy="128" rx="34" ry="28" fill={belly} />
      {/* 표정 (happy): 눈 + 볼 + 코 + 미소 */}
      <circle cx="80" cy="103" r="8.5" fill={ink} />
      <circle cx="83" cy="99" r="3" fill="#fff" />
      <circle cx="120" cy="103" r="8.5" fill={ink} />
      <circle cx="123" cy="99" r="3" fill="#fff" />
      <circle cx="58" cy="124" r="13" fill={cheek} opacity="0.8" />
      <circle cx="142" cy="124" r="13" fill={cheek} opacity="0.8" />
      <ellipse cx="100" cy="121" rx="13" ry="9" fill={ink} />
      <ellipse cx="96" cy="118" rx="4" ry="2.5" fill="#fff" opacity="0.5" />
      <path d="M100 130 V137" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M88 140 Q100 150 112 140" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// 풍선 — kidsland Balloon 원본 복사
function Balloon({ className, fill = '#FF6B6B' }) {
  return (
    <svg viewBox="0 0 60 90" className={className} aria-hidden="true">
      <ellipse cx="30" cy="32" rx="24" ry="30" fill={fill} />
      <path d="M30 62 L26 70 L34 70 Z" fill={fill} />
      <path d="M30 70 Q34 80 28 88" stroke="#999" strokeWidth="2" fill="none" />
      <ellipse cx="22" cy="22" rx="6" ry="9" fill="#fff" opacity="0.4" />
    </svg>
  );
}

// 별 친구 "삐약별" — kidsland MascotStar 원본 복사
function MascotStar({ className, fill = '#5BC0EB' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path
        d="M60 8 L74 44 L112 46 L82 70 L92 108 L60 86 L28 108 L38 70 L8 46 L46 44 Z"
        fill={fill}
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="58" r="5" fill="#2A2A3A" />
      <circle cx="72" cy="58" r="5" fill="#2A2A3A" />
      <path d="M52 72 Q61 80 70 72" stroke="#2A2A3A" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// 연필 — kidsland Pencil 원본 복사
function Pencil({ className }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <g transform="rotate(45 30 30)">
        <rect x="22" y="6" width="16" height="38" rx="3" fill="#FFD43B" />
        <rect x="22" y="6" width="16" height="8" rx="3" fill="#FF8787" />
        <path d="M22 44 L30 56 L38 44 Z" fill="#FFE8A3" />
        <path d="M26 50 L30 56 L34 50 Z" fill="#3A2A1A" />
      </g>
    </svg>
  );
}

export function KidslandBanner({ selfId }) {
  return (
    <a
      href={familyUrl({ url: 'https://kidsland.co.kr' }, selfId)}
      target="_blank"
      rel="noopener"
      className="group relative block cursor-pointer overflow-hidden rounded-3xl border border-[#f1e3ae] bg-[#fbf3d6] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,107,107,0.18)]"
    >
      {/* 떠다니는 장식 — 실제 히어로의 풍선·별·연필 */}
      <span aria-hidden className="pointer-events-none absolute right-4 top-1.5 w-4 transition-transform duration-300 group-hover:-translate-y-0.5">
        <Balloon className="w-full" />
      </span>
      <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-24 w-3.5 opacity-90">
        <MascotStar className="w-full" />
      </span>
      <span aria-hidden className="pointer-events-none absolute right-40 top-3 w-3.5 opacity-80">
        <Pencil className="w-full" />
      </span>

      <span className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-4 px-6 py-5">
        {/* 곰돌이 쿠미 — 호버 시 갸웃 */}
        <span className="block size-24 shrink-0 transition-transform duration-300 group-hover:-rotate-6">
          <MascotBear className="size-full" />
        </span>

        <span className="min-w-0 flex-1 basis-56">
          {/* 배지 — 실제 배너의 노랑 알약 배지 */}
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD43B] px-2.5 py-0.5 text-[11px] font-bold text-[#5b4a2f]">
            ✏️ Хэвлэмэл сургалтын материал
          </span>
          <span className="mt-1.5 block text-[21px] font-extrabold leading-snug tracking-tight text-[#3f4756]">
            Хүүхдийн анхны хичээл — <span className="text-[#FF6B6B]">Kidsland</span>!
          </span>
          <span className="mt-1 block text-[13px] font-medium text-[#8a90a0]">
            Дэлгэц дээр будаж, хэвлээд дахин будна — нэг эрхээр ах дүүс бүгд хязгааргүй
          </span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF6B6B] px-5 py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_3px_8px_rgba(255,107,107,0.35)] transition-colors group-hover:bg-[#ff5757]">
          Үнэгүй туршиж үзэх
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </span>
    </a>
  );
}
