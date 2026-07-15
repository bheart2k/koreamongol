import { GUIDE_ORDER } from '@/data/guides/common';
import { visaSections } from '@/data/guides/visa';
import { arrivalSections } from '@/data/guides/arrival';
import { hospitalSections } from '@/data/guides/hospital';
import { moneySections } from '@/data/guides/money';
import { koreanLifeSections } from '@/data/guides/korean-life';
import { jobsSections } from '@/data/guides/jobs';
import { housingSections } from '@/data/guides/housing';
import { topikSections } from '@/data/guides/topik';
import { transportSections } from '@/data/guides/transport';
import { emergencySections } from '@/data/guides/emergency';
import { appsSections } from '@/data/guides/apps';
import { faqData } from '@/data/faq';
import { tips } from '@/data/tips';

// 검색 별칭: 섹션 제목에 없는 한국어/몽골어 검색어를 보강
const KEYWORDS = {
  // jobs
  'jobs-visa-conditions': '비자 취업조건 виз ажил',
  'jobs-parttime': '알바 아르바이트 시간제취업허가 유학생 оюутан зөвшөөрөл',
  'jobs-salary': '최저임금 월급 급여 주휴수당 цалин',
  'jobs-contract': '근로계약서 계약 гэрээ',
  'jobs-how-to-find': '구직 일자리 ажил хайх',
  'jobs-daily': '일용직 사기 өдрийн ажил залилан',
  'jobs-rights': '임금체불 부당해고 산재 цалин өгөхгүй халах осол',
  // arrival
  'arrival-alien': '외국인등록 외국인등록증 ARC бүртгэл',
  'arrival-bank': '은행 계좌 банк данс нээх',
  'arrival-phone': '유심 심카드 휴대폰 개통 SIM утас',
  // housing
  'housing-types': '원룸 고시원 오피스텔 байр',
  'housing-cost-system': '보증금 월세 전세 관리비 барьцаа түрээс',
  'housing-contract': '임대차계약 부동산 гэрээ',
  'housing-warnings': '전세사기 залилан',
  // money
  'money-comparison': '송금 해외송금 환전 мөнгө шилжүүлэг',
  'money-insurance': '4대보험 даатгал',
  // hospital
  'hospital-emergency': '응급실 119 яаралтай',
  'hospital-insurance': '건강보험 эрүүл мэндийн даатгал',
  'hospital-pharmacy': '약국 эм',
  // visa
  'visa-e9': 'E9 고용허가제 EPS ажлын виз',
  'visa-d2': 'D2 유학 их сургууль',
  'visa-d4': 'D4 어학연수 хэл сургалт',
  'visa-workplace': '사업장 변경 이직 ажлын газар солих',
  'visa-illegal': '불법체류 хууль бус оршин суух',
  // transport
  'tr-card': '티머니 교통카드 T-money',
  'tr-metro': '지하철 метро',
};

const sectionsByGuide = {
  visa: visaSections,
  arrival: arrivalSections,
  hospital: hospitalSections,
  money: moneySections,
  'korean-life': koreanLifeSections,
  jobs: jobsSections,
  housing: housingSections,
  topik: topikSections,
  transport: transportSections,
  emergency: emergencySections,
  apps: appsSections,
};

export const searchIndex = [
  // 가이드 대표 페이지
  ...GUIDE_ORDER.map((g) => ({
    title: g.title,
    category: 'Гарын авлага',
    href: g.href,
    keywords: KEYWORDS[g.id] || '',
  })),
  // 가이드 내 섹션 (앵커 링크)
  ...Object.entries(sectionsByGuide).flatMap(([id, sections]) => {
    const guide = GUIDE_ORDER.find((g) => g.id === id);
    return sections.map((s) => ({
      title: s.title,
      category: guide.title,
      href: `${guide.href}#${s.id}`,
      keywords: KEYWORDS[s.id] || '',
    }));
  }),
  // 팁 (질문 페이지)
  ...tips.map((t) => ({
    title: t.question,
    category: 'Түргэн хариулт',
    href: `/tips/${t.slug}`,
    keywords: t.keywords.join(' '),
  })),
  // 도구
  { title: 'Ханш тооцоолуур (KRW ↔ MNT)', category: 'Хэрэгсэл', href: '/exchange', keywords: '환율 계산기 ханш' },
  { title: 'Тэтгэмж тооцоолуур (퇴직금)', category: 'Хэрэгсэл', href: '/severance', keywords: '퇴직금 계산기 тэтгэмж' },
  // FAQ
  ...faqData.map((f) => ({
    title: f.question,
    category: 'FAQ',
    href: '/faq',
    keywords: '',
  })),
];
