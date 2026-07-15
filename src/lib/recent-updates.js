// 홈 "최신 업데이트(Сүүлийн шинэчлэл)" 스트립용 — 가이드/팁 lastUpdated 역순 집계 (SSG)
import { visaMeta } from '@/data/guides/visa';
import { arrivalMeta } from '@/data/guides/arrival';
import { hospitalMeta } from '@/data/guides/hospital';
import { moneyMeta } from '@/data/guides/money';
import { koreanLifeMeta } from '@/data/guides/korean-life';
import { jobsMeta } from '@/data/guides/jobs';
import { housingMeta } from '@/data/guides/housing';
import { topikMeta } from '@/data/guides/topik';
import { transportMeta } from '@/data/guides/transport';
import { emergencyMeta } from '@/data/guides/emergency';
import { appsMeta } from '@/data/guides/apps';
import { tips } from '@/data/tips';

const GUIDES = [
  { href: '/visa', meta: visaMeta },
  { href: '/arrival', meta: arrivalMeta },
  { href: '/hospital', meta: hospitalMeta },
  { href: '/money', meta: moneyMeta },
  { href: '/korean-life', meta: koreanLifeMeta },
  { href: '/jobs', meta: jobsMeta },
  { href: '/housing', meta: housingMeta },
  { href: '/topik', meta: topikMeta },
  { href: '/transport', meta: transportMeta },
  { href: '/emergency', meta: emergencyMeta },
  { href: '/apps', meta: appsMeta },
];

export function getRecentUpdates(limit = 5) {
  const guideItems = GUIDES.map(({ href, meta }) => ({
    href,
    title: meta.title,
    category: 'Гарын авлага',
    lastUpdated: meta.lastUpdated,
  }));

  const tipItems = tips.map((tip) => ({
    href: `/tips/${tip.slug}`,
    title: tip.question,
    category: 'Түргэн хариулт',
    lastUpdated: tip.lastUpdated,
  }));

  // 'YYYY.MM.DD' 형식이라 문자열 비교로 정렬 가능
  return [...guideItems, ...tipItems]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, limit);
}
