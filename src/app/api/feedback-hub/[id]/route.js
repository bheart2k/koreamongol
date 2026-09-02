import { NextResponse } from 'next/server';
import { eq, getTableColumns } from 'drizzle-orm';
import { db, feedback, inbox, users } from '@/lib/db';
import {
  checkHubAuth,
  HUB_STATUSES,
  HUB_PRIORITIES,
  feedbackStatusFromHub,
  inboxStatusFromHub,
  feedbackToHubItem,
  inboxToHubItem,
} from '@/lib/feedbackHub';

// 피드백 허브 어댑터: 상태·우선순위·메모 변경 (스펙 §3.3)
// id 접두사(fb-/in-)로 대상 테이블을 판별한다.
export async function PATCH(request, { params }) {
  const authError = checkHubAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const match = /^(fb|in)-(\d+)$/.exec(id || '');
    if (!match) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const [, prefix, numStr] = match;
    const numId = parseInt(numStr, 10);

    const body = await request.json().catch(() => ({}));
    const { status, priority, adminNote } = body || {};

    if (status === undefined && priority === undefined && adminNote === undefined) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    if (status !== undefined && !HUB_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    if (priority !== undefined && !HUB_PRIORITIES.includes(priority)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }

    if (prefix === 'fb') {
      const [current] = await db.select().from(feedback).where(eq(feedback.id, numId)).limit(1);
      if (!current) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }

      // feedback 테이블: 2026-09-02 표준 컬럼 추가로 priority/previousStatus 전부 지원 (스펙 §3.3 완전 준수)
      const updateData = { updatedAt: new Date() };
      if (status !== undefined) {
        const rawStatus = feedbackStatusFromHub(status);
        if (rawStatus === 'deleted') {
          // 휴지통 이동: 기존 상태 백업
          updateData.previousStatus = current.status;
          updateData.status = 'deleted';
        } else {
          updateData.status = rawStatus;
          if (current.status === 'deleted') updateData.previousStatus = '';
        }
      }
      if (priority !== undefined) updateData.priority = priority;
      if (adminNote !== undefined) updateData.adminNote = adminNote;

      await db.update(feedback).set(updateData).where(eq(feedback.id, numId));

      const [updated] = await db
        .select({ ...getTableColumns(feedback), author: { nickname: users.nickname } })
        .from(feedback)
        .leftJoin(users, eq(feedback.userId, users.id))
        .where(eq(feedback.id, numId))
        .limit(1);

      return NextResponse.json({ ok: true, item: feedbackToHubItem(updated) });
    }

    // prefix === 'in': inbox 테이블. status/previousStatus/priority/adminNote 컬럼 모두 존재.
    const [current] = await db.select().from(inbox).where(eq(inbox.id, numId)).limit(1);
    if (!current) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const updateData = { updatedAt: new Date() };
    if (status !== undefined) {
      const rawStatus = inboxStatusFromHub(status);
      if (rawStatus === 'deleted') {
        // 휴지통 이동: 기존 상태 백업
        updateData.previousStatus = current.status;
        updateData.status = 'deleted';
      } else {
        updateData.status = rawStatus;
        if (current.status === 'deleted') updateData.previousStatus = '';
      }
    }
    if (priority !== undefined) updateData.priority = priority;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    await db.update(inbox).set(updateData).where(eq(inbox.id, numId));

    const [updated] = await db
      .select({ ...getTableColumns(inbox), user: { nickname: users.nickname } })
      .from(inbox)
      .leftJoin(users, eq(inbox.userId, users.id))
      .where(eq(inbox.id, numId))
      .limit(1);

    return NextResponse.json({ ok: true, item: inboxToHubItem(updated) });
  } catch (error) {
    console.error('Feedback Hub PATCH Error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
