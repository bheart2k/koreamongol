import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, contactMessages, feedback } from '@/lib/db';
import { eq, inArray, count } from 'drizzle-orm';

// 관리자 알림 카운트 조회 (문의/피드백 대기 건수)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 문의 대기 건수 (pending)
    const [{ count: contactsPending }] = await db
      .select({ count: count() })
      .from(contactMessages)
      .where(eq(contactMessages.status, 'pending'));

    // 피드백 대기 건수 (pending + reviewing)
    const [{ count: feedbackPending }] = await db
      .select({ count: count() })
      .from(feedback)
      .where(inArray(feedback.status, ['pending', 'reviewing']));

    return NextResponse.json({
      contacts: contactsPending,
      feedback: feedbackPending,
    });
  } catch (error) {
    console.error('Admin Notifications Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
