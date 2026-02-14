export const emergencyMeta = {
  title: 'Яаралтай утасны дугаарууд',
  subtitle: 'Солонгост амьдрахад хэрэг болох бүх утасны дугаар — нэг хуудсанд',
};

export const emergencySections = [
  { id: 'em-urgent', title: 'Яаралтай тусламж (24 цаг)' },
  { id: 'em-foreigner', title: 'Гадаадын иргэдэд зориулсан' },
  { id: 'em-labor', title: 'Хөдөлмөр / Хууль' },
  { id: 'em-translate', title: 'Орчуулга / Зөвлөгөө' },
  { id: 'em-life', title: 'Өдөр тутмын амьдрал' },
  { id: 'em-embassy', title: 'Элчин сайдын яам' },
];

// 24시간 긴급
export const urgentContacts = [
  {
    number: '119',
    label: 'Яаралтай тусламж / Гал',
    labelKo: '응급 / 소방',
    description: 'Түлэнхийн дуудлага, яаралтай эмнэлгийн тусламж, гал унтраах',
    hours: '24 цаг, 365 өдөр',
    mongolian: false,
    icon: 'ambulance',
  },
  {
    number: '112',
    label: 'Цагдаа',
    labelKo: '경찰',
    description: 'Гэмт хэрэг, хулгай, осол, гэрийн хүчирхийлэл',
    hours: '24 цаг, 365 өдөр',
    mongolian: false,
    icon: 'police',
  },
  {
    number: '110',
    label: 'Засгийн газрын лавлах',
    labelKo: '정부민원안내',
    description: 'Засгийн газрын бүх байгууллагын лавлах, гомдол гаргах',
    hours: '24 цаг, 365 өдөр',
    mongolian: false,
    icon: 'government',
  },
];

// 외국인 전용
export const foreignerContacts = [
  {
    number: '1345',
    label: 'Гадаадын иргэний лавлах',
    labelKo: '외국인종합안내센터',
    description: 'Виз, оршин суух зөвшөөрөл, гадаадын иргэний бүртгэл — бүх асуудал',
    hours: 'Ажлын өдөр 09:00-22:00',
    mongolianHours: 'Монгол хэл: Ажлын өдөр 09:00-18:00',
    mongolian: true,
    icon: 'phone',
    important: true,
  },
  {
    number: '1577-1366',
    label: 'Дануры лавлах',
    labelKo: '다누리콜센터',
    description: 'Олон соёлын гэр бүлийн зөвлөгөө, гэрийн хүчирхийлэл, яаралтай тусламж',
    hours: '24 цаг, 365 өдөр',
    mongolianHours: 'Монгол хэл: 24 цаг боломжтой',
    mongolian: true,
    icon: 'heart',
    important: true,
  },
  {
    number: '02-120 → 9 → 5',
    label: 'Дасан лавлах (Сөүл)',
    labelKo: '120 다산콜센터',
    description: 'Сөүл хотын захиргааны лавлах, тээвэр, татвар, иргэний гомдол',
    hours: 'Ажлын өдөр 09:00-18:00',
    mongolianHours: 'Монгол хэл: Ажлын өдөр 09:00-18:00',
    mongolian: true,
    icon: 'building',
  },
];

// 노동/법률
export const laborContacts = [
  {
    number: '1644-0644',
    label: 'Гадаад ажилчдын зөвлөгөө',
    labelKo: '외국인력상담센터',
    description: 'Цалин, гэрээ, ажлын нөхцөл, сунгалт — гадаад ажилчдад зориулсан',
    hours: '09:00-18:00, 365 өдөр',
    mongolianHours: 'Монгол хэл: боломжтой',
    mongolian: true,
    icon: 'briefcase',
  },
  {
    number: '1350',
    label: 'Хөдөлмөрийн яам',
    labelKo: '고용노동부',
    description: 'Цалин тооцоо, илүү цагийн хөлс, ажлаас халах, хөдөлмөрийн хууль',
    hours: 'Ажлын өдөр 09:00-18:00',
    mongolian: false,
    icon: 'building',
  },
  {
    number: '132',
    label: 'Хууль зүйн тусламж',
    labelKo: '법률구조공단',
    description: 'Үнэгүй хуулийн зөвлөгөө, шүүхийн тусламж (бага орлоготой иргэдэд)',
    hours: 'Ажлын өдөр 09:00-18:00',
    mongolian: false,
    icon: 'scale',
  },
];

// 통역/상담
export const translateContacts = [
  {
    number: '1588-5644',
    label: 'BBB Korea — Үнэгүй орчуулга',
    labelKo: 'BBB코리아',
    description: '20 хэлний орчуулга. Монгол хэл боломжтой. Сайн дурын орчуулагчтай холбоно.',
    hours: '24 цаг, 365 өдөр',
    mongolianHours: 'Монгол хэл: 24 цаг боломжтой',
    mongolian: true,
    icon: 'languages',
    important: true,
  },
];

// 생활
export const lifeContacts = [
  {
    number: '1372',
    label: 'Хэрэглэгчийн зөвлөгөө',
    labelKo: '소비자상담센터',
    description: 'Бараа буцаалт, залилан, худалдан авалтын маргаан',
    hours: 'Ажлын өдөр 09:00-18:00',
    mongolian: false,
    icon: 'shoppingBag',
  },
  {
    number: '129',
    label: 'Эрүүл мэндийн лавлах',
    labelKo: '보건복지콜센터',
    description: 'Эрүүл мэндийн даатгал, нийгмийн халамж, эмнэлгийн мэдээлэл',
    hours: 'Ажлын өдөр 09:00-18:00',
    mongolian: false,
    icon: 'heart',
  },
  {
    number: '1330',
    label: 'Аялал жуулчлалын лавлах',
    labelKo: '관광안내전화',
    description: 'Аялал жуулчлалын мэдээлэл, орчуулгын тусламж',
    hours: '24 цаг, 365 өдөр',
    mongolian: false,
    icon: 'compass',
  },
];

// 대사관
export const embassyContacts = [
  {
    number: '02-798-3464',
    label: 'БНСУ дахь Монголын Элчин сайдын яам',
    labelKo: '주한 몽골 대사관',
    description: 'Паспорт, нотариат, иргэний бүртгэл, консулын үйлчилгээ',
    hours: 'Ажлын өдөр 09:00-12:00, 14:00-18:00',
    mongolian: true,
    icon: 'flag',
    address: 'Сөүл хот, Ёнсан-гу, Ханнам-дон',
    url: 'http://seoul.embassy.mn',
  },
];

// 유용한 링크
export const emergencyLinks = [
  {
    href: 'https://www.immigration.go.kr',
    title: 'Цагаачлалын газар',
    description: '출입국·외국인정책본부 — виз, оршин суух',
  },
  {
    href: 'https://www.liveinkorea.kr',
    title: 'Дануры портал',
    description: '다누리 — олон соёлын гэр бүлийн мэдээлэл',
  },
  {
    href: 'https://www.bbbkorea.org',
    title: 'BBB Korea',
    description: 'BBB코리아 — үнэгүй орчуулгын үйлчилгээ',
  },
  {
    href: 'https://www.klac.or.kr',
    title: 'Хууль зүйн тусламж',
    description: '법률구조공단 — үнэгүй хуулийн зөвлөгөө',
  },
  {
    href: 'http://seoul.embassy.mn',
    title: 'Монголын Элчин сайдын яам',
    description: 'БНСУ дахь Монголын ЭСЯ',
  },
];
