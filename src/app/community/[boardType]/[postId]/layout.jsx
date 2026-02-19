import { db, posts } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

const boardConfig = {
  blog: { title: 'Блог' },
  free: { title: 'Чөлөөт самбар' },
  notice: { title: 'Мэдэгдэл & FAQ' },
  expression: { title: 'Илэрхийлэл асуулт' },
};

export async function generateMetadata({ params }) {
  const { boardType, postId } = await params;

  try {
    const [post] = await db.select({
      title: posts.title,
      content: posts.content,
    }).from(posts).where(eq(posts.id, parseInt(postId))).limit(1);

    if (!post) {
      return { title: 'Нийтлэл олдсонгүй' };
    }

    const contentPreview = typeof post.content === 'string'
      ? post.content.replace(/<[^>]*>/g, '').slice(0, 160)
      : '';

    return {
      title: post.title,
      description: contentPreview || 'KoreaMongol нийгэмлэгийн нийтлэл',
      openGraph: {
        title: `${post.title} | KoreaMongol`,
        description: contentPreview || 'KoreaMongol нийгэмлэгийн нийтлэл',
        url: `${BASE_URL}/community/${boardType}/${postId}`,
        type: 'article',
      },
      twitter: {
        card: 'summary',
        title: `${post.title} | KoreaMongol`,
        description: contentPreview,
      },
      alternates: {
        canonical: `${BASE_URL}/community/${boardType}/${postId}`,
      },
    };
  } catch {
    return { title: 'Нийтлэл' };
  }
}

export default async function PostLayout({ children, params }) {
  const { boardType, postId } = await params;

  let post = null;
  try {
    const [row] = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    }).from(posts).where(eq(posts.id, parseInt(postId))).limit(1);

    if (row) {
      post = row;
    }
  } catch {
    // Silently fail, no JSON-LD will be rendered
  }

  const board = boardConfig[boardType];

  const breadcrumbItems = [
    { name: 'KoreaMongol', url: BASE_URL },
    { name: 'Нийгэмлэг', url: `${BASE_URL}/community` },
    board && { name: board.title, url: `${BASE_URL}/community/${boardType}` },
    post && { name: post.title, url: `${BASE_URL}/community/${boardType}/${postId}` },
  ].filter(Boolean);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {post && <ArticleJsonLd post={post} boardType={boardType} />}
      {children}
    </>
  );
}
