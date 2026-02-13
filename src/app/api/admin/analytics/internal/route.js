import { auth, isAdmin } from '@/lib/auth';
import { db, analyticsEvents, dailyStats } from '@/lib/db';
import { eq, and, gte, lte, desc, asc, count, sum, sql } from 'drizzle-orm';

/**
 * GET /api/admin/analytics/internal
 *
 * @description 자체 DB에 저장된 커스텀 이벤트 통계 조회
 *
 * @query period - 기간 (3hours/6hours/12hours/24hours/today/yesterday/3days/7days/14days/30days/90days)
 */
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user || !isAdmin(session)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';

    // 시간 단위인지 확인
    const isHourPeriod = period.endsWith('hours');

    // 기간에 따른 날짜 범위 계산 (KST 기준)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);

    // 시간 단위 처리
    if (isHourPeriod) {
      const hours = parseInt(period);
      const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

      return await getHourlyStats(startTime, now, period);
    }

    let startDate, endDate;
    const today = new Date(
      Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate())
    );

    switch (period) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'yesterday':
        startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        endDate = startDate;
        break;
      case '3days':
        startDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case '14days':
        startDate = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case '30days':
        startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case '90days':
        startDate = new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case '7days':
      default:
        startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        endDate = today;
    }

    const formatDate = (d) => {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const dateRangeCondition = and(
      gte(analyticsEvents.date, startDateStr),
      lte(analyticsEvents.date, endDateStr)
    );

    const dailyDateRange = and(
      gte(dailyStats.date, startDateStr),
      lte(dailyStats.date, endDateStr)
    );

    // 병렬로 여러 쿼리 실행
    const [
      dailyStatsResult,
      eventSummary,
      topEvents,
      hourlyDistribution,
      recentEvents,
    ] = await Promise.all([
      // 일별 통계
      db
        .select()
        .from(dailyStats)
        .where(dailyDateRange)
        .orderBy(asc(dailyStats.date)),

      // 이벤트별 집계
      db
        .select({
          event: analyticsEvents.event,
          count: count(),
          totalValue: sum(analyticsEvents.value),
        })
        .from(analyticsEvents)
        .where(dateRangeCondition)
        .groupBy(analyticsEvents.event)
        .orderBy(desc(count())),

      // 카테고리별 집계
      db
        .select({
          category: analyticsEvents.category,
          count: count(),
        })
        .from(analyticsEvents)
        .where(dateRangeCondition)
        .groupBy(analyticsEvents.category)
        .orderBy(desc(count())),

      // 시간대별 분포 (전체 기간 합산)
      db
        .select({
          hour: analyticsEvents.hour,
          count: count(),
        })
        .from(analyticsEvents)
        .where(dateRangeCondition)
        .groupBy(analyticsEvents.hour)
        .orderBy(asc(analyticsEvents.hour)),

      // 최근 이벤트 (최신 20개)
      db
        .select({
          event: analyticsEvents.event,
          category: analyticsEvents.category,
          label: analyticsEvents.label,
          value: analyticsEvents.value,
          metadata: analyticsEvents.metadata,
          createdAt: analyticsEvents.createdAt,
        })
        .from(analyticsEvents)
        .where(dateRangeCondition)
        .orderBy(desc(analyticsEvents.createdAt))
        .limit(20),
    ]);

    // 도구별 사용량 집계
    const toolUsage = {
      generateName: 0,
      copyPhrase: 0,
      downloadPhrase: 0,
      shareCard: 0,
      flipCard: 0,
      downloadFont: 0,
    };

    const learning = {
      quizStarted: 0,
      quizCompleted: 0,
      totalQuizScore: 0,
      audioPlayed: 0,
    };

    let totalEvents = 0;

    dailyStatsResult.forEach((day) => {
      totalEvents += day.totalEvents || 0;

      // 도구
      toolUsage.generateName += day.toolUsage?.generateName || 0;
      toolUsage.copyPhrase += day.toolUsage?.copyPhrase || 0;
      toolUsage.downloadPhrase += day.toolUsage?.downloadPhrase || 0;
      toolUsage.shareCard += day.toolUsage?.shareCard || 0;
      toolUsage.flipCard += day.toolUsage?.flipCard || 0;
      toolUsage.downloadFont += day.toolUsage?.downloadFont || 0;

      // 학습
      learning.quizStarted += day.learning?.quizStarted || 0;
      learning.quizCompleted += day.learning?.quizCompleted || 0;
      learning.totalQuizScore += day.learning?.totalQuizScore || 0;
      learning.audioPlayed += day.learning?.audioPlayed || 0;
    });

    // 평균 퀴즈 점수 계산
    const avgQuizScore =
      learning.quizCompleted > 0
        ? Math.round(learning.totalQuizScore / learning.quizCompleted)
        : 0;

    // 시간대별 분포 배열로 변환
    const hourlyData = new Array(24).fill(0);
    hourlyDistribution.forEach((h) => {
      hourlyData[h.hour] = h.count;
    });

    // 일별 추이 데이터
    const dailyTrend = dailyStatsResult.map((day) => ({
      date: day.date,
      totalEvents: day.totalEvents || 0,
      tools:
        (day.toolUsage?.generateName || 0) +
        (day.toolUsage?.copyPhrase || 0) +
        (day.toolUsage?.downloadPhrase || 0) +
        (day.toolUsage?.downloadFont || 0),
      learning:
        (day.learning?.quizStarted || 0) +
        (day.learning?.quizCompleted || 0),
    }));

    return Response.json({
      period,
      dateRange: { start: startDateStr, end: endDateStr },

      // 전체 요약
      summary: {
        totalEvents,
        toolUsage,
        learning: {
          ...learning,
          avgQuizScore,
        },
      },

      // 이벤트별 집계
      eventSummary: eventSummary.map((e) => ({
        event: e.event,
        count: e.count,
        totalValue: parseInt(e.totalValue) || 0,
      })),

      // 카테고리별 집계
      categoryDistribution: topEvents.map((c) => ({
        category: c.category,
        count: c.count,
      })),

      // 시간대별 분포
      hourlyDistribution: hourlyData,

      // 일별 추이
      dailyTrend,

      // 최근 이벤트
      recentEvents: recentEvents.map((e) => ({
        event: e.event,
        category: e.category,
        label: e.label,
        value: e.value,
        metadata: e.metadata,
        createdAt: e.createdAt,
      })),
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5분 캐싱
      },
    }
    );
  } catch (error) {
    console.error('Internal Analytics API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch internal analytics' },
      { status: 500 }
    );
  }
}

/**
 * 시간 단위 통계 조회
 */
async function getHourlyStats(startTime, endTime, period) {
  const timeCondition = and(
    gte(analyticsEvents.createdAt, startTime),
    lte(analyticsEvents.createdAt, endTime)
  );

  const [eventSummary, hourlyDistribution, recentEvents, toolStats] = await Promise.all([
    // 이벤트별 집계
    db
      .select({
        event: analyticsEvents.event,
        count: count(),
        totalValue: sum(analyticsEvents.value),
      })
      .from(analyticsEvents)
      .where(timeCondition)
      .groupBy(analyticsEvents.event)
      .orderBy(desc(count())),

    // 시간대별 분포
    db
      .select({
        hour: analyticsEvents.hour,
        count: count(),
      })
      .from(analyticsEvents)
      .where(timeCondition)
      .groupBy(analyticsEvents.hour)
      .orderBy(asc(analyticsEvents.hour)),

    // 최근 이벤트
    db
      .select({
        event: analyticsEvents.event,
        category: analyticsEvents.category,
        label: analyticsEvents.label,
        value: analyticsEvents.value,
        metadata: analyticsEvents.metadata,
        createdAt: analyticsEvents.createdAt,
      })
      .from(analyticsEvents)
      .where(timeCondition)
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(20),

    // 도구별/학습별 집계
    db
      .select({
        totalEvents: count(),
        generateName: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'generate_name' THEN 1 ELSE 0 END)`,
        copyPhrase: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'copy_phrase' THEN 1 ELSE 0 END)`,
        downloadPhrase: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'download_phrase' THEN 1 ELSE 0 END)`,
        shareCard: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'share_card' THEN 1 ELSE 0 END)`,
        flipCard: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'flip_card' THEN 1 ELSE 0 END)`,
        downloadFont: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'download_font' THEN 1 ELSE 0 END)`,
        quizStarted: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'start_quiz' THEN 1 ELSE 0 END)`,
        quizCompleted: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'complete_quiz' THEN 1 ELSE 0 END)`,
        audioPlayed: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'play_audio' THEN 1 ELSE 0 END)`,
        totalQuizScore: sql<number>`SUM(CASE WHEN ${analyticsEvents.event} = 'complete_quiz' THEN COALESCE((${analyticsEvents.metadata}->>'score')::int, 0) ELSE 0 END)`,
      })
      .from(analyticsEvents)
      .where(timeCondition),
  ]);

  const stats = toolStats[0] || {
    totalEvents: 0,
    generateName: 0,
    copyPhrase: 0,
    downloadPhrase: 0,
    shareCard: 0,
    flipCard: 0,
    downloadFont: 0,
    quizStarted: 0,
    quizCompleted: 0,
    audioPlayed: 0,
    totalQuizScore: 0,
  };

  const totalEventsCount = parseInt(stats.totalEvents) || 0;
  const quizCompletedCount = parseInt(stats.quizCompleted) || 0;
  const totalQuizScoreCount = parseInt(stats.totalQuizScore) || 0;
  const avgQuizScore = quizCompletedCount > 0 ? Math.round(totalQuizScoreCount / quizCompletedCount) : 0;

  // 시간대별 분포 배열로 변환
  const hourlyData = new Array(24).fill(0);
  hourlyDistribution.forEach((h) => {
    hourlyData[h.hour] = h.count;
  });

  const formatTime = (d) => d.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return Response.json({
    period,
    dateRange: { start: formatTime(startTime), end: formatTime(endTime) },

    summary: {
      totalEvents: totalEventsCount,
      toolUsage: {
        generateName: parseInt(stats.generateName) || 0,
        copyPhrase: parseInt(stats.copyPhrase) || 0,
        downloadPhrase: parseInt(stats.downloadPhrase) || 0,
        shareCard: parseInt(stats.shareCard) || 0,
        flipCard: parseInt(stats.flipCard) || 0,
        downloadFont: parseInt(stats.downloadFont) || 0,
      },
      learning: {
        quizStarted: parseInt(stats.quizStarted) || 0,
        quizCompleted: quizCompletedCount,
        audioPlayed: parseInt(stats.audioPlayed) || 0,
        avgQuizScore,
      },
    },

    eventSummary: eventSummary.map((e) => ({
      event: e.event,
      count: e.count,
      totalValue: parseInt(e.totalValue) || 0,
    })),

    categoryDistribution: [],
    hourlyDistribution: hourlyData,
    dailyTrend: [], // 시간 단위에서는 일별 추이 없음

    recentEvents: recentEvents.map((e) => ({
      event: e.event,
      category: e.category,
      label: e.label,
      value: e.value,
      metadata: e.metadata,
      createdAt: e.createdAt,
    })),
  });
}
