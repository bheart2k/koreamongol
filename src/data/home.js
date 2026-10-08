// 홈(/) 콘텐츠 — 문구는 기존 홈(HomeContent.jsx) 그대로, 장소·핀·챕터는 design-lab 시안 C 에서 옮김
//
// 사용 규칙
// - 서버 컴포넌트(HomeView)에서 import 해서 쓴다.
// - guides[].icon 은 lucide 컴포넌트 참조라 클라이언트 props 로 넘길 수 없다 → iconName(문자열)을 쓴다.
// - 최근 업데이트는 서버에서 getRecentUpdates(5) (@/lib/recent-updates) 를 직접 호출한다.
// - 좌표는 모두 이미지 기준 % (x, y).
//     d   : 데스크톱 착지 이미지 k1-end.webp (1672×941)
//     m   : 모바일 착지 이미지 m1-end.webp (941×1672)
//     mini: 전경 k0-start.webp (1672×940) — 챕터 미니맵 마커용
// - C 에서 새로 쓴 몽골어 문구(copy·places·chapters·alts)는 원어민 검수 필요.

import {
  FileText, MapPin, Heart, Banknote, BookOpen, Users, Briefcase, Home, GraduationCap,
  Calculator, Train, Phone, Smartphone,
} from 'lucide-react';

// 홈 에셋은 R2 CDN(home/v1/)에서 받는다. 파일을 바꿀 때는 새 버전 경로로 올리고 이 값만 바꾼다.
export const HOME_ASSET_BASE = 'https://cdn.koreamongol.com/home/v1';

const A = HOME_ASSET_BASE;

export const hero = {
  eyebrow: 'KoreaMongol',
  titleLines: ['Солонгост', 'тавтай морил!'],
  title: 'Солонгост тавтай морил!',
  lead: 'Виз, банк, эмнэлэг, цалин, мөнгөн шилжүүлэг — Солонгост амьдрахад хэрэгтэй бүх мэдээлэл монгол хэлээр, үнэ төлбөргүй.',
  cta: { label: 'Бүх гарын авлага үзэх', href: '#guides' },
};

// 히어로 기준 그림 (핀 좌표 기준 이미지). 밤 장면은 다크 테마를 실제로 쓸 때만 받는다.
// 데스크톱 낮 = 기준 그림 2차판(비행기·버스 제거, 격납고·지하차도 입구 추가). 밤·모바일은 2차판 준비 전까지 착지 이미지.
export const heroArt = {
  desktop: { day: `${A}/hero-base-day-v2.webp`, night: `${A}/k1-end-night.webp` },
  mobile: { day: `${A}/m1-end.webp`, night: `${A}/m1-end-night.webp` },
};

// 히어로 움직임 레이어 (c-final §3) — 데스크톱 낮 전용. 그림은 home/v1/hero/, 좌표는 전부 그림 상자 기준 %.
// 탈것: px = 스프라이트 파일 크기, w = 표시 폭(상자 폭 대비 %), shadow = 그림자 파일 크기.
//       기준점 = 그림 아래 가운데(바퀴 닿는 점). 그림자는 기준점에서 오른쪽·아래로 0.2%.
// 구간: dur(초)·path(기준점 경로)·w([시작, 끝])·ease·fadeIn/fadeOut(구간 대비 비율)·shadowFrom(그림자가 나타나기 시작하는 진행도)
const HM = `${A}/hero`;

export const heroMotion = {
  base: HM,
  sprites: {
    'plane-approach': { px: [156, 94], shadow: [172, 68], heading: 13.9 },
    'plane-roll': { px: [155, 93], shadow: [171, 67], heading: 13.9 },
    'bus-in': { px: [157, 131], shadow: [173, 88] },
  },
  // 비행기: 좌상단 화면 밖 → 금빛 항로 선 위를 따라 하강(그림 가운데가 선 위, 방향 고정 — 회전 없음, 사용자 지시)
  //   → 선 끝(활주로 끝)보다 바퀴 높이(그림 반 높이 2.0%)만큼 위 지점 → 바퀴가 활주로 끝에 닿음
  //   → 중앙선(흰 점선) 위 감속 → 정차 6초 → 페이드 → 다음 비행기 (20초마다)
  //   금빛 선: 기준 그림의 선 픽셀(108행)을 따서 맞춘 곡선(평균 오차 0.9px). 시작은 선 위쪽 끝의 진행 방향(30°)으로 화면 밖까지 연장.
  //   선 끝(10.106, 34.304)은 활주로 중앙선 y = 36.35 + (x - 14.74) × 0.4379 위(차이 0.02%). heading = 그림 머리 방향(°).
  //   도착 지점만 중앙선보다 1.2% 아래(39.09 → 40.3) — 몸통이 흰 실선 위(왼쪽) 도로로 벗어나 보이지 않게 (사용자 지시)
  plane: {
    cycle: 20,
    segments: [
      {
        pose: 'plane-approach', dur: 4.6, ease: 'linear', w: [3.83, 3.83], ref: 0.5, noShadow: true,
        path: [[-4.3, 6.25], [-0.067, 10.627], [0.916, 11.69], [1.816, 12.752], [2.639, 13.815], [3.391, 14.878], [4.08, 15.94],
          [4.711, 17.003], [5.289, 18.066], [5.819, 19.129], [6.305, 20.191], [6.753, 21.254], [7.165, 22.317], [7.545, 23.379],
          [7.896, 24.442], [8.221, 25.505], [8.521, 26.567], [8.8, 27.63], [9.058, 28.693], [9.297, 29.756], [9.516, 30.818],
          [9.718, 31.881], [9.79, 32.3]],
      },
      { pose: 'plane-roll', dur: 4.8, ease: 'out', w: [3.71, 3.71], path: [[9.79, 34.3], [21.0, 40.3]] },
      { pose: 'plane-roll', dur: 6.0, ease: 'linear', w: [3.71, 3.71], path: [[21.0, 40.3]] },
      { pose: 'plane-roll', dur: 1.2, ease: 'linear', w: [3.71, 3.71], fadeOut: 1, path: [[21.0, 40.3]] },
    ],
  },
  // 버스: 지도(섬) 앞쪽 끝(49.0, 79.2)에서 나타나 → 회전 없이 곧게 → 오른쪽 지하차도(지하철 유리 지붕 오른쪽 위·연못 위) 안으로
  //   들어가며 사라짐 (16초마다). 출발점 = 터널 입구 직선을 지도 끝까지 늘린 점. 자세 그림은 뒷모습(bus-in) 하나.
  //   차선 방향: 입구 차선 흰 선·벽 밑선 22~28°, 경로 24.4°, 그림 차체 옆면 약 23°.
  //   경로는 입구 가운데선에서 차선 바깥쪽(오른쪽 아래)으로 0.25%·0.96% 옮긴 선 — 그림 기준점(아래 가운데)이 차체 바닥 가운데가 아니라서,
  //   기준 그림에 합성해 보며 차체가 램프 벽 오른쪽 차선 안을 지나 아치 입구 안으로 들어가는 위치로 맞춤.
  bus: {
    cycle: 16,
    offset: 3,
    segments: [
      // rot: 그림을 시계 방향으로 살짝(3°) 돌림 (사용자 지시)
      { pose: 'bus-in', dur: 9.0, ease: 'linear', w: [3.75, 3.4], rot: 3, fadeIn: 0.06, fadeOut: 0.12, path: [[49.0, 79.19], [74.45, 58.67]] },
    ],
  },
  // 앞가림(탈것 위 레이어) — box = left, top, w, h %. cut = 앞가림 그림 안에서 빼는 영역(그림 기준 %):
  //   아치 왼쪽 안쪽 테는 버스보다 뒤(먼 쪽)에 있어 버스 위에 그리면 줄무늬로 보이므로 뺀다.
  occluders: [
    { name: 'occ-tunnel-right', box: [71.11, 53.67, 5.26, 7.86], cut: [[20, 16], [36, 16], [36, 48], [20, 48]] },
    // 연못 정원 나무: 기준 그림을 한 겹 더 깔고 이 다각형(상자 기준 %)으로 잘라 버스 위에 덮는다 — 정원 구간에서 버스가 나무 뒤로 가려짐.
    //   윗선 = 기준 그림에서 딴 나무 윤곽(지하철역 쪽 덤불은 버스보다 뒤라 제외), 아랫선 = 버스 경로선 + 0.8%.
    {
      base: true,
      clip: [
        [54, 75.96], [54.25, 75.76], [54.5, 75.56], [54.75, 74.39], [55, 73.96], [55.25, 73.75], [55.5, 73.11], [55.75, 72.69],
        [56, 72.48], [56.25, 72.48], [56.5, 72.58], [56.75, 72.79], [57, 70.56], [57.25, 69.39], [57.5, 68.54], [57.75, 68.01],
        [58, 69.71], [58.25, 67.8], [58.5, 67.8], [58.75, 68.44], [59, 68.97], [59.25, 68.5], [59.5, 68.12], [59.75, 67.4],
        [60, 66.9], [60.25, 66.52], [60.5, 66.42], [60.75, 67.06], [61, 66.95], [61.25, 67.27], [61.5, 67.8], [61.75, 67.16],
        [62, 65.99], [62.25, 65.57], [62.5, 65.04], [62.75, 64.4], [63, 64.19], [63.25, 64.19], [63.5, 64.19], [63.75, 64.82],
        [64, 65.25], [64.25, 65.67], [64.5, 66.21], [64.75, 65.99], [65, 65.57], [65.25, 65.36], [65.5, 65.04], [65.75, 64.19],
        [66, 63.44], [66.25, 63.97], [66.5, 64.19], [66.75, 63.76], [67, 64.19], [67.25, 64.82], [67.5, 65.04], [67.75, 64.61],
        [68, 64.29], [68.25, 64.19], [68.5, 64.27], [68.75, 63.44], [69, 63.23], [69, 63.86], [68.75, 64.07], [68.5, 64.27],
        [68.25, 64.47], [68, 64.67], [67.75, 64.87], [67.5, 65.07], [67.25, 65.28], [67, 65.48], [66.75, 65.68], [66.5, 65.88],
        [66.25, 66.08], [66, 66.28], [65.75, 66.49], [65.5, 66.69], [65.25, 66.89], [65, 67.09], [64.75, 67.29], [64.5, 67.49],
        [64.25, 67.7], [64, 67.9], [63.75, 68.1], [63.5, 68.3], [63.25, 68.5], [63, 68.7], [62.75, 68.9], [62.5, 69.11],
        [62.25, 69.31], [62, 69.51], [61.75, 69.71], [61.5, 69.91], [61.25, 70.11], [61, 70.32], [60.75, 70.52], [60.5, 70.72],
        [60.25, 70.92], [60, 71.12], [59.75, 71.32], [59.5, 71.53], [59.25, 71.73], [59, 71.93], [58.75, 72.13], [58.5, 72.33],
        [58.25, 72.53], [58, 72.74], [57.75, 72.94], [57.5, 73.14], [57.25, 73.34], [57, 73.54], [56.75, 73.74], [56.5, 73.94],
        [56.25, 74.15], [56, 74.35], [55.75, 74.55], [55.5, 74.75], [55.25, 74.95], [55, 75.15], [54.75, 75.36], [54.5, 75.56],
        [54.25, 75.76], [54, 75.96],
      ],
    },
  ],
  // 버스가 입구에 걸릴 때 터널 위로 비어져 나오는 지붕을 숨기는 구역 (아치 안쪽 윗선 위만 — 왼쪽 세로 1px 틈은 줄무늬로 보여 뺐음)
  busHide: [
    [[72.43, 55.47], [72.51, 54.57], [72.79, 54.16], [73.62, 53.97], [74.06, 54.05], [74.76, 54.34], [75.24, 54.65],
      [75.66, 55.15], [75.94, 55.9], [75.97, 56.48], [77.75, 56.48], [77.75, 48.88], [72.43, 48.88]],
  ],
  // 굴뚝 연기: 꼭대기에서 1→4 순서로 커지고 옅어짐 (w = 표시 폭 %)
  smoke: { at: [48.74, 28.91], puffs: [{ name: 'smoke-1', w: 0.84 }, { name: 'smoke-2', w: 1.32 }, { name: 'smoke-3', w: 1.91 }, { name: 'smoke-4', w: 2.03 }] },
  // 구름 띠(가로 반복 타일) — w·h = 타일 표시 크기 %, top = 띠 위치 %, sec = 타일 하나만큼 흐르는 시간
  clouds: {
    far: { name: 'cloud-far', w: 99.4, h: 26.35, top: 34, sec: 140 }, // 섬 양옆으로만 보이게(금빛 항로를 가리지 않게)
    near: { name: 'cloud-near', w: 70.45, h: 50.48, top: 76, sec: 80 },
  },
  baseImage: `${A}/hero-base-day-v2.webp`, // 기준 그림(앞가림용, heroArt 와 같은 파일이라 캐시 재사용)
  maskIsland: `${HM}/mask-island.webp`,
  pond: { mask: `${HM}/mask-pond.webp`, box: [66.15, 65.99, 14.83, 11.37] },
  // 낮 불빛 — 구급차 경광등 · 관제탑 항공등 · 편의점 (x, y = 중심 %, w·h = 크기 %)
  lights: [
    { kind: 'beacon', x: 67.45, y: 26.85, w: 1.3, h: 2.3, sec: 1.2 },
    { kind: 'beacon', x: 24.16, y: 17.9, w: 0.9, h: 1.6, sec: 2.6, delay: 0.7 },
    { kind: 'warm', x: 75.5, y: 47.8, w: 6.6, h: 6.4, sec: 4.6 },
  ],
};

export const situationsHeading = 'Яг одоо танд юу хэрэгтэй вэ?';

export const situations = [
  { emoji: '🛬', label: 'Би дөнгөж ирлээ', href: '/arrival' },
  { emoji: '💸', label: 'Цалингаа аваагүй', href: '/jobs#jobs-rights' },
  { emoji: '🏦', label: 'Гэртээ мөнгө илгээх', href: '/money' },
  { emoji: '🏥', label: 'Эмч үзүүлэх хэрэгтэй', href: '/hospital' },
  { emoji: '💼', label: 'Ажил хайж байна', href: '/jobs' },
  { emoji: '⚡', label: 'Түргэн хариулт', href: '/tips' },
];

export const emergency = {
  ariaLabel: 'Яаралтай утасны дугаарууд',
  items: [
    { emoji: '🚑', label: 'Яаралтай:', number: '119' },
    { emoji: '🚔', label: 'Цагдаа:', number: '112' },
    { emoji: '📞', label: 'Гадаадын иргэн:', number: '1345' },
  ],
};

export const guidesSection = {
  id: 'guides',
  title: 'Гарын авлага',
  subtitle: 'Солонгост амьдрахад хэрэгтэй бүх мэдээлэл',
};

// id 는 places[].guides · chapters[].guides 에서 참조 (korean = /korean-life)
export const guides = [
  { id: 'visa', href: '/visa', icon: FileText, iconName: 'FileText', title: 'Визний гарын авлага', desc: 'E-9, D-2, D-4 визний мэдээлэл' },
  { id: 'arrival', href: '/arrival', icon: MapPin, iconName: 'MapPin', title: 'Ирсний дараа', desc: 'Бүртгэл, банк, утас нээлгэх' },
  { id: 'hospital', href: '/hospital', icon: Heart, iconName: 'Heart', title: 'Эмнэлэг / Яаралтай', desc: 'Эмнэлэгт хандах, яаралтай дуудлага' },
  { id: 'money', href: '/money', icon: Banknote, iconName: 'Banknote', title: 'Мөнгө ба санхүү', desc: 'Шилжүүлэг, банк, карт, даатгал' },
  { id: 'korean', href: '/korean-life', icon: BookOpen, iconName: 'BookOpen', title: 'Бодит Солонгос хэл', desc: 'Сурах бичигт байдаггүй чухал зүйлс' },
  { id: 'jobs', href: '/jobs', icon: Briefcase, iconName: 'Briefcase', title: 'Ажил ба хөдөлмөр', desc: 'Цалин, гэрээ, эрхийн хамгаалалт' },
  { id: 'housing', href: '/housing', icon: Home, iconName: 'Home', title: 'Байр ба орон сууц', desc: 'Барьцаа, түрээс, гэрээ, амьдрал' },
  { id: 'topik', href: '/topik', icon: GraduationCap, iconName: 'GraduationCap', title: 'TOPIK / EPS-TOPIK', desc: 'Шалгалтын бүтэц, бүртгэл, бэлтгэл' },
  { id: 'transport', href: '/transport', icon: Train, iconName: 'Train', title: 'Тээврийн гарын авлага', desc: 'Метро, автобус, такси, KTX' },
  { id: 'emergency', href: '/emergency', icon: Phone, iconName: 'Phone', title: 'Яаралтай утасны дугаарууд', desc: '119, 112, 1345 — бүх дугаар' },
  { id: 'exchange', href: '/exchange', icon: Calculator, iconName: 'Calculator', title: 'Ханш тооцоолуур', desc: 'KRW ↔ MNT ханш хөрвүүлэг' },
  { id: 'severance', href: '/severance', icon: Calculator, iconName: 'Calculator', title: 'Тэтгэмж тооцоолуур', desc: 'Ажлаас гарах тэтгэмж тооцоолох' },
  { id: 'apps', href: '/apps', icon: Smartphone, iconName: 'Smartphone', title: 'Хэрэгтэй апп', desc: 'KakaoTalk, Coupang, тооцоолуурууд' },
  { id: 'community', href: '/community/blog', icon: Users, iconName: 'Users', title: 'Нутгийнхан', desc: 'Хамт олны мэдээ, асуулт хариулт' },
];

export const updatesHeading = 'Сүүлийн шинэчлэл';

// 오늘의 환율 (ExchangeMiniCard 의 문구·계산과 동일)
export const exchange = {
  title: 'Өнөөдрийн ханш',
  unit: '1,000 ₩ тутамд',
  cta: 'Тооцоолуур',
  href: '/exchange',
  api: '/api/exchange-rate', // 응답: { rate } (1 KRW 당 MNT), 1시간 캐싱
};

export const about = {
  title: 'KoreaMongol',
  paragraphs: [
    'Солонгост амьдарч буй Монгол иргэдэд зориулсан платформ. Визний мэдээлэл, банк нээх, эмнэлэг хандах зэрэг бодит амьдралын гарын авлагыг нэг дороос олоорой.',
    'Нутаг — таны Солонгос амьдралын найдвартай хөтөч.',
  ],
  link: { label: 'Дэлгэрэнгүй', href: '/about' },
};

export const donate = {
  strong: 'Нэг аяга кофегоор дэмжээрэй.',
  text: 'Сайтын тогтвортой үйл ажиллагаанд тусална.',
  link: { label: 'Дэмжих', href: '/donate' },
};

// 새 문구 (원어민 검수 필요)
export const copy = {
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

// 지도 핀 — guides: guides[].id
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

// 장소별 섹션 — img: 클로즈업, loop: 루프 영상 이름(없으면 정지 이미지만)
export const chapters = [
  {
    id: 'steppe', no: '01', title: 'Нутгаасаа', line: 'Аялал эхлэхээс өмнө — виз, шалгалт.',
    img: `${A}/c1-steppe.webp`, loop: 'loop-c1', guides: ['visa', 'topik'], mini: [17, 54],
  },
  {
    id: 'arrive', no: '02', title: 'Ирэх', line: 'Онгоцноос буугаад хотод чөлөөтэй зорчих хүртэл.',
    img: `${A}/c2-airport.webp`, loop: null, guides: ['arrival', 'transport'], mini: [61, 47],
  },
  {
    id: 'living', no: '03', title: 'Амьдрах', line: 'Байр, банк, өдөр тутмын хэрэгтэй зүйлс.',
    img: `${A}/c3-living.webp`, loop: 'loop-c3', guides: ['housing', 'money', 'exchange', 'apps'], mini: [68, 38],
  },
  {
    id: 'work', no: '04', title: 'Ажиллах', line: 'Цалин, гэрээ, тэтгэмж — таны эрх.',
    img: `${A}/c4-work.webp`, loop: 'loop-c4', guides: ['jobs', 'severance'], mini: [75, 52],
  },
  {
    id: 'health', no: '05', title: 'Эрүүл байх', line: 'Эмнэлэг, яаралтай тусламж — сандралгүйгээр.',
    img: `${A}/c5-health.webp`, loop: 'loop-c5', guides: ['hospital', 'emergency'], mini: [80, 41],
  },
  {
    id: 'culture', no: '06', title: 'Хэл ба соёл', line: 'Сурах бичигт байдаггүй Солонгос.',
    img: `${A}/c6-culture.webp`, loop: 'loop-c6', guides: ['korean'], extra: { label: 'Түргэн хариулт', href: '/tips' }, mini: [88, 63],
  },
];

// 챕터 미니맵 — 전경 이미지와 크롭 영역 (k0 기준 %, 섬 두 개만 보이게)
export const miniImg = `${A}/k0-start.webp`;
export const miniCrop = { x0: 6, x1: 96, y0: 30, y1: 86 };

// 마무리 섹션 밤 장면
export const finaleArt = { desktop: `${A}/k0-start-night.webp`, mobile: `${A}/m0-start-night.webp` };

export const alts = {
  settle: 'Нисэх буудал, орон сууц, эмнэлэг, банк, дэлгүүр, үйлдвэр, сургууль, метро, ханок бүхий Сөүлийн хороолол',
  steppe: 'Гэр, адуу, гол бүхий Монгол тал нутаг',
  arrive: 'Нисэх буудал ба автобус',
  living: 'Орон сууц, банк, 24 цагийн дэлгүүр',
  work: 'Үйлдвэр ба чингэлэгүүд',
  health: 'Эмнэлэг ба түргэн тусламжийн машин',
  culture: 'Ханок байшин, цөөрөм ба сургууль',
  finale: 'Шөнийн тэнгэрт гэрэлтэх хоёр арал',
};
