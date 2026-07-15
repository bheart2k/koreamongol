import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, feedback, users, getPagination } from '@/lib/db';
import { eq, desc, count, sql } from 'drizzle-orm';

// 피드백 목록 + 평점 평균 (관리자)
export async function GET(request) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const { offset } = getPagination(page, limit);

    const whereCondition = category ? eq(feedback.category, category) : undefined;

    const [rows, [{ total }], [stats]] = await Promise.all([
      db
        .select({
          id: feedback.id,
          category: feedback.category,
          ratingUseful: feedback.ratingUseful,
          ratingTrust: feedback.ratingTrust,
          ratingEasy: feedback.ratingEasy,
          ratingRecommend: feedback.ratingRecommend,
          comment: feedback.comment,
          email: feedback.email,
          userId: feedback.userId,
          nickname: users.nickname,
          createdAt: feedback.createdAt,
        })
        .from(feedback)
        .leftJoin(users, eq(feedback.userId, users.id))
        .where(whereCondition)
        .orderBy(desc(feedback.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(feedback).where(whereCondition),
      db
        .select({
          avgUseful: sql`round(avg(${feedback.ratingUseful}), 2)`.mapWith(Number),
          avgTrust: sql`round(avg(${feedback.ratingTrust}), 2)`.mapWith(Number),
          avgEasy: sql`round(avg(${feedback.ratingEasy}), 2)`.mapWith(Number),
          avgRecommend: sql`round(avg(${feedback.ratingRecommend}), 2)`.mapWith(Number),
          totalAll: count(),
        })
        .from(feedback),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        rows,
        total,
        page,
        limit,
        stats,
      },
    });
  } catch (error) {
    console.error('Admin Feedback GET Error:', error);
    return NextResponse.json({ error: 'Failed to load feedback' }, { status: 500 });
  }
}
