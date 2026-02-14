import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, comments, commentLikes } from '@/lib/db';
import { eq, and, sql } from 'drizzle-orm';

/**
 * POST /api/comments/[id]/like — 좋아요 토글
 */
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const commentId = parseInt(id);
    const userId = parseInt(session.user.id);

    // 댓글 존재 확인
    const [comment] = await db.select({ id: comments.id, likeCount: comments.likeCount })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!comment) {
      return NextResponse.json({ success: false, error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 기존 좋아요 확인
    const [existing] = await db.select()
      .from(commentLikes)
      .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
      .limit(1);

    let liked;
    let newLikeCount;

    if (existing) {
      // 좋아요 취소
      await Promise.all([
        db.delete(commentLikes).where(eq(commentLikes.id, existing.id)),
        db.update(comments).set({
          likeCount: sql`GREATEST(${comments.likeCount} - 1, 0)`,
        }).where(eq(comments.id, commentId)),
      ]);
      liked = false;
      newLikeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // 좋아요 추가
      await Promise.all([
        db.insert(commentLikes).values({ userId, commentId }),
        db.update(comments).set({
          likeCount: sql`${comments.likeCount} + 1`,
        }).where(eq(comments.id, commentId)),
      ]);
      liked = true;
      newLikeCount = comment.likeCount + 1;
    }

    return NextResponse.json({
      success: true,
      data: { liked, likeCount: newLikeCount },
    });
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return NextResponse.json({ success: false, error: '오류가 발생했습니다.' }, { status: 500 });
  }
}
