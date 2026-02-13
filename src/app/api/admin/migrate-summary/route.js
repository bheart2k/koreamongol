import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, posts } from '@/lib/db';
import { eq, and, or, isNull, sql } from 'drizzle-orm';
import { generateSummary } from '@/lib/utils/postUtils';

/**
 * POST /api/admin/migrate-summary
 * 기존 게시글에 summary 필드 추가 (마이그레이션)
 */
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    // summary가 없거나 빈 문자열인 활성 게시글 조회
    const postsToMigrate = await db.select({
      id: posts.id,
      content: posts.content,
    })
      .from(posts)
      .where(and(
        eq(posts.state, 'Y'),
        or(
          isNull(posts.summary),
          eq(posts.summary, ''),
        ),
      ));

    let updated = 0;
    const errors = [];

    for (const post of postsToMigrate) {
      try {
        const summary = generateSummary(post.content);
        await db.update(posts).set({ summary }).where(eq(posts.id, post.id));
        updated++;
      } catch (err) {
        errors.push({ id: post.id, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updated}개 게시글의 summary가 생성되었습니다.`,
      total: postsToMigrate.length,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('마이그레이션 오류:', error);
    return NextResponse.json({ success: false, error: '마이그레이션 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
