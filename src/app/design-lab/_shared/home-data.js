// design-lab 시안 3종 공통 홈 콘텐츠 — src/app/HomeContent.jsx 에서 그대로 옮김 (문구 수정 금지)
//
// 사용 규칙
// - 서버 컴포넌트(page.jsx)에서 import 해서 쓴다.
// - guides[].icon / situations 는 lucide 컴포넌트 참조라 서버→클라이언트 props 로 넘길 수 없다.
//   클라이언트 컴포넌트에 넘길 때는 icon 을 빼거나, 직렬화 가능한 iconName(문자열)을 쓴다.
// - 최근 업데이트는 서버에서 `getRecentUpdates(5)` (@/lib/recent-updates) 를 직접 호출한다.
//   (클라이언트 번들에 들어가면 안 되므로 이 파일에서 re-export 하지 않는다)
// - 환율 카드: '@/components/home/ExchangeMiniCard' 재사용 또는 exchange.api 를 직접 fetch.

import {
  FileText, MapPin, Heart, Banknote, BookOpen, Users, Briefcase, Home, GraduationCap,
  Calculator, Train, Phone, Smartphone,
} from 'lucide-react';

export const hero = {
  eyebrow: 'KoreaMongol',
  // H1 은 두 줄 (원본은 <br />)
  titleLines: ['Солонгост', 'тавтай морил!'],
  title: 'Солонгост тавтай морил!',
  lead: 'Виз, банк, эмнэлэг, цалин, мөнгөн шилжүүлэг — Солонгост амьдрахад хэрэгтэй бүх мэдээлэл монгол хэлээр, үнэ төлбөргүй.',
  cta: { label: 'Бүх гарын авлага үзэх', href: '#guides' },
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

// id 는 HomeContent.jsx 와 동일 (korean = /korean-life)
export const guides = [
  { id: 'visa', href: '/visa', icon: FileText, iconName: 'FileText', title: 'Визний гарын авлага', desc: 'E-9, D-2, D-4 визний мэдээлэл', available: true },
  { id: 'arrival', href: '/arrival', icon: MapPin, iconName: 'MapPin', title: 'Ирсний дараа', desc: 'Бүртгэл, банк, утас нээлгэх', available: true },
  { id: 'hospital', href: '/hospital', icon: Heart, iconName: 'Heart', title: 'Эмнэлэг / Яаралтай', desc: 'Эмнэлэгт хандах, яаралтай дуудлага', available: true },
  { id: 'money', href: '/money', icon: Banknote, iconName: 'Banknote', title: 'Мөнгө ба санхүү', desc: 'Шилжүүлэг, банк, карт, даатгал', available: true },
  { id: 'korean', href: '/korean-life', icon: BookOpen, iconName: 'BookOpen', title: 'Бодит Солонгос хэл', desc: 'Сурах бичигт байдаггүй чухал зүйлс', available: true },
  { id: 'jobs', href: '/jobs', icon: Briefcase, iconName: 'Briefcase', title: 'Ажил ба хөдөлмөр', desc: 'Цалин, гэрээ, эрхийн хамгаалалт', available: true },
  { id: 'housing', href: '/housing', icon: Home, iconName: 'Home', title: 'Байр ба орон сууц', desc: 'Барьцаа, түрээс, гэрээ, амьдрал', available: true },
  { id: 'topik', href: '/topik', icon: GraduationCap, iconName: 'GraduationCap', title: 'TOPIK / EPS-TOPIK', desc: 'Шалгалтын бүтэц, бүртгэл, бэлтгэл', available: true },
  { id: 'transport', href: '/transport', icon: Train, iconName: 'Train', title: 'Тээврийн гарын авлага', desc: 'Метро, автобус, такси, KTX', available: true },
  { id: 'emergency', href: '/emergency', icon: Phone, iconName: 'Phone', title: 'Яаралтай утасны дугаарууд', desc: '119, 112, 1345 — бүх дугаар', available: true },
  { id: 'exchange', href: '/exchange', icon: Calculator, iconName: 'Calculator', title: 'Ханш тооцоолуур', desc: 'KRW ↔ MNT ханш хөрвүүлэг', available: true },
  { id: 'severance', href: '/severance', icon: Calculator, iconName: 'Calculator', title: 'Тэтгэмж тооцоолуур', desc: 'Ажлаас гарах тэтгэмж тооцоолох', available: true },
  { id: 'apps', href: '/apps', icon: Smartphone, iconName: 'Smartphone', title: 'Хэрэгтэй апп', desc: 'KakaoTalk, Coupang, тооцоолуурууд', available: true },
  { id: 'community', href: '/community/blog', icon: Users, iconName: 'Users', title: 'Нутгийнхан', desc: 'Хамт олны мэдээ, асуулт хариулт', available: true },
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

// 1,000 ₩ 당 ₮ (카드 표시 값과 동일 계산)
export function mntPer1000Krw(rate) {
  return Math.round(rate * 1000);
}

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
