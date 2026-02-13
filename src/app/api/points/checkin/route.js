import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkIn } from '@/lib/services/pointService';
import { LEVEL_CONFIG } from '@/lib/db';

/**
 * POST /api/points/checkin - 출석 체크
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const result = await checkIn(session.user.id);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        alreadyReceived: result.alreadyReceived,
      }, { status: 400 });
    }

    // 레벨업 시 추가 정보
    let levelInfo = null;
    if (result.levelUp) {
      levelInfo = LEVEL_CONFIG.find((l) => l.level === result.newLevel);
    }

    return NextResponse.json({
      success: true,
      data: {
        points: result.points,
        totalPoints: result.totalPoints,
        balance: result.balance,
        consecutiveLogins: result.consecutiveLogins,
        levelUp: result.levelUp,
        newLevel: result.newLevel,
        levelTitle: levelInfo?.title,
        bonusPoints: result.bonusPoints,
      },
      message: result.message,
    });
  } catch (error) {
    console.error('출석 체크 오류:', error);
    return NextResponse.json({ success: false, error: '출석 체크 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
