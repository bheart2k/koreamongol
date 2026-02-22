import { db, posts } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

const boardConfig = {
  blog: { title: 'Блог' },
  free: { title: 'Чөлөөт самбар' },
  notice: { title: 'Мэдэгдэл & FAQ' },
  expression: { title: 'Илэрхийлэл асуулт' },
};

export default async function PostLayout({ children, params }) {
  const { boardType, postId } = await params;

  let post = null;
  try {
    const [row] = await db.select({
      title: posts.title,
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
      {children}
    </>
  );
}
