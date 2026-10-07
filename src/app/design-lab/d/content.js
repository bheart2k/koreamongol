// 시안 D 「전시된 두 고향」 — 장소·핀·전시실 데이터 (서버/클라이언트 공용, 직렬화 가능한 값만)
//
// 좌표는 모두 최종 이미지 기준 % (x, y).
//   d   : 데스크톱 근접 프레임 k1.webp (1672×941)
//   m   : 모바일 근접 프레임 m1.webp (941×1672)
//   plan: 기준 전경 k0.webp — 전시 안내도(미니맵) 마커용
// crop: 근접 프레임이 전경의 어느 영역을 다시 렌더한 것인지 (x, y, w — 같은 비율이라 h = w).
//       히어로 돌리는 전경을 이 영역으로 정확히 확대한 뒤 근접 프레임으로 교차한다.
// 새 몽골어 문구(장소명·전시실 제목·안내문)는 원어민 검수 필요.

import { LAB_ASSET_BASE } from '../_shared/asset';

// 에셋은 R2 cdn.koreamongol.com/design-lab/v1/d/ 에서 받는다
export const ASSET = `${LAB_ASSET_BASE}/d`;

export const heroArt = {
  desktop: {
    start: { day: `${ASSET}/k0.webp`, night: `${ASSET}/k0-night.webp` },
    settle: { day: `${ASSET}/k1.webp`, night: `${ASSET}/k1-night.webp` },
    crop: { x: 50.5, y: 42, w: 48 },
  },
  mobile: {
    start: { day: `${ASSET}/m0.webp`, night: `${ASSET}/m0-night.webp` },
    settle: { day: `${ASSET}/m1.webp`, night: `${ASSET}/m1-night.webp` },
    crop: null, // 근접 프레임이 세로 전용 구도라 정확한 crop 대신 초점 이동
    focus: { x: 50, y: 78 },
    zoom: 1.4,
  },
};

// 새 문구 (원어민 검수 필요)
export const copy = {
  exhibit: 'Хоёр нутаг — нэг үзэсгэлэн',
  scrollCue: 'Доош гүйлгээд макет руу ойртоорой',
  mapTitle: 'Таны шинэ хороолол',
  mapHint: 'Барилга дээрх цэгийг дарж хэрэгтэй гарын авлагаа сонгоорой',
  day: 'Өдөр',
  night: 'Шөнө',
  roomsKicker: 'Үзэсгэлэнгийн танхим',
  roomsTitle: 'Барилга бүр — нэг гарын авлага',
  room: 'Танхим',
  plan: 'Танхимын зураг',
  finaleTitle: 'Хоёр нутаг, нэг зам',
  close: 'Хаах',
};

// guides: home-data guides[].id
export const places = [
  { id: 'home', name: 'Нутаг руу', guides: ['community'], d: [12.5, 16], m: [12, 7] },
  { id: 'airport', name: 'Нисэх буудал', guides: ['visa', 'arrival'], d: [25, 31], m: [27, 24] },
  { id: 'apartments', name: 'Орон сууц', guides: ['housing'], d: [44, 22], m: [50, 16] },
  { id: 'hospital', name: 'Эмнэлэг', guides: ['hospital', 'emergency'], d: [44, 42], m: [44, 37] },
  { id: 'bank', name: 'Банк', guides: ['money', 'exchange'], d: [27, 56], m: [24, 55] },
  { id: 'store', name: '24 цагийн дэлгүүр', guides: ['apps'], d: [16, 72], m: [12, 68] },
  { id: 'factory', name: 'Үйлдвэр', guides: ['jobs', 'severance'], d: [68, 36], m: [79, 30] },
  { id: 'school', name: 'Сургууль', guides: ['topik'], d: [76, 49], m: [80, 46] },
  { id: 'subway', name: 'Метро, автобус', guides: ['transport'], d: [42, 67], m: [44, 66] },
  { id: 'hanok', name: 'Ханок', guides: ['korean'], d: [80, 63], m: [85, 63] },
];

// 전시실 — img: 모형 해당 부분 클로즈업 (밤 버전은 -night)
export const rooms = [
  {
    id: 'steppe', no: '01', title: 'Нутгаасаа', line: 'Аялал эхлэхээс өмнө — виз, шалгалт.',
    img: `${ASSET}/r1-steppe.webp`, guides: ['visa', 'topik'], plan: [22, 68],
  },
  {
    id: 'arrive', no: '02', title: 'Ирэх', line: 'Онгоцноос буугаад хотод чөлөөтэй зорчих хүртэл.',
    img: `${ASSET}/r2-arrive.webp`, guides: ['arrival', 'transport'], plan: [60, 58],
  },
  {
    id: 'living', no: '03', title: 'Амьдрах', line: 'Байр, банк, өдөр тутмын хэрэгтэй зүйлс.',
    img: `${ASSET}/r3-living.webp`, guides: ['housing', 'money', 'exchange', 'apps'], plan: [60, 74],
  },
  {
    id: 'work', no: '04', title: 'Ажиллах', line: 'Цалин, гэрээ, тэтгэмж — таны эрх.',
    img: `${ASSET}/r4-work.webp`, guides: ['jobs', 'severance'], plan: [83, 59],
  },
  {
    id: 'health', no: '05', title: 'Эрүүл байх', line: 'Эмнэлэг, яаралтай тусламж — сандралгүйгээр.',
    img: `${ASSET}/r5-health.webp`, guides: ['hospital', 'emergency'], plan: [71, 63],
  },
  {
    id: 'culture', no: '06', title: 'Хэл ба соёл', line: 'Сурах бичигт байдаггүй Солонгос.',
    img: `${ASSET}/r6-culture.webp`, guides: ['korean'], extra: { label: 'Түргэн хариулт', href: '/tips' }, plan: [89, 74],
  },
];

// 전시 안내도 크롭 영역 (k0 기준 %) — 두 모형만 보이게
export const planCrop = { x0: 4, x1: 97, y0: 40, y1: 88 };
