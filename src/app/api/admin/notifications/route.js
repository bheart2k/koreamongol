import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, inbox } from '@/lib/db';
import { eq, inArray, count, and } from 'drizzle-orm';

// 관리자 알림 카운트 조회 (inbox 대기 건수)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // inbox pending + reviewing 건수
    const [{ count: inboxPending }] = await db
      .select({ count: count() })
      .from(inbox)
      .where(inArray(inbox.status, ['pending', 'reviewing']));

    return NextResponse.json({
      inbox: inboxPending,
    });
  } catch (error) {
    console.error('Admin Notifications Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
