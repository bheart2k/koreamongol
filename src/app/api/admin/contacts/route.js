import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, contactMessages } from '@/lib/db';
import { eq, ne, desc, count } from 'drizzle-orm';

// 문의 목록 조회
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 조건 빌드
    const whereCondition = status
      ? eq(contactMessages.status, status)
      : ne(contactMessages.status, 'deleted');

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(contactMessages)
      .where(whereCondition);

    const messages = await db
      .select()
      .from(contactMessages)
      .where(whereCondition)
      .orderBy(desc(contactMessages.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin Contacts GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// 문의 상태 업데이트
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNote, restore } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const [current] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const updateData = { updatedAt: new Date() };

    // 복원 요청
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
      updateData.status = status;
    }

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    const [message] = await db
      .update(contactMessages)
      .set(updateData)
      .where(eq(contactMessages.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Admin Contacts PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// 문의 완전 삭제 (휴지통에서만)
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 10) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // 휴지통에 있는 것만 삭제 가능
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)))
      .limit(1);

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (message.status !== 'deleted') {
      return NextResponse.json({ error: '휴지통에 있는 항목만 삭제할 수 있습니다.' }, { status: 400 });
    }

    await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Contacts DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
