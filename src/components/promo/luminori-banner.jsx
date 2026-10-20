import { familyUrl } from '@/lib/family-sites';

// 루미노리 홍보 배너(루미노리 docs/99-open-promo.md §4-1) — 학부모가 한눈에 "아이 학습 놀이 서비스"로 읽고 실제 놀이 모습을 보게:
// 밝은 하늘→크림 바탕 · 연보라 테두리 · 문구와 보라 버튼 · 실제 놀이 커버 3장을 겹친 카드 옆에서 루미가 카드를 가리키는 그림 한 장.
// 장식(반짝이·방사형 빛·둥근 무늬)과 움직임(루미 떠 있기·카드 펼침)은 없다 — 버튼 화살표만 움직인다.
// 그림은 루미노리 주소에서 부른다(루미노리 public/images/luminori/promo/, 루미노리 scripts/promo-banner-art.mjs 로 만든다) —
// 9개 저장소에 그림을 복사하지 않는다. next/image 대신 <img>: 저장소마다 바깥 도메인 허용 설정이 필요 없게.
// 브랜드 정체성 표현을 위해 이 파일에 한해 루미노리 고유 색 hex를 쓴다(호스트 토큰 예외).
// 배치는 이 파일의 <style>(lmn-banner-* 이름)로만 — 사본이 들어가는 저장소의 tailwind 설정·전역 CSS에 기대지 않는다.

const LUMI_ORIGIN = 'https://luminori.kr';
const ART_SRC = `${LUMI_ORIGIN}/images/luminori/promo/plays-lumi-banner.webp`;

// 배치는 화면 폭이 아니라 배너 자기 폭으로 바꾼다(컨테이너 쿼리) — 푸터 칸·전시장 360px 칸처럼 화면은 넓고 배너만 좁을 때도 맞게.
//   좁을 때(~599px): 위에서부터 문구 → 그림 → 버튼.  넓을 때(600px~): 왼쪽에 문구와 그 아래 버튼, 오른쪽에 그림.
// 그림은 폭으로만 크기를 정하고 높이는 auto — 사이트 기본 CSS(img{max-width:100%;height:auto})가 폭을 칸에 묶어도 비율이 그대로다
// (높이를 고정하면 폭만 줄어 루미가 찌그러진다).
const BANNER_CSS =
  '.lmn-banner{container-type:inline-size}' +
  '.lmn-banner-body{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"text" "art" "btn";row-gap:14px}' +
  '.lmn-banner-text{grid-area:text}' +
  '.lmn-banner-art{grid-area:art;width:100%;max-width:340px}' +
  '.lmn-banner-btn{grid-area:btn;justify-self:start}' +
  '.lmn-banner-art img{display:block;width:100%;max-width:100%;height:auto}' +
  '@container (min-width:600px){' +
  '.lmn-banner-body{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"text art" "btn art";column-gap:24px;row-gap:8px}' +
  '.lmn-banner-text{align-self:end}' +
  '.lmn-banner-btn{align-self:start}' +
  '.lmn-banner-art{align-self:center;width:266px}}';

// 밝은 바탕 — 아주 연한 하늘(#eef7ff)에서 크림(루미노리 sun-50 #fffbeb)으로
const SKY = { backgroundImage: 'linear-gradient(105deg, #eef7ff 0%, #f6f9ff 45%, #fffbeb 100%)' };

export function LuminoriBanner({ selfId }) {
  return (
    <a
      href={familyUrl({ url: 'https://luminori.kr' }, selfId)}
      target="_blank"
      rel="noopener"
      className="lmn-banner group relative block cursor-pointer overflow-hidden rounded-3xl border border-[#ddd6fe] bg-[#f6f9ff] transition duration-200 hover:shadow-[0_10px_30px_rgba(124,58,237,0.16)]"
      style={SKY}
    >
      <style dangerouslySetInnerHTML={{ __html: BANNER_CSS }} />

      <span className="lmn-banner-body relative px-6 py-5">
        <span className="lmn-banner-text min-w-0">
          {/* 덩어리째 줄을 바꾼다 — 좁은 폭에서 "루미노리"가 둘로 갈라지지 않게 */}
          <span className="block text-[21px] font-extrabold leading-tight tracking-tight text-[#2a2a3a]">
            <span className="inline-block">36 сар–9 насны</span>{' '}
            <span className="inline-block">танин мэдэхүй,</span>{' '}
            <span className="inline-block">тоглож суралцах,</span>{' '}
            <span className="inline-block text-[#7c3aed]">Luminori</span>
          </span>
          <span className="mt-1 block text-[13px] font-medium text-[#64748b]">
            Санаж, харьцуулж, зам олж тоглоно — <span className="inline-block">үнэгүйгээр шууд эхлээрэй</span>{' '}
            <span className="inline-block">(яриа, бичвэр нь солонгос хэлээр)</span>
          </span>
        </span>

        {/* 실제 놀이 커버 3장(별빛 짝 찾기 · 어느 쪽이 더 많아? · 별빛 글자 공방)을 겹친 카드 + 카드 왼쪽에서 가리키는 루미 — 그림 한 장 */}
        <span aria-hidden className="lmn-banner-art pointer-events-none block">
          <img src={ART_SRC} width={640} height={240} loading="lazy" decoding="async" alt="" />
        </span>

        <span className="lmn-banner-btn inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#7c3aed] px-5 py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_3px_10px_rgba(124,58,237,0.3)] transition-colors group-hover:bg-[#6d28d9]">
          Үнэгүй тоглож үзэх
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </span>
    </a>
  );
}
