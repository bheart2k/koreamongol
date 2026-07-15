import { NextResponse } from 'next/server';
import { db, analyticsEvents } from '@/lib/db';
import { and, eq, inArray, sql } from 'drizzle-orm';

// 페이지별 조회/도움됐어요 집계 (HelpfulWidget용)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    if (!path.startsWith('/')) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    const [row] = await db
      .select({
        views: sql`count(*) filter (where ${analyticsEvents.event} = 'tip_view')`.mapWith(Number),
        helpful: sql`count(*) filter (where ${analyticsEvents.event} = 'tip_helpful')`.mapWith(Number),
      })
      .from(analyticsEvents)
      .where(
        and(
          inArray(analyticsEvents.event, ['tip_view', 'tip_helpful']),
          eq(analyticsEvents.label, path)
        )
      );

    return NextResponse.json({ views: row?.views ?? 0, helpful: row?.helpful ?? 0 });
  } catch (error) {
    console.error('[Page Stats Error]', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
