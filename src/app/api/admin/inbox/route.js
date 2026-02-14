import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, inbox, users, INBOX_STATUSES, INBOX_PRIORITIES } from '@/lib/db';
import { eq, ne, and, desc, count, inArray } from 'drizzle-orm';
import { getPagination } from '@/lib/db';

// 목록 조회 (관리자)
export async function GET(request) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const { offset } = getPagination(page, limit);

    // 조건 빌드
    const conditions = [];
    if (type) conditions.push(eq(inbox.type, type));
    if (status) {
      conditions.push(eq(inbox.status, status));
    } else {
      conditions.push(ne(inbox.status, 'deleted'));
    }
    if (priority) conditions.push(eq(inbox.priority, priority));

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    // 목록 + 총 건수
    const [rows, [{ total }]] = await Promise.all([
      db.select({
        id: inbox.id,
        type: inbox.type,
        category: inbox.category,
        subject: inbox.subject,
        content: inbox.content,
        email: inbox.email,
        pageUrl: inbox.pageUrl,
        sectionId: inbox.sectionId,
        sectionTitle: inbox.sectionTitle,
        userId: inbox.userId,
        currentUrl: inbox.currentUrl,
        referrer: inbox.referrer,
        userAgent: inbox.userAgent,
        screenSize: inbox.screenSize,
        viewportSize: inbox.viewportSize,
        language: inbox.language,
        timezone: inbox.timezone,
        ipAddress: inbox.ipAddress,
        status: inbox.status,
        previousStatus: inbox.previousStatus,
        priority: inbox.priority,
        adminNote: inbox.adminNote,
        createdAt: inbox.createdAt,
        updatedAt: inbox.updatedAt,
        user: {
          nickname: users.nickname,
          image: users.image,
          email: users.email,
        },
      })
        .from(inbox)
        .leftJoin(users, eq(inbox.userId, users.id))
        .where(whereCondition)
        .orderBy(desc(inbox.createdAt))
        .offset(offset)
        .limit(limit),
      db.select({ total: count() }).from(inbox).where(whereCondition),
    ]);

    // 통계: 타입별 (휴지통 제외)
    const typeStats = await db
      .select({ type: inbox.type, count: count() })
      .from(inbox)
      .where(ne(inbox.status, 'deleted'))
      .groupBy(inbox.type);

    // 통계: 상태별
    const statusStats = await db
      .select({ status: inbox.status, count: count() })
      .from(inbox)
      .groupBy(inbox.status);

    return NextResponse.json({
      items: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        byType: typeStats.reduce((acc, r) => { acc[r.type] = r.count; return acc; }, {}),
        byStatus: statusStats.reduce((acc, r) => { acc[r.status] = r.count; return acc; }, {}),
      },
    });
  } catch (error) {
    console.error('Admin Inbox GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 });
  }
}

// 상태/우선순위/메모 변경 (관리자)
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, priority, adminNote, restore } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const [current] = await db.select().from(inbox)
      .where(eq(inbox.id, parseInt(id)))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updateData = { updatedAt: new Date() };

    // 복원
    if (restore) {
      updateData.status = current.previousStatus || 'pending';
      updateData.previousStatus = '';
    }
    // 휴지통 이동
    else if (status === 'deleted') {
      updateData.previousStatus = current.status;
      updateData.status = 'deleted';
    }
    // 일반 상태 변경
    else if (status) {
      if (!INBOX_STATUSES[status]) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;
    }

    if (priority) {
      if (!INBOX_PRIORITIES[priority]) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
      }
      updateData.priority = priority;
    }

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    const [updated] = await db.update(inbox)
      .set(updateData)
      .where(eq(inbox.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Admin Inbox PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// 완전 삭제 (휴지통에서만, 개발자 등급)
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 10) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const [item] = await db.select().from(inbox)
      .where(eq(inbox.id, parseInt(id)))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (item.status !== 'deleted') {
      return NextResponse.json({ error: '휴지통에 있는 항목만 삭제할 수 있습니다.' }, { status: 400 });
    }

    await db.delete(inbox).where(eq(inbox.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Inbox DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
