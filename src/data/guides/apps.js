export const appsMeta = {
  title: 'Хэрэгтэй апп & хэрэгсэл',
  subtitle: 'Солонгосын амьдралд заавал хэрэгтэй апп, вэбсайт, тооцоолуурууд',
};

export const appsSections = [
  { id: 'apps-essential', title: 'Заавал суулгах апп' },
  { id: 'apps-shopping', title: 'Худалдаа & хүргэлт' },
  { id: 'apps-transport', title: 'Тээвэр & газрын зураг' },
  { id: 'apps-translate', title: 'Орчуулга & толь бичиг' },
  { id: 'apps-tools', title: 'Тооцоолуур & хэрэгсэл' },
  { id: 'apps-websites', title: 'Хэрэгтэй вэбсайтууд' },
  { id: 'apps-tips', title: 'Апп суулгах зөвлөгөө' },
];

export const essentialApps = [
  {
    name: 'KakaoTalk (카카오톡)',
    description: 'Солонгосын #1 мессенжер. Бараг бүх Солонгос хүн ашигладаг. Ажил олгогч, байрны эзэн, найзуудтай холбогдоход заавал хэрэгтэй.',
    playStore: 'https://play.google.com/store/apps/details?id=com.kakao.talk',
    category: 'Мессенжер',
    tip: 'Солонгост утас нээлгэмэгц хамгийн түрүүнд суулгах апп!',
  },
  {
    name: 'KakaoMap (카카오맵)',
    description: 'Газрын зураг, чиглэл хайх, автобус/метроны маршрут, ойролцоох дэлгүүр, ресторан хайх.',
    playStore: 'https://play.google.com/store/apps/details?id=net.daum.android.map',
    category: 'Газрын зураг',
    tip: 'English хэлний горим бий. Settings → Language → English',
  },
  {
    name: 'Naver Map (네이버 지도)',
    description: 'KakaoMap-тай адил чиглэл хайх, ресторан, кафе хайхад сайн. Зарим газар KakaoMap-аас илүү нарийвчлалтай.',
    playStore: 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap',
    category: 'Газрын зураг',
    tip: 'English хэлний горим бий.',
  },
];

export const shoppingApps = [
  {
    name: 'Coupang (쿠팡)',
    description: 'Солонгосын хамгийн том онлайн дэлгүүр. "Rocket Delivery" — маргааш хүргэнэ. Хоол, ахуйн бараа, электроник гэх мэт бүх зүйл.',
    playStore: 'https://play.google.com/store/apps/details?id=com.coupang.mobile',
    category: 'Онлайн дэлгүүр',
    tip: '와우 회원: сард ₩4,990-аар үнэгүй хүргэлт + Coupang Play',
  },
  {
    name: 'Baemin (배달의민족)',
    description: 'Хоол захиалгын хамгийн түгээмэл апп. Ресторан, кафе, хүнсний бүтээгдэхүүн хүргүүлэх.',
    playStore: 'https://play.google.com/store/apps/details?id=com.sampleapp',
    website: 'https://www.baemin.com',
    category: 'Хоол хүргэлт',
    tip: '배민클럽: сард ₩4,990-аар хүргэлтийн хураамж хөнгөлөлт',
  },
  {
    name: 'Danggeun (당근)',
    description: 'Хуучин бараа худалдаа. Ойролцоох хүмүүстэй шууд уулзаж арилжаа хийнэ. Гар утас, гэр ахуй, хувцас зэрэг хямд олдоно.',
    playStore: 'https://play.google.com/store/apps/details?id=com.towneers.www',
    category: 'Хуучин бараа',
    tip: '동네 인증 (орчны баталгаажуулалт) хийснээр ойролцоох зар харагдана',
  },
];

export const transportApps = [
  {
    name: 'KakaoMap / Naver Map',
    description: 'Автобус, метро, алхах чиглэлийг хоёулаа маш сайн зааж өгнө. Ирэх цаг, шилжих мэдээлэл бүгд бий.',
    playStore: null,
    category: 'Чиглэл',
    tip: 'Дээр суулгасан бол дахин суулгах шаардлагагүй!',
  },
  {
    name: 'T-money (모바일티머니)',
    description: 'Автобус, метроны T-money картыг утсандаа NFC-ээр ашиглах.',
    playStore: 'https://play.google.com/store/apps/details?id=com.lgt.tmoney',
    category: 'Тээврийн карт',
    tip: 'NFC дэмжсэн Android утас хэрэгтэй. Зарим утсанд ажиллахгүй байж болно — тэр үед биет T-money карт аваарай.',
  },
  {
    name: 'KakaoT (카카오 T)',
    description: 'Такси дуудах апп. Солонгосын хамгийн түгээмэл такси апп.',
    playStore: 'https://play.google.com/store/apps/details?id=com.kakao.taxi',
    category: 'Такси',
    tip: 'Зорих газраа бичиж илгээвэл жолооч ирнэ. Карт/бэлнээр төлж болно.',
  },
];

export const translateApps = [
  {
    name: 'Google Translate (Гүүгл орчуулга)',
    description: 'Монгол ↔ Солонгос орчуулга дэмждэг! Камераар зураг авч орчуулах, ярьж орчуулах боломжтой.',
    playStore: 'https://play.google.com/store/apps/details?id=com.google.android.apps.translate',
    category: 'Орчуулга',
    tip: 'Камер горим: ресторан меню, гудамжны тэмдэг зэргийг камераар орчуулаарай!',
  },
  {
    name: 'Papago (파파고)',
    description: 'Naver-ийн AI орчуулга. Солонгос ↔ Англи орчуулгад маш сайн. Камер, дуут орчуулга бий.',
    playStore: 'https://play.google.com/store/apps/details?id=com.naver.labs.translator',
    category: 'Орчуулга',
    tip: 'Монгол хэлийг шууд дэмждэггүй. Солонгос → Англи орчуулгад ашиглаарай.',
  },
  {
    name: 'Naver Dictionary (네이버 사전)',
    description: 'Солонгос үгийн утга, жишээ өгүүлбэр, дуудлага сонсох. Солонгос хэл сурахад хамгийн хэрэгтэй.',
    playStore: 'https://play.google.com/store/apps/details?id=com.nhn.android.naverdic',
    website: 'https://dict.naver.com',
    category: 'Толь бичиг',
    tip: 'Солонгос ↔ Англи толь бичиг. Үг бүрийн утга, жишээ, дуудлага бий.',
  },
];

export const toolLinks = [
  {
    href: '/exchange',
    title: 'Ханш тооцоолуур',
    description: 'KRW ↔ MNT ханш хөрвүүлэг — KoreaMongol',
    isInternal: true,
  },
  {
    href: '/severance',
    title: 'Тэтгэмж тооцоолуур',
    description: 'Ажлаас гарах тэтгэмж тооцоолох — KoreaMongol',
    isInternal: true,
  },
  {
    href: 'https://www.everycalc.pe.kr',
    title: 'EVERYCALC',
    description: '76+ тооцоолуур: цалин, татвар, зээл, BMI гэх мэт',
    isInternal: false,
  },
];

export const usefulWebsites = [
  {
    href: 'https://hangulhub.co.kr',
    title: 'HangulHub',
    description: 'Хангыл фонт (45+), хангыл тамга хийх, хангыл нэр үүсгэх — бүгд үнэгүй',
  },
  {
    href: 'https://www.gov.kr/portal/foreigner/ko',
    title: '정부24 (Засгийн газрын үйлчилгээ)',
    description: 'Гадаадын иргэний бүртгэл, гэрчилгээ авах — 14 төрлийн онлайн минвон',
  },
  {
    href: 'https://www.easylaw.go.kr',
    title: '찾기쉬운 생활법령 (Хуулийн мэдээлэл)',
    description: 'Гадаадын ажилчдын эрх, хөдөлмөрийн хууль — хялбар тайлбартай',
  },
];

export const appTips = [
  'Play Store-оос апп татаж авахдаа Wi-Fi-тай газар татаж авах нь дата хэмнэнэ',
  'Апп бүр Солонгос утасны дугаар шаардана — утас нээлгэсний дараа суулгаарай',
  'Хэлний тохиргоо: Settings (설정) → Language → English/한국어 сонгох',
  'Сонирхолгүй мэдэгдэл (알림) ихтэй бол: Settings → Apps → тухайн апп → Notifications → хаах',
  'Төлбөрийн карт бүртгэх: Солонгосын дебит/кредит карт хэрэгтэй',
];

export const appWarning = 'Апп-уудын мэдээлэл нь хувилбар шинэчлэгдэхийн хэрээр өөрчлөгдөж болно. Хамгийн сүүлийн мэдээллийг Play Store болон тухайн апп-ын вэбсайтаас шалгана уу.';

export const appsLinks = [
  {
    href: '/money',
    title: 'Мөнгө ба санхүү',
    description: 'Шилжүүлгийн апп (GME, Hanpass, Toss) дэлгэрэнгүй',
  },
  {
    href: '/transport',
    title: 'Тээврийн гарын авлага',
    description: 'Метро, автобус, KTX ашиглах дэлгэрэнгүй',
  },
  {
    href: '/korean-life',
    title: 'Бодит Солонгос хэл',
    description: 'Хэл сурах эх сурвалж, сонирхолтой илэрхийлэл',
  },
];
