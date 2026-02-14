export const moneyMeta = {
  title: 'Мөнгө шилжүүлэг',
  subtitle: 'Монгол руу мөнгө шилжүүлэх арга, ханш, зөвлөгөө',
};

export const moneySections = [
  { id: 'money-comparison', title: 'Шилжүүлгийн арга харьцуулалт' },
  { id: 'money-methods', title: 'Арга бүрийн дэлгэрэнгүй' },
  { id: 'money-warnings', title: 'Анхааруулга' },
  { id: 'money-tips', title: 'Зөвлөгөө' },
  { id: 'money-links', title: 'Хэрэгтэй линкүүд' },
];

export const remittanceComparison = {
  headers: ['Арга', 'Хураамж', 'Хурд', 'Тав тухтай байдал'],
  rows: [
    ['GME Remittance', { text: '₩5,000~', highlight: true }, '1-2 өдөр', 'Апп (Монгол хэлтэй)'],
    ['Western Union', 'Дүнгээс хамаарна', 'Шууд~1 өдөр', 'Онлайн / Банк'],
    ['Банк шилжүүлэг', '₩13,000~33,000+', '2-5 өдөр', 'Банканд очих'],
  ],
};

export const remittanceMethods = [
  {
    name: 'GME Remittance',
    description: 'Монгол руу шилжүүлэхэд хамгийн түгээмэл. Монгол хэлний дэмжлэгтэй апп.',
    pros: ['Хямд хураамж', 'Монгол хэлтэй', 'Апп-аас шууд'],
    cons: ['Их дүн шилжүүлэхэд хязгаар бий'],
    url: 'https://www.gmeremit.com',
  },
  {
    name: 'Western Union',
    description: 'Дэлхий даяар алдартай шилжүүлгийн үйлчилгээ. Kakao Bank-аар дамжуулан хийх боломжтой.',
    pros: ['Хурдан', 'Олон улсад түгээмэл', 'Бэлэн мөнгөөр авах боломжтой'],
    cons: ['Хураамж арай өндөр', 'Ханш бага зэрэг муу'],
    url: 'https://www.westernunion.com/kr/en/home.html',
  },
  {
    name: 'Банк шилжүүлэг (은행 송금)',
    description: 'Шууд банкны данснаас данс руу. Их дүнд тохиромжтой.',
    pros: ['Аюулгүй', 'Их дүн шилжүүлэх боломжтой'],
    cons: ['Хураамж өндөр', 'Удаан (2-5 өдөр)', 'Банканд биечлэн очих'],
    url: null,
  },
];

export const exchangeTips = [
  'Сар бүрийн ханшийг харьцуулж, хамгийн сайн үед шилжүүлэх',
  'GME, WU-ийн ханшийг банкны ханштай харьцуулах',
  'Бага дүнг олон удаа шилжүүлэхээс их дүнг нэг удаа шилжүүлэх нь хямд',
  'Ханш сайн үед шилжүүлэх "auto-send" функцийг ашиглах (WU)',
];

export const financeWarnings = [
  {
    title: '환치기 (Хууль бус мөнгө шилжүүлэг)',
    items: [
      'Хууль бус мөнгө шилжүүлэг нь гэмт хэрэг!',
      'Торгууль: 3 тэрбум вон (₩300,000,000) хүртэл',
      '3 жил хүртэл хорих ял (бүртгэлгүй үйл ажиллагаа эрхлэгч)',
      'Виз цуцлагдаж, гаргах боломжтой',
      'Хэдий хямд ч гэсэн ашиглахгүй байх!',
    ],
  },
];

export const moneyLinks = [
  {
    href: 'https://www.gmeremit.com',
    title: 'GME Remittance',
    description: 'Монгол руу мөнгө шилжүүлэх апп',
  },
  {
    href: 'https://www.westernunion.com/kr/en/home.html',
    title: 'Western Union Korea',
    description: 'Олон улсын мөнгөн шилжүүлэг',
  },
];
