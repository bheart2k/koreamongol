import { NextResponse } from 'next/server';
import { db, analyticsEvents, dailyStats } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

/**
 * POST /api/analytics/track
 *
 * @description 커스텀 이벤트를 자체 DB에 기록
 * GA4와 별도로 저장하여 상세 분석 가능
 *
 * @body {
 *   event: string (필수) - 이벤트 이름
 *   category?: string - 카테고리 (tools/learning/engagement/social)
 *   label?: string - 라벨
 *   value?: number - 값
 *   metadata?: object - 추가 데이터
 *   sessionId?: string - 세션 ID
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { event, category, label, value, metadata, sessionId } = body;

    // 필수 필드 검증
    if (!event) {
      return NextResponse.json(
        { error: 'event 필드는 필수입니다' },
        { status: 400 }
      );
    }

    // 허용된 이벤트인지 확인
    const allowedEvents = [
      'generate_name',
      'copy_phrase',
      'download_phrase',
      'share_card',
      'flip_card',
      'download_font',
      'complete_quiz',
      'start_quiz',
      'play_audio',
      'page_view',
    ];

    if (!allowedEvents.includes(event)) {
      return NextResponse.json(
        { error: '허용되지 않은 이벤트입니다' },
        { status: 400 }
      );
    }

    // 시간 정보 생성 (KST 기준)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);

    const year = kstDate.getUTCFullYear();
    const month = kstDate.getUTCMonth() + 1;
    const day = kstDate.getUTCDate();
    const hour = kstDate.getUTCHours();
    const dayOfWeek = kstDate.getUTCDay();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // User-Agent 추출
    const userAgent = request.headers.get('user-agent') || '';
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'ko';

    // 이벤트 저장
    await db.insert(analyticsEvents).values({
      event,
      category: category || 'engagement',
      label: label || '',
      value: value ?? 1,
      metadata: metadata || {},
      date: dateStr,
      year,
      month,
      day,
      hour,
      dayOfWeek,
      sessionId,
      userAgent,
      locale,
    });

    // DailyStats 업데이트 (upsert)
    // 이벤트별 필드 매핑
    const eventFieldMap = {
      generate_name: 'generateName',
      copy_phrase: 'copyPhrase',
      download_phrase: 'downloadPhrase',
      share_card: 'shareCard',
      flip_card: 'flipCard',
      download_font: 'downloadFont',
      start_quiz: 'quizStarted',
      complete_quiz: 'quizCompleted',
      play_audio: 'audioPlayed',
    };

    const catKey = category || 'engagement';

    // 기본 toolUsage/learning 증가 SQL 빌드
    let toolUsageUpdate = sql`${dailyStats.toolUsage}`;
    let learningUpdate = sql`${dailyStats.learning}`;

    const toolFields = ['generateName', 'copyPhrase', 'downloadPhrase', 'shareCard', 'flipCard', 'downloadFont'];
    const learningFields = ['quizStarted', 'quizCompleted', 'audioPlayed'];

    const fieldKey = eventFieldMap[event];
    if (fieldKey && toolFields.includes(fieldKey)) {
      toolUsageUpdate = sql`jsonb_set(${dailyStats.toolUsage}, ${`{${fieldKey}}`}, (COALESCE((${dailyStats.toolUsage}->>${fieldKey})::int, 0) + 1)::text::jsonb)`;
    }
    if (fieldKey && learningFields.includes(fieldKey)) {
      learningUpdate = sql`jsonb_set(${dailyStats.learning}, ${`{${fieldKey}}`}, (COALESCE((${dailyStats.learning}->>${fieldKey})::int, 0) + 1)::text::jsonb)`;
    }

    // 퀴즈 완료 시 점수 합산
    if (event === 'complete_quiz' && metadata?.score) {
      learningUpdate = sql`jsonb_set(
        jsonb_set(${dailyStats.learning}, ${'{quizCompleted}'}, (COALESCE((${dailyStats.learning}->>${'quizCompleted'})::int, 0) + 1)::text::jsonb),
        ${'{totalQuizScore}'}, (COALESCE((${dailyStats.learning}->>${'totalQuizScore'})::int, 0) + ${metadata.score})::text::jsonb
      )`;
    }

    await db
      .insert(dailyStats)
      .values({
        date: dateStr,
        year,
        month,
        dayOfWeek,
        totalEvents: 1,
        toolUsage: {
          generateName: toolFields.includes(fieldKey) && fieldKey === 'generateName' ? 1 : 0,
          copyPhrase: toolFields.includes(fieldKey) && fieldKey === 'copyPhrase' ? 1 : 0,
          downloadPhrase: toolFields.includes(fieldKey) && fieldKey === 'downloadPhrase' ? 1 : 0,
          shareCard: toolFields.includes(fieldKey) && fieldKey === 'shareCard' ? 1 : 0,
          flipCard: toolFields.includes(fieldKey) && fieldKey === 'flipCard' ? 1 : 0,
          downloadFont: toolFields.includes(fieldKey) && fieldKey === 'downloadFont' ? 1 : 0,
        },
        learning: {
          quizStarted: learningFields.includes(fieldKey) && fieldKey === 'quizStarted' ? 1 : 0,
          quizCompleted: (learningFields.includes(fieldKey) && fieldKey === 'quizCompleted' ? 1 : 0),
          totalQuizScore: (event === 'complete_quiz' && metadata?.score) ? metadata.score : 0,
          audioPlayed: learningFields.includes(fieldKey) && fieldKey === 'audioPlayed' ? 1 : 0,
        },
        hourlyDistribution: Array.from({ length: 24 }, (_, i) => i === hour ? 1 : 0),
        categoryDistribution: {
          tools: catKey === 'tools' ? 1 : 0,
          learning: catKey === 'learning' ? 1 : 0,
          engagement: catKey === 'engagement' ? 1 : 0,
          social: catKey === 'social' ? 1 : 0,
        },
      })
      .onConflictDoUpdate({
        target: dailyStats.date,
        set: {
          totalEvents: sql`${dailyStats.totalEvents} + 1`,
          toolUsage: toolUsageUpdate,
          learning: learningUpdate,
          hourlyDistribution: sql`jsonb_set(${dailyStats.hourlyDistribution}, ${`{${hour}}`}, (COALESCE((${dailyStats.hourlyDistribution}->${hour})::int, 0) + 1)::text::jsonb)`,
          categoryDistribution: sql`jsonb_set(${dailyStats.categoryDistribution}, ${`{${catKey}}`}, (COALESCE((${dailyStats.categoryDistribution}->>${catKey})::int, 0) + 1)::text::jsonb)`,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics Track Error]', error);
    return NextResponse.json(
      { error: '이벤트 기록에 실패했습니다' },
      { status: 500 }
    );
  }
}
