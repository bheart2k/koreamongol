/**
 * 포인트 서비스 - 포인트 지급, 레벨업, 배지 체크
 */
import { db, users, points, badges, POINT_CONFIG, LEVEL_CONFIG } from '@/lib/db';
import { eq, and, gte, gt, count, sql } from 'drizzle-orm';
import dayjs from 'dayjs';

/**
 * 포인트 지급
 */
export async function givePoints(userId, type, options = {}) {
  const config = POINT_CONFIG[type];
  if (!config) {
    return { success: false, error: '잘못된 포인트 타입입니다.' };
  }

  const [user] = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);
  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  const today = dayjs().startOf('day').toDate();
  const pointAmount = options.points || config.points;
  const uid = parseInt(userId);

  // 1일 1회 제한 체크
  if (config.daily) {
    const [existing] = await db.select({ id: points.id })
      .from(points)
      .where(and(eq(points.userId, uid), eq(points.type, type), gte(points.createdAt, today)))
      .limit(1);
    if (existing) {
      return { success: false, error: '오늘 이미 받은 포인트입니다.', alreadyReceived: true };
    }
  }

  // 1회성 포인트 체크 (회원가입 등)
  if (config.once) {
    const [existing] = await db.select({ id: points.id })
      .from(points)
      .where(and(eq(points.userId, uid), eq(points.type, type)))
      .limit(1);
    if (existing) {
      return { success: false, error: '이미 받은 포인트입니다.', alreadyReceived: true };
    }
  }

  // 일일 횟수 제한 체크
  if (config.dailyLimit) {
    const [result] = await db.select({ cnt: count() })
      .from(points)
      .where(and(eq(points.userId, uid), eq(points.type, type), gte(points.createdAt, today)));
    if (result.cnt >= config.dailyLimit) {
      return { success: false, error: '오늘 최대 횟수에 도달했습니다.', limitReached: true };
    }
  }

  // 포인트 지급
  const currentPoints = user.points || 0;
  const currentTotalPoints = user.totalPoints || 0;
  const newBalance = currentPoints + pointAmount;
  const newTotalPoints = currentTotalPoints + pointAmount;

  // 포인트 내역 생성
  await db.insert(points).values({
    userId: uid,
    type,
    points: pointAmount,
    description: options.description || config.description,
    relatedType: options.relatedType || null,
    relatedId: options.relatedId ? parseInt(options.relatedId) : null,
    balanceAfter: newBalance,
  });

  // 사용자 포인트 업데이트
  await db.update(users).set({
    points: newBalance,
    totalPoints: newTotalPoints,
    updatedAt: new Date(),
  }).where(eq(users.id, uid));

  // 레벨업 체크
  const levelUpResult = await checkLevelUp(uid, newTotalPoints);

  return {
    success: true,
    points: pointAmount,
    totalPoints: newTotalPoints,
    balance: newBalance,
    ...levelUpResult,
  };
}

/**
 * 레벨업 체크 및 처리
 */
async function checkLevelUp(userId, totalPoints) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const currentLevel = user.level;

  // 새 레벨 계산
  let newLevel = 1;
  for (const levelInfo of LEVEL_CONFIG) {
    if (totalPoints >= levelInfo.requiredPoints) {
      newLevel = levelInfo.level;
    } else {
      break;
    }
  }

  if (newLevel > currentLevel) {
    // 레벨업!
    await db.update(users).set({ level: newLevel, updatedAt: new Date() }).where(eq(users.id, userId));

    const levelInfo = LEVEL_CONFIG.find((l) => l.level === newLevel);

    // 레벨업 보너스 포인트
    const bonusPoints = POINT_CONFIG.level_up.points;
    await db.insert(points).values({
      userId,
      type: 'level_up',
      points: bonusPoints,
      description: `레벨 ${newLevel} 달성 보너스`,
      balanceAfter: user.points + bonusPoints,
    });

    await db.update(users).set({
      points: sql`${users.points} + ${bonusPoints}`,
      totalPoints: sql`${users.totalPoints} + ${bonusPoints}`,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));

    return { levelUp: true, newLevel, levelTitle: levelInfo.title, bonusPoints };
  }

  return { levelUp: false, newLevel: currentLevel };
}

/**
 * 배지 체크 및 지급
 */
export async function checkBadges(userId, conditionType, value) {
  const uid = parseInt(userId);

  const [user] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
  const userBadgeIds = user.badges || [];

  // 조건에 맞는 배지 찾기
  const allBadges = await db.select().from(badges).where(eq(badges.isActive, true));

  const eligibleBadges = allBadges.filter((badge) => {
    if (userBadgeIds.includes(badge.id)) return false;
    if (!badge.condition) return false;
    return badge.condition.type === conditionType && badge.condition.count <= value;
  });

  const earnedBadges = [];

  for (const badge of eligibleBadges) {
    // 배지 지급 (JSONB 배열에 추가)
    await db.update(users).set({
      badges: sql`${users.badges} || ${JSON.stringify([badge.id])}::jsonb`,
      updatedAt: new Date(),
    }).where(eq(users.id, uid));

    // 배지 보너스 포인트
    if (badge.rewardPoints > 0) {
      await givePoints(uid, 'badge', {
        points: badge.rewardPoints,
        description: `배지 획득: ${badge.name}`,
        relatedType: 'Badge',
        relatedId: badge.id,
      });
    }

    earnedBadges.push(badge);
  }

  return earnedBadges;
}

/**
 * 출석 체크 (로그인 시 호출)
 */
export async function checkIn(userId) {
  const uid = parseInt(userId);

  const [user] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  const result = await givePoints(uid, 'login');

  if (result.success) {
    // 연속 출석 체크
    const lastLogin = user.lastLoginAt ? dayjs(user.lastLoginAt) : null;
    const today = dayjs().startOf('day');
    const yesterday = today.subtract(1, 'day');

    let consecutiveLogins = user.consecutiveLogins || 0;

    if (lastLogin) {
      const lastLoginDay = dayjs(lastLogin).startOf('day');
      if (lastLoginDay.isSame(yesterday)) {
        consecutiveLogins += 1;
      } else if (!lastLoginDay.isSame(today)) {
        consecutiveLogins = 1;
      }
    } else {
      consecutiveLogins = 1;
    }

    // 출석일수 업데이트
    const currentStats = user.stats || { postsCount: 0, commentsCount: 0, loginDays: 0, namesGenerated: 0, lessonsCompleted: 0 };
    await db.update(users).set({
      lastLoginAt: new Date(),
      consecutiveLogins,
      stats: { ...currentStats, loginDays: (currentStats.loginDays || 0) + 1 },
      updatedAt: new Date(),
    }).where(eq(users.id, uid));

    return {
      ...result,
      consecutiveLogins,
      message: `+${result.points} 포인트 획득!`,
    };
  }

  return result;
}

/**
 * 다음 레벨까지 정보
 */
export function getNextLevelInfo(totalPoints, currentLevel) {
  const nextLevelConfig = LEVEL_CONFIG.find((l) => l.level === currentLevel + 1);

  if (!nextLevelConfig) {
    return { isMaxLevel: true };
  }

  const currentLevelConfig = LEVEL_CONFIG.find((l) => l.level === currentLevel);
  const pointsForNextLevel = nextLevelConfig.requiredPoints - totalPoints;
  const progress =
    ((totalPoints - currentLevelConfig.requiredPoints) /
      (nextLevelConfig.requiredPoints - currentLevelConfig.requiredPoints)) *
    100;

  return {
    isMaxLevel: false,
    nextLevel: nextLevelConfig.level,
    nextLevelTitle: nextLevelConfig.title,
    requiredPoints: nextLevelConfig.requiredPoints,
    pointsNeeded: pointsForNextLevel,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

/**
 * 사용자 랭킹 조회
 */
export async function getUserRanking(userId) {
  const uid = parseInt(userId);

  const [user] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
  if (!user) return null;

  const [result] = await db.select({ cnt: count() })
    .from(users)
    .where(and(gt(users.totalPoints, user.totalPoints), eq(users.state, 'Y')));

  return result.cnt + 1;
}
