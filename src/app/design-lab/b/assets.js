// 시안 B 미디어 매니페스트 — 에셋은 R2 cdn.koreamongol.com/design-lab/v1/b/
// hz = 지평선 높이(이미지 높이 대비, 픽셀 실측), ar = 가로/세로 비
import { LAB_ASSET_BASE } from '../_shared/asset';

const IMG = `${LAB_ASSET_BASE}/b/img`;
const VID = `${LAB_ASSET_BASE}/b/video`;

export const heroMedia = {
  mn: {
    src: `${IMG}/hero-mn.webp`, mobile: `${IMG}/hero-mn-m.webp`,
    // 모바일 연기 영상은 품질 미달(연기가 짙음) → 재생성 전까지 정지 이미지 (null)
    video: `${VID}/hero-mn-cg.mp4`, videoMobile: null,
    alt: 'Манантай үүрийн туйл тал дээр ганц цагаан гэр, яндангаас нь утаа босож байна',
  },
  kr: {
    src: `${IMG}/hero-kr.webp`, mobile: `${IMG}/hero-kr-m.webp`,
    video: `${VID}/hero-kr-cg.mp4`, videoMobile: `${VID}/hero-kr-cg-m.mp4`,
    alt: 'Үүрийн манан бүрхсэн Хан мөрөн, цаана нь Намсан уул, Сөүлийн орон сууцууд ба гүүр',
  },
};

// 딥틱 짝 (Plate I–IV)
export const plates = [
  {
    id: 'roof',
    numeral: 'I',
    mn: { src: `${IMG}/p1-mn.webp`, sm: `${IMG}/p1-mn-sm.webp`, word: 'Тооно', alt: 'Гэрийн тооно, түүнээс цацраг мэт тархсан унь' },
    kr: { src: `${IMG}/p1-kr.webp`, sm: `${IMG}/p1-kr-sm.webp`, word: 'Чхома', hangul: '처마', alt: 'Ханок байшингийн дээврийн булан ба сэнс мэт дэлгэсэн дам нуруу' },
  },
  {
    id: 'wall',
    numeral: 'II',
    mn: { src: `${IMG}/p2-mn.webp`, sm: `${IMG}/p2-mn-sm.webp`, word: 'Эсгий', alt: 'Гэрийн цагаан эсгий, оёдол ба бүслүүр' },
    kr: { src: `${IMG}/p2-kr.webp`, sm: `${IMG}/p2-kr-sm.webp`, word: 'Ханджи', hangul: '한지', alt: 'Модон хүрээтэй ханджи цаасан хаалгаар гэрэл нэвтэрч байна' },
  },
  {
    id: 'tea',
    numeral: 'III',
    mn: { src: `${IMG}/p4-mn.webp`, sm: `${IMG}/p4-mn-sm.webp`, video: `${VID}/p4-mn-cg.mp4`, word: 'Сүүтэй цай', alt: 'Аяганд хийсэн уураа савсан сүүтэй цай' },
    kr: { src: `${IMG}/p4-kr.webp`, sm: `${IMG}/p4-kr-sm.webp`, video: `${VID}/p4-kr-cg.mp4`, word: 'Чхатсабаль', hangul: '찻사발', alt: 'Солонгос шавар аяганд уураа савсан ногоон цай' },
  },
  {
    id: 'cloth',
    numeral: 'IV',
    mn: { src: `${IMG}/p5-mn.webp`, sm: `${IMG}/p5-mn-sm.webp`, word: 'Дээл', alt: 'Хар хөх торгон дээлийн даавуу, алтан шаргал энгэр ба товч' },
    kr: { src: `${IMG}/p5-kr.webp`, sm: `${IMG}/p5-kr-sm.webp`, video: `${VID}/p5-kr-cg.mp4`, word: 'Ханбок', hangul: '한복', alt: 'Зааны ясан өнгийн нимгэн торго ба тоосгон улаан тууз' },
  },
];

export const finaleMedia = {
  src: `${IMG}/finale.webp`, mobile: `${IMG}/finale-m.webp`,
  video: `${VID}/finale-cg.mp4`, videoMobile: `${VID}/finale-cg-m.mp4`,
  alt: 'Нэг ширээн дээр зэрэгцсэн сүүтэй цай ба солонгос цай, уур нь нийлж байна',
};

// 모바일 펼침용 작은 이미지 (플레이트 사진만 -sm 존재)
export const smallOf = (url) => (/\/p\d-(mn|kr)\.webp$/.test(url) ? url.replace('.webp', '-sm.webp') : url);

// 가이드 행 hover 프리뷰 이미지 (14개 → 이미지 풀 재사용)
export const guidePreview = {
  visa: `${IMG}/hero-mn.webp`,
  arrival: `${IMG}/hero-kr.webp`,
  hospital: `${IMG}/p2-kr.webp`,
  money: `${IMG}/p5-mn.webp`,
  korean: `${IMG}/p2-mn.webp`,
  jobs: `${IMG}/p1-kr.webp`,
  housing: `${IMG}/p1-mn.webp`,
  topik: `${IMG}/p4-kr.webp`,
  transport: `${IMG}/hero-kr-m.webp`,
  emergency: `${IMG}/p4-mn.webp`,
  exchange: `${IMG}/p5-kr.webp`,
  severance: `${IMG}/hero-mn-m.webp`,
  apps: `${IMG}/finale-m.webp`,
  community: `${IMG}/finale.webp`,
};
