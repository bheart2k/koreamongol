import { db, posts } from '@/lib/db';
import { eq, and, desc, inArray } from 'drizzle-orm';

const BASE_URL = 'https://koreamongol.com';

export default async function sitemap() {
  const now = new Date().toISOString();

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/visa', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/arrival', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/hospital', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/money', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/korean-life', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/jobs', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/housing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/topik', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/transport', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/emergency', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/exchange', priority: 0.8, changeFrequency: 'daily' },
    { path: '/severance', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/apps', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/donate', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/community', priority: 0.7, changeFrequency: 'daily' },
    { path: '/community/blog', priority: 0.8, changeFrequency: 'daily' },
    { path: '/community/free', priority: 0.7, changeFrequency: 'daily' },
    { path: '/community/notice', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/community/expression', priority: 0.7, changeFrequency: 'daily' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
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

  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticUrls, ...postUrls];
}
