import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, users, points, badges, LEVEL_CONFIG } from '@/lib/db';
import { eq, and, desc, count, inArray } from 'drizzle-orm';
import { getNextLevelInfo, getUserRanking } from '@/lib/services/pointService';

/**
 * GET /api/points - 포인트 정보 조회
 */
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const uid = parseInt(session.user.id);

    const [user] = await db.select({
      points: users.points,
      totalPoints: users.totalPoints,
      level: users.level,
      badges: users.badges,
      stats: users.stats,
    }).from(users).where(eq(users.id, uid)).limit(1);

    if (!user) {
      return NextResponse.json({ success: false, error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 배지 상세 정보 조회
    const badgeIds = user.badges || [];
    let userBadges = [];
    if (badgeIds.length > 0) {
      userBadges = await db.select({
        id: badges.id,
        code: badges.code,
        name: badges.name,
        icon: badges.icon,
        rarity: badges.rarity,
      }).from(badges).where(inArray(badges.id, badgeIds));
    }

    // 레벨 정보
    const levelInfo = LEVEL_CONFIG.find((l) => l.level === user.level);
    const nextLevel = getNextLevelInfo(user.totalPoints, user.level);

    // 랭킹
    const ranking = await getUserRanking(session.user.id);

    // 포인트 내역 (페이지네이션)
    const skip = (page - 1) * limit;
    const [history, totalResult] = await Promise.all([
      db.select().from(points)
        .where(eq(points.userId, uid))
        .orderBy(desc(points.createdAt))
        .offset(skip)
        .limit(limit),
      db.select({ count: count() }).from(points)
        .where(eq(points.userId, uid)),
    ]);

    const total = totalResult[0].count;

    return NextResponse.json({
      success: true,
      data: {
        points: user.points,
        totalPoints: user.totalPoints,
        level: user.level,
        levelTitle: levelInfo?.title || '한글 새싹',
        nextLevel,
        ranking,
        badges: userBadges,
        stats: user.stats || {},
        history,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('포인트 조회 오류:', error);
    return NextResponse.json({ success: false, error: '포인트 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
