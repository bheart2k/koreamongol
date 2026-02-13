import { NextResponse } from 'next/server';
import { db, posts } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

/**
 * POST /api/posts/[id]/view - 조회수 증가
 * 클라이언트에서 호출 (중복 방지는 클라이언트에서 처리)
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    const [result] = await db.update(posts).set({
      viewCount: sql`${posts.viewCount} + 1`,
    }).where(eq(posts.id, postId)).returning({ viewCount: posts.viewCount });

    if (!result) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      viewCount: result.viewCount,
    });
  } catch (error) {
    console.error('조회수 증가 오류:', error);
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
  }
}
