export const arrivalMeta = {
  title: 'Ирсний дараа',
  subtitle: 'Гадаадын иргэний бүртгэл, банк, утас, амьдрал эхлүүлэх',
};

export const arrivalSections = [
  { id: 'arrival-day1', title: '1-2 дахь өдөр' },
  { id: 'arrival-week1', title: '3-7 дахь өдөр' },
  { id: 'arrival-week2', title: '2-4 дэх долоо хоног' },
  { id: 'arrival-tips', title: 'Амьдралын зөвлөгөө' },
  { id: 'arrival-apps', title: 'Заавал суулгах апп' },
];

export const arrivalTimeline = [
  {
    period: '1-2 дахь өдөр',
    storageKey: 'arrival-day1',
    items: [
      { id: 'day1-sim', label: 'SIM карт авах', sub: '공항 эсвэл편의점-д' },
      { id: 'day1-transport', label: 'T-money карт авах', sub: '지하철, 버스-д хэрэглэнэ' },
      { id: 'day1-address', label: 'Байрны хаяг, утас тэмдэглэх' },
      { id: 'day1-kakao', label: 'KakaoTalk суулгах', sub: 'Солонгосын хамгийн чухал апп' },
      { id: 'day1-map', label: 'Naver Map / Kakao Map суулгах' },
    ],
  },
  {
    period: '3-7 дахь өдөр',
    storageKey: 'arrival-week1',
    items: [
      { id: 'week1-alien', label: 'Гадаадын иргэний бүртгэл (외국인등록)', sub: 'Ирснээс хойш 90 хоногийн дотор' },
      { id: 'week1-bank', label: 'Банкны данс нээх', sub: '외국인등록증 авсны дараа' },
      { id: 'week1-phone', label: 'Гар утасны гэрээ хийх', sub: '외국인등록증 шаардлагатай' },
      { id: 'week1-insurance', label: 'Эрүүл мэндийн даатгалд бүртгүүлэх' },
      { id: 'week1-area', label: 'Орчны газрыг судлах (마트, 편의점, 병원)' },
    ],
  },
  {
    period: '2-4 дэх долоо хоног',
    storageKey: 'arrival-week2',
    items: [
      { id: 'week2-resident', label: '주민센터-д бүртгүүлэх (전입신고)' },
      { id: 'week2-nhi', label: 'Үндэсний даатгалд бүртгүүлэх (건강보험)' },
      { id: 'week2-remit', label: 'Мөнгө шилжүүлгийн апп бэлдэх', sub: 'GME, WU гэх мэт' },
      { id: 'week2-korean', label: 'Солонгос хэлний анги хайх' },
      { id: 'week2-community', label: 'Монгол хамт олонтой холбогдох' },
    ],
  },
];

export const arrivalTips = [
  {
    title: '다이소 (Daiso)',
    description: 'Хямд үнэтэй гэр ахуйн бараа, хоолны сав, цэвэрлэгээний хэрэгсэл. ₩500~₩5,000 үнэтэй.',
  },
  {
    title: '당근마켓 (Danggeun Market)',
    description: 'Хуучин эд зүйлс хямдаар авах апп. Гэр ахуйн цахилгаан хэрэгсэл, тавилга зэргийг хямдаар.',
  },
  {
    title: 'Монгол хүнсний дэлгүүр',
    description: 'Сөүл, Ансан зэрэг хотуудад Монгол хүнсний дэлгүүрүүд бий. Монгол хоолны орц найрлага олдоно.',
  },
  {
    title: '편의점 (CU, GS25, 7-Eleven)',
    description: '24 цагийн дэлгүүр. Хоол, ундаа, ATM, хэвлэх үйлчилгээ зэрэг олон зүйл.',
  },
];

export const essentialApps = [
  ['KakaoTalk', 'Мессенжер', 'Солонгосын №1 мессенжер. Бараг бүх хүн хэрэглэдэг.'],
  ['Kakao Map / Naver Map', 'Газрын зураг', 'Замын чиглэл, автобус, метро мэдээлэл.'],
  ['Papago', 'Орчуулга', 'Naver-ийн орчуулгын апп. Камераар орчуулах боломжтой.'],
  ['배달의민족 (Baemin)', 'Хоол захиалга', 'Хоол хүргэлтийн апп. Гэрээсээ хоол захиалах.'],
  ['쿠팡 (Coupang)', 'Онлайн дэлгүүр', 'Маргааш хүргэнэ. Хямд, хурдан, тохиромжтой.'],
  ['T-money Go', 'Тээвэр', 'T-money картын үлдэгдэл шалгах, цэнэглэх.'],
  ['국민건강보험', 'Даатгал', 'Эрүүл мэндийн даатгалын мэдээлэл шалгах.'],
];
