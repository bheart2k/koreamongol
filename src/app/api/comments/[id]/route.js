import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, comments, posts, users } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

/**
 * DELETE /api/comments/[id] - 댓글 삭제
 */
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const commentId = parseInt(id);

    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);

    if (!comment || comment.state === 'D') {
      return NextResponse.json({ success: false, error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 답글이 있는지 확인 (이미 저장된 replyCount 사용)
    if (comment.replyCount > 0) {
      return NextResponse.json({ success: false, error: '답글이 있는 댓글은 삭제할 수 없습니다.' }, { status: 400 });
    }

    // 권한 체크 (작성자 또는 관리자)
    const isAuthor = comment.authorId === parseInt(session.user.id);
    if (!isAuthor && !isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    // 병렬로 처리
    const updates = [
      db.update(comments).set({ state: 'D', updatedAt: new Date() }).where(eq(comments.id, commentId)),
      db.update(posts).set({
        commentCount: sql`GREATEST(${posts.commentCount} - 1, 0)`,
      }).where(eq(posts.id, comment.postId)),
      db.update(users).set({
        stats: sql`jsonb_set(${users.stats}, '{commentsCount}', (GREATEST(COALESCE((${users.stats}->>'commentsCount')::int, 0) - 1, 0))::text::jsonb)`,
        updatedAt: new Date(),
      }).where(eq(users.id, comment.authorId)),
    ];

    if (comment.parentCommentId) {
      updates.push(
        db.update(comments).set({
          replyCount: sql`GREATEST(${comments.replyCount} - 1, 0)`,
        }).where(eq(comments.id, comment.parentCommentId))
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: '댓글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return NextResponse.json({ success: false, error: '댓글 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * PATCH /api/comments/[id] - 댓글 수정
 */
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();
    const commentId = parseInt(id);

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: '내용을 입력해주세요.' }, { status: 400 });
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ success: false, error: '댓글은 1000자까지 입력할 수 있습니다.' }, { status: 400 });
    }

    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);

    if (!comment || comment.state === 'D') {
      return NextResponse.json({ success: false, error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 체크 (작성자만 수정 가능)
    if (comment.authorId !== parseInt(session.user.id)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    // 댓글 업데이트
    const [updatedComment] = await db.update(comments).set({
      content: content.trim(),
      updatedAt: new Date(),
    }).where(eq(comments.id, commentId)).returning();

    // 작성자 정보 조회
    const [author] = await db.select({
      id: users.id,
      nickname: users.nickname,
      image: users.image,
      level: users.level,
    }).from(users).where(eq(users.id, updatedComment.authorId)).limit(1);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedComment,
        author,
      },
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    return NextResponse.json({ success: false, error: '댓글 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
