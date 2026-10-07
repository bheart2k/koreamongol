// 시안 C 「살아있는 지도」 — 장소·핀·챕터 데이터 (서버/클라이언트 공용, 직렬화 가능한 값만)
//
// 좌표는 모두 최종 이미지 기준 % (x, y).
//   d  : 데스크톱 정착 프레임 k1-end.webp (1672×941)
//   m  : 모바일 정착 프레임 m1-end.webp (941×1672)
//   mini: 기준 전경 k0-start.webp (1672×940) — 챕터 미니맵 마커용
// 새 몽골어 문구(장소명·챕터 제목·안내문)는 원어민 검수 필요.

import { LAB_ASSET_BASE } from '../_shared/asset';

// 에셋은 R2 CDN(cdn.koreamongol.com/design-lab/v1/c/...)에서 받는다
export const ASSET = `${LAB_ASSET_BASE}/c`;

export const heroArt = {
  desktop: {
    start: { day: `${ASSET}/k0-start.webp`, night: `${ASSET}/k0-start-night.webp` },
    settle: { day: `${ASSET}/k1-end.webp`, night: `${ASSET}/k1-end-night.webp` },
    // 플라이스루 프레임 시퀀스(12fps·1280×720) — 낮: 젠스파크 MiniMax H3(16:9로 크롭), 밤: Seedance 2.5
    seq: { day: `${ASSET}/seq-day`, night: `${ASSET}/seq-night` },
  },
  mobile: {
    start: { day: `${ASSET}/m0-start.webp`, night: `${ASSET}/m0-start-night.webp` },
    settle: { day: `${ASSET}/m1-end.webp`, night: `${ASSET}/m1-end-night.webp` },
    // 9:16 영상 없음 — 정지 이미지 줌·크로스페이드
    seq: { day: null, night: null },
  },
};

// 새 문구 (원어민 검수 필요)
export const copy = {
  scrollCue: 'Доош гүйлгээд газрын зургаа нээгээрэй',
  mapTitle: 'Таны шинэ хороолол',
  mapHint: 'Цэг дээр дарж хэрэгтэй гарын авлагаа сонгоорой',
  day: 'Өдөр',
  night: 'Шөнө',
  chaptersKicker: 'Газрын зураг',
  chaptersTitle: 'Газар бүр — нэг гарын авлага',
  finaleTitle: 'Хоёр нутаг, нэг зам',
  pause: 'Зогсоох',
  play: 'Тоглуулах',
  close: 'Хаах',
};

// guides: home-data guides[].id
export const places = [
  { id: 'home', name: 'Нутаг руу', guides: ['community'], d: [6, 17], m: [11, 27] },
  { id: 'airport', name: 'Нисэх буудал', guides: ['visa', 'arrival'], d: [31, 25], m: [29, 29] },
  { id: 'apartments', name: 'Орон сууц', guides: ['housing'], d: [46, 9], m: [46, 17] },
  { id: 'hospital', name: 'Эмнэлэг', guides: ['hospital', 'emergency'], d: [67, 14], m: [77, 25] },
  { id: 'bank', name: 'Банк', guides: ['money', 'exchange'], d: [81, 29], m: [87, 38] },
  { id: 'store', name: '24 цагийн дэлгүүр', guides: ['apps'], d: [78, 44], m: [81, 47] },
  { id: 'factory', name: 'Үйлдвэр', guides: ['jobs', 'severance'], d: [58, 37], m: [57, 41] },
  { id: 'school', name: 'Сургууль', guides: ['topik'], d: [36, 47], m: [28, 45] },
  { id: 'subway', name: 'Метро, автобус', guides: ['transport'], d: [51, 63], m: [42, 63] },
  { id: 'hanok', name: 'Ханок', guides: ['korean'], d: [84, 58], m: [83, 61] },
];

// 장소별 섹션 — img: 클로즈업, loop: Grok 루프 영상(없으면 정지 이미지만)
export const chapters = [
  {
    id: 'steppe', no: '01', title: 'Нутгаасаа', line: 'Аялал эхлэхээс өмнө — виз, шалгалт.',
    img: `${ASSET}/c1-steppe.webp`, loop: 'loop-c1', guides: ['visa', 'topik'], mini: [17, 54],
  },
  {
    id: 'arrive', no: '02', title: 'Ирэх', line: 'Онгоцноос буугаад хотод чөлөөтэй зорчих хүртэл.',
    // 활주로 착륙 장면으로 교체 — Grok 잔액 소진으로 이 장면의 루프는 없음
    img: `${ASSET}/c2-airport.webp`, loop: null, guides: ['arrival', 'transport'], mini: [61, 47],
  },
  {
    id: 'living', no: '03', title: 'Амьдрах', line: 'Байр, банк, өдөр тутмын хэрэгтэй зүйлс.',
    img: `${ASSET}/c3-living.webp`, loop: 'loop-c3', guides: ['housing', 'money', 'exchange', 'apps'], mini: [68, 38],
  },
  {
    id: 'work', no: '04', title: 'Ажиллах', line: 'Цалин, гэрээ, тэтгэмж — таны эрх.',
    img: `${ASSET}/c4-work.webp`, loop: 'loop-c4', guides: ['jobs', 'severance'], mini: [75, 52],
  },
  {
    id: 'health', no: '05', title: 'Эрүүл байх', line: 'Эмнэлэг, яаралтай тусламж — сандралгүйгээр.',
    img: `${ASSET}/c5-health.webp`, loop: 'loop-c5', guides: ['hospital', 'emergency'], mini: [80, 41],
  },
  {
    id: 'culture', no: '06', title: 'Хэл ба соёл', line: 'Сурах бичигт байдаггүй Солонгос.',
    img: `${ASSET}/c6-culture.webp`, loop: 'loop-c6', guides: ['korean'], extra: { label: 'Түргэн хариулт', href: '/tips' }, mini: [88, 63],
  },
];

// 미니맵 크롭 영역 (k0 기준 %) — 섬 두 개만 보이게
export const miniCrop = { x0: 6, x1: 96, y0: 30, y1: 86 };
