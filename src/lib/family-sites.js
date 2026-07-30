// 자사·협력 서비스 교차 홍보 데이터 — 원본은 pedia-factory/template.
// 내용을 바꾸면 사용 중인 전 저장소(sisepedia·carepedia·petpedia·hangulhub·
// koreamongol·total-calculator·kidsland)에 같은 파일을 복제해 동기화한다.
// tagline: 한국어(기본) / taglineEn: hangulhub en 로케일용 / taglineMn: koreamongol용.
export const FAMILY_SITES = [
  {
    id: 'sisepedia',
    name: '시세피디아',
    nameEn: 'Sisepedia',
    tagline: '생활 물가·시세 백과',
    taglineEn: 'Everyday prices & market rates (Korean)',
    url: 'https://sisepedia.com',
    color: '#06b6d4',
  },
  {
    id: 'carepedia',
    name: '케어피디아',
    nameEn: 'Carepedia',
    tagline: '병원비·지원금 백과',
    taglineEn: 'Hospital costs & subsidies (Korean)',
    url: 'https://carepedia.kr',
    color: '#0891b2',
  },
  {
    id: 'petpedia',
    name: '펫피디아',
    nameEn: 'Petpedia',
    tagline: '반려동물 병원비·지원금·장례 백과',
    taglineEn: 'Pet medical costs & subsidies (Korean)',
    url: 'https://petpedia.kr',
    color: '#f97316',
  },
  {
    id: 'hangulhub',
    name: '한글허브',
    nameEn: 'HangulHub',
    tagline: '한글 이름·도장·폰트, 한글의 모든 것',
    taglineEn: 'Korean names, seals, fonts — all things Hangul',
    taglineMn: 'Солонгос нэр, тамга, фонт — хангылтай холбоотой бүх зүйл',
    url: 'https://hangulhub.co.kr',
    color: '#C4432F',
  },
  {
    id: 'everycalc',
    name: '뚝딱공방',
    nameEn: 'EVERYCALC',
    tagline: '생활 계산기·실용 도구 모음',
    taglineEn: 'Handy everyday calculators (Korean)',
    url: 'https://www.everycalc.pe.kr',
    color: '#3b82f6',
  },
  {
    id: 'koreamongol',
    name: 'KoreaMongol',
    nameEn: 'KoreaMongol',
    tagline: '몽골인을 위한 한국 생활 가이드',
    taglineEn: 'Life-in-Korea guide for Mongolians',
    url: 'https://koreamongol.com',
    color: '#1B2D4F',
  },
  {
    id: 'kidsland',
    name: '키즈랜드',
    nameEn: 'Kidsland',
    tagline: '유아·초등 프린트 학습지',
    taglineEn: 'Printable worksheets for kids (Korean)',
    taglineMn: 'Хүүхдэд зориулсан хэвлэмэл сургалтын материал',
    url: 'https://kidsland.co.kr',
    color: '#FF6B6B',
  },
];

// 사이트별 노출 대상(순서 = 표시 순서). 자기 자신은 넣지 않는다.
// koreamongol 카드는 청중이 맞는 hangulhub·kidsland에만 노출하고,
// koreamongol 화면(몽골어 UI)에는 몽골어 카피가 있는 두 곳만 노출한다.
export const FAMILY_SHOW_MAP = {
  sisepedia: ['carepedia', 'petpedia', 'everycalc', 'hangulhub', 'kidsland'],
  carepedia: ['sisepedia', 'petpedia', 'everycalc', 'hangulhub', 'kidsland'],
  petpedia: ['sisepedia', 'carepedia', 'everycalc', 'hangulhub', 'kidsland'],
  everycalc: ['sisepedia', 'carepedia', 'petpedia', 'hangulhub', 'kidsland'],
  hangulhub: ['sisepedia', 'carepedia', 'petpedia', 'everycalc', 'kidsland', 'koreamongol'],
  koreamongol: ['hangulhub', 'kidsland'],
  kidsland: ['sisepedia', 'carepedia', 'petpedia', 'everycalc', 'hangulhub', 'koreamongol'],
};

// 유입 측정용 UTM 부착 링크 (utm_source = 보내는 사이트 id)
export function familyUrl(site, selfId) {
  return `${site.url}?utm_source=${selfId}&utm_medium=family_banner`;
}

export function familySitesFor(selfId) {
  return (FAMILY_SHOW_MAP[selfId] ?? [])
    .map((id) => FAMILY_SITES.find((s) => s.id === id))
    .filter(Boolean);
}
