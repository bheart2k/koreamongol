// /design-lab 비교 인덱스용 시안 메타. 시안이 나오면 PM 전달값으로 cover·metrics 만 채운다.
//
// cover   : { src: labAsset('/design-lab/a/cover.webp'), alt: '...' } — '/design-lab/{a..e}/…' 경로를 labAsset 이 R2 cdn.koreamongol.com/design-lab/v1 URL 로 변환. null 이면 자리표시 패널.
// metrics : 실측 MB 값. null 이면 '측정 전'.
//           { firstView, desktop, mobile }  (MB 숫자)  +  lighthouse (모바일 성능 점수 0-100, 선택)

import { labAsset } from './asset';

export const BUDGET = { firstView: 1.5, desktop: 25, mobile: 10 }; // MB, brief 3절
export const METRICS_NOTE = '에셋 기준, dev JS 제외'; // 실측 값의 측정 기준 (카드에 표기)
export const ARCHIVED_LABEL = '참고용 보관 (종료)'; // archived: true 인 시안 카드에 표기

export const variants = [
  {
    id: 'a',
    letter: 'A',
    href: '/design-lab/a',
    en: 'Cinematic Sky Journey',
    name: '같은 하늘 아래',
    summary:
      '스크롤이 하루의 흐름이 됩니다. 초원의 새벽에서 서울의 낮, 노을, 밤의 별까지 — 하나의 하늘이 두 나라를 잇습니다.',
    keywords: ['시네마틱 실사', '스크롤 = 하루', '프레임 시퀀스 스크럽', '챕터 6장'],
    pros: [
      '첫인상의 감정적 임팩트가 가장 큼 — "같은 하늘 아래"라는 메시지',
      '가이드 14개를 오기 전 → 도착 → 생활 순서의 챕터로 자연스럽게 정리',
      '긴급번호는 화면 하단 플로팅 버튼으로 어디서나 접근',
    ],
    risks: [
      '영상·프레임 시퀀스 비중이 커서 용량 예산 초과 위험이 가장 큼',
      '모바일 데이터·느린 망에서는 정지 이미지 대체에 의존',
      '가이드가 챕터 뒤에 있어 한눈에 훑기는 B보다 불리',
    ],
    cover: { src: labAsset('/design-lab/a/cover.webp'), alt: 'Нэг тэнгэр дор — Улаанбаатараас Сөүл хүртэл' },
    metrics: { firstView: 0.37, desktop: 17.2, mobile: 8.8 },
  },
  {
    id: 'b',
    letter: 'B',
    href: '/design-lab/b',
    en: 'Editorial Duality',
    name: '두 개의 고향',
    summary:
      '몽골과 한국의 짝 이미지를 나란히 놓고 하나로 합칩니다. 잡지처럼 조용하고 품격 있는 에디토리얼 홈.',
    keywords: ['하이엔드 에디토리얼', '딥틱이 하나로', '타이포 주도', '시네마그래프'],
    pros: [
      '정지 사진 중심이라 용량이 가장 가벼울 것으로 설계됨',
      '대형 타이포 목록으로 가이드 14개를 가장 빠르게 훑을 수 있음',
      '두 문화를 대등하게 놓아 몽골인·한국인 모두의 자긍심을 겨냥',
    ],
    risks: [
      '화려함보다 품격으로 승부 — A·C보다 첫 인상이 차분함',
      '키릴 문자를 지원하는 디스플레이 서체 선택에 제약',
      '짝 이미지의 사진 품질과 문화적 정확성을 육안 검수해야 함',
    ],
    cover: { src: labAsset('/design-lab/b/cover.webp'), alt: 'Хоёр нутаг — нэг тэнгэрийн хаяа' },
    metrics: { firstView: 0.67, desktop: 4.7, mobile: 3.2 },
    archived: true, // 참고용 보관 — 사용자 결정으로 종료
  },
  {
    id: 'c',
    letter: 'C',
    href: '/design-lab/c',
    en: 'Living Diorama',
    name: '살아있는 지도',
    summary:
      '홈 자체가 탐험하는 미니어처 세계입니다. 서울 동네의 건물이 곧 가이드가 되고, 핀을 누르면 해당 가이드로 이어집니다.',
    keywords: ['3D 미니어처 디오라마', '핫스팟 핀', '틸트 패럴랙스', '낮/밤 전환'],
    pros: [
      '가이드를 "장소"로 보여주어 새로 온 사람에게 가장 직관적인 탐색',
      '핀·틸트·낮밤 전환 등 인터랙션의 재미와 기억에 남는 정체성',
      '다크모드와 연동되는 야간 디오라마',
    ],
    risks: [
      '3D 미니어처의 완성도 편차가 크면 유치해 보일 수 있음',
      '핀 오버레이가 % 좌표라 화면 비율별 정합이 까다로움',
      '모바일 터치 탐색 설계 난도가 높음',
    ],
    cover: { src: labAsset('/design-lab/c/cover.webp'), alt: 'Хоёр нутаг, нэг зам' },
    metrics: { firstView: 0.3, desktop: 2.8, mobile: 1.3 },
  },
  // D·E: 2차 라운드 (docs/design-lab/brief-de.md). 한 줄 설명·강점·리스크는 브리프에서 옮김
  {
    id: 'd',
    letter: 'D',
    href: '/design-lab/d',
    en: 'Architectural Maquette',
    name: '전시된 두 고향',
    summary:
      'C의 구조(지도 핀 내비게이션, 정보 중심 레이아웃)는 그대로 두고, 그림을 장난감 디오라마에서 건축가의 프레젠테이션 모형으로 격상한다.',
    keywords: ['건축 프레젠테이션 모형', '핀 내비게이션', '갤러리 조명', '영상 없음'],
    pros: [
      'C의 핀 내비게이션·정보 중심 구조를 유지 — C에서 "목적에 가장 충실"하다는 평',
      '장난감 느낌을 걷어내고 갤러리 조명의 석고·오크·브라스 모형으로 격상',
      '영상 없이 이미지와 코드 모션만 쓰고, 고정 스크롤은 히어로 1곳(최대 150vh)',
    ],
    risks: [
      '석고·브라스 재질감이 이미지 품질에 크게 좌우됨',
      '핀 좌표를 최종 이미지가 나온 뒤 다시 잡아야 함',
      '몽골 초원 모형이 알프스처럼 보이지 않도록 형태를 육안 검수해야 함',
    ],
    cover: { src: labAsset('/design-lab/d/cover.webp'), alt: 'Хоёр нутаг — нэг үзэсгэлэн' },
    metrics: { firstView: 0.3, desktop: 1.25, mobile: 1.29 },
  },
  {
    id: 'e',
    letter: 'E',
    href: '/design-lab/e',
    en: 'Cinematic Sky · Essential',
    name: '같은 하늘 아래 · 에센셜',
    summary:
      'A의 시네마틱 히어로와 \'하루의 흐름\' 컨셉은 살리고, 히어로 이후는 정보를 빠르게 찾는 홈으로 재구성한다.',
    keywords: ['A의 시네마틱 히어로', '히어로 ≤200vh', '챕터 칩 바', '영상 동시 1개'],
    pros: [
      'A의 히어로 연출과 기존 에셋을 그대로 살림 — A에서 "히어로 연출은 좋았다"는 평',
      '히어로 이후 고정 스크롤 없음, 챕터 칩 바와 가이드 14개 전체 그리드로 정보 접근 개선',
      '동시에 재생되는 영상은 최대 1개로 절제',
    ],
    risks: [
      '히어로가 520vh에서 최대 200vh로 줄어 스크럽 연출이 짧아짐',
      '챕터 칩 바가 Navbar 바로 아래에 고정되어 화면 상단을 차지',
      '전체 높이가 A의 절반 이하라는 목표는 실측으로 확인해야 함',
    ],
    cover: { src: labAsset('/design-lab/e/cover.webp'), alt: 'Нэг тэнгэр дор' },
    metrics: { firstView: 0.3, desktop: 10.3, mobile: 7.0 },
  },
];

// 평가 기준 (brief 3절)
export const criteria = {
  budget: [
    { label: '첫 화면', value: `≤ ${BUDGET.firstView}MB` },
    { label: '전체 · 데스크톱', value: `≤ ${BUDGET.desktop}MB` },
    { label: '전체 · 모바일', value: `≤ ${BUDGET.mobile}MB` },
  ],
  qa: [
    'Lighthouse 모바일 점수',
    '390px · 1440px 스크린샷 확인',
    'saveData·느린 망에서 정지 이미지로 대체',
    'prefers-reduced-motion 에서 스크럽·루프 없음',
  ],
};
