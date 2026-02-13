import { db, posts } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';

const BASE_URL = 'https://koreamongol.com';

export default async function sitemap() {
  const now = new Date().toISOString();

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/community', priority: 0.7, changeFrequency: 'daily' },
    { path: '/community/blog', priority: 0.8, changeFrequency: 'daily' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  // 블로그 게시글 동적 조회
  let blogPosts = [];
  try {
    const postRows = await db.select({
      id: posts.id,
      updatedAt: posts.updatedAt,
      createdAt: posts.createdAt,
    }).from(posts)
      .where(and(eq(posts.state, 'Y'), eq(posts.boardType, 'blog')))
      .orderBy(desc(posts.createdAt));

    blogPosts = postRows.map((post) => ({
      path: `/community/blog/${post.id}`,
      priority: 0.7,
      changeFrequency: 'weekly',
      lastModified: post.updatedAt || post.createdAt,
    }));
  } catch (error) {
    console.error('Sitemap: 블로그 게시글 조회 오류:', error);
  }

  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const dynamicUrls = blogPosts.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: page.lastModified ? new Date(page.lastModified).toISOString() : now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticUrls, ...dynamicUrls];
}
