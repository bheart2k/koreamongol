import { NextResponse } from 'next/server';
import { db, analyticsEvents, dailyStats } from '@/lib/db';
import { sql } from 'drizzle-orm';

const ALLOWED_EVENTS = [
  'guide_view',
  'emergency_call',
  'external_link',
  'share_facebook',
  'share_copy_link',
  'exchange_calculate',
  'severance_calculate',
  'community_post',
  'community_comment',
  'donate_click',
  'page_view',
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { event, category, label, value, metadata, sessionId } = body;

    if (!event) {
      return NextResponse.json({ error: 'event is required' }, { status: 400 });
    }

    if (!ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json({ error: 'invalid event' }, { status: 400 });
    }

    // KST 시간
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const year = kst.getUTCFullYear();
    const month = kst.getUTCMonth() + 1;
    const day = kst.getUTCDate();
    const hour = kst.getUTCHours();
    const dayOfWeek = kst.getUTCDay();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const userAgent = request.headers.get('user-agent') || '';
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'mn';

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

    // DailyStats upsert
    const catKey = category || 'engagement';

    // 카테고리별 필드 매핑
    const guideEvents = ['guide_view', 'emergency_call', 'external_link'];
    const socialEvents = ['share_facebook', 'share_copy_link'];
    const toolEvents = ['exchange_calculate'];
    const communityEvents = ['community_post', 'community_comment'];

    const guideInc = guideEvents.includes(event) ? 1 : 0;
    const socialInc = socialEvents.includes(event) ? 1 : 0;
    const toolsInc = toolEvents.includes(event) ? 1 : 0;
    const communityInc = communityEvents.includes(event) ? 1 : 0;
    const engagementInc = event === 'donate_click' || event === 'page_view' ? 1 : 0;

    await db
      .insert(dailyStats)
      .values({
        date: dateStr,
        year,
        month,
        dayOfWeek,
        totalEvents: 1,
        toolUsage: {
          guide: guideInc,
          social: socialInc,
          tools: toolsInc,
          community: communityInc,
        },
        learning: {
          guideViews: event === 'guide_view' ? 1 : 0,
          shares: socialInc,
          exchangeCalc: toolsInc,
          donateClicks: event === 'donate_click' ? 1 : 0,
        },
        hourlyDistribution: Array.from({ length: 24 }, (_, i) => i === hour ? 1 : 0),
        categoryDistribution: {
          guide: guideInc,
          social: socialInc,
          tools: toolsInc,
          community: communityInc,
          engagement: engagementInc,
        },
      })
      .onConflictDoUpdate({
        target: dailyStats.date,
        set: {
          totalEvents: sql`${dailyStats.totalEvents} + 1`,
          toolUsage: sql`jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(${dailyStats.toolUsage},
                  '{guide}', (COALESCE((${dailyStats.toolUsage}->>'guide')::int, 0) + ${guideInc})::text::jsonb),
                '{social}', (COALESCE((${dailyStats.toolUsage}->>'social')::int, 0) + ${socialInc})::text::jsonb),
              '{tools}', (COALESCE((${dailyStats.toolUsage}->>'tools')::int, 0) + ${toolsInc})::text::jsonb),
            '{community}', (COALESCE((${dailyStats.toolUsage}->>'community')::int, 0) + ${communityInc})::text::jsonb)`,
          learning: sql`jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(${dailyStats.learning},
                  '{guideViews}', (COALESCE((${dailyStats.learning}->>'guideViews')::int, 0) + ${event === 'guide_view' ? 1 : 0})::text::jsonb),
                '{shares}', (COALESCE((${dailyStats.learning}->>'shares')::int, 0) + ${socialInc})::text::jsonb),
              '{exchangeCalc}', (COALESCE((${dailyStats.learning}->>'exchangeCalc')::int, 0) + ${toolsInc})::text::jsonb),
            '{donateClicks}', (COALESCE((${dailyStats.learning}->>'donateClicks')::int, 0) + ${event === 'donate_click' ? 1 : 0})::text::jsonb)`,
          hourlyDistribution: sql`jsonb_set(${dailyStats.hourlyDistribution}, ${`{${hour}}`}, (COALESCE((${dailyStats.hourlyDistribution}->${hour})::int, 0) + 1)::text::jsonb)`,
          categoryDistribution: sql`jsonb_set(${dailyStats.categoryDistribution}, ${`{${catKey}}`}, (COALESCE((${dailyStats.categoryDistribution}->>${catKey})::int, 0) + 1)::text::jsonb)`,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics Track Error]', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
