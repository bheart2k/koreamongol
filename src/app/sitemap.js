import { db, posts } from '@/lib/db';
import { eq, and, desc, inArray } from 'drizzle-orm';
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
import { tips, tipsMeta } from '@/data/tips';

const BASE_URL = 'https://koreamongol.com';

// '2026.07.14' → '2026-07-14' (가이드 데이터의 실제 갱신일 — 매 요청 현재시각으로 찍으면 구글이 lastmod를 무시함)
const metaDate = (meta) => meta.lastUpdated.replaceAll('.', '-');

export default async function sitemap() {
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/visa', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(visaMeta) },
    { path: '/arrival', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(arrivalMeta) },
    { path: '/hospital', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(hospitalMeta) },
    { path: '/money', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(moneyMeta) },
    { path: '/korean-life', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(koreanLifeMeta) },
    { path: '/jobs', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(jobsMeta) },
    { path: '/housing', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(housingMeta) },
    { path: '/topik', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(topikMeta) },
    { path: '/transport', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(transportMeta) },
    { path: '/emergency', priority: 0.9, changeFrequency: 'monthly', lastModified: metaDate(emergencyMeta) },
    { path: '/exchange', priority: 0.8, changeFrequency: 'daily' },
    { path: '/severance', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/apps', priority: 0.8, changeFrequency: 'monthly', lastModified: metaDate(appsMeta) },
    { path: '/tips', priority: 0.8, changeFrequency: 'weekly', lastModified: metaDate(tipsMeta) },
    ...tips.map((tip) => ({
      path: `/tips/${tip.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly',
      lastModified: tip.lastUpdated.replaceAll('.', '-'),
    })),
    { path: '/donate', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/community', priority: 0.7, changeFrequency: 'daily' },
    { path: '/community/blog', priority: 0.8, changeFrequency: 'daily' },
    { path: '/community/free', priority: 0.7, changeFrequency: 'daily' },
    { path: '/community/notice', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/community/expression', priority: 0.7, changeFrequency: 'daily' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/feedback', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  // 모든 게시판의 게시글 동적 조회
  let postUrls = [];
  try {
    const postRows = await db.select({
      id: posts.id,
      boardType: posts.boardType,
      updatedAt: posts.updatedAt,
      createdAt: posts.createdAt,
    }).from(posts)
      .where(and(
        eq(posts.state, 'Y'),
        inArray(posts.boardType, ['blog', 'free', 'notice', 'expression']),
      ))
      .orderBy(desc(posts.createdAt));

    postUrls = postRows.map((post) => ({
      url: `${BASE_URL}/community/${post.boardType}/${post.id}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : new Date(post.createdAt).toISOString(),
      changeFrequency: 'weekly',
      priority: post.boardType === 'blog' ? 0.7 : 0.6,
    }));
  } catch (error) {
    console.error('Sitemap: 게시글 조회 오류:', error);
  }

  // lastModified는 실제 갱신일을 아는 페이지에만 넣는다 (없으면 생략이 낫다)
  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    ...(page.lastModified && { lastModified: page.lastModified }),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticUrls, ...postUrls];
}
