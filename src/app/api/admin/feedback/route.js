import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, feedback, users, FEEDBACK_STATUSES, FEEDBACK_PRIORITIES } from '@/lib/db';
import { eq, ne, and, desc, count, inArray } from 'drizzle-orm';

// 피드백 목록 조회 (통계 포함)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 조건 빌드
    const conditions = [];
    if (category) conditions.push(eq(feedback.category, category));
    if (status) {
      conditions.push(eq(feedback.status, status));
    } else {
      conditions.push(ne(feedback.status, 'deleted'));
    }
    if (priority) conditions.push(eq(feedback.priority, priority));

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    // 피드백 목록
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(feedback)
      .where(whereCondition);

    const feedbacks = await db
      .select({
        id: feedback.id,
        authorId: feedback.authorId,
        guestEmail: feedback.guestEmail,
        category: feedback.category,
        title: feedback.title,
        content: feedback.content,
        status: feedback.status,
        previousStatus: feedback.previousStatus,
        priority: feedback.priority,
        adminNote: feedback.adminNote,
        userAgent: feedback.userAgent,
        ipAddress: feedback.ipAddress,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        author: {
          nickname: users.nickname,
          image: users.image,
        },
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.authorId, users.id))
      .where(whereCondition)
      .orderBy(desc(feedback.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    // 통계: 카테고리별 (휴지통 제외)
    const categoryStats = await db
      .select({
        category: feedback.category,
        count: count(),
      })
      .from(feedback)
      .where(ne(feedback.status, 'deleted'))
      .groupBy(feedback.category);

    // 통계: 상태별
    const statusStats = await db
      .select({
        status: feedback.status,
        count: count(),
      })
      .from(feedback)
      .groupBy(feedback.status);

    // 통계: 우선순위별 (pending, reviewing만)
    const priorityStats = await db
      .select({
        priority: feedback.priority,
        count: count(),
      })
      .from(feedback)
      .where(inArray(feedback.status, ['pending', 'reviewing']))
      .groupBy(feedback.priority);

    return NextResponse.json({
      feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        byCategory: categoryStats.reduce((acc, item) => {
          acc[item.category] = item.count;
          return acc;
        }, {}),
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item.priority] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Admin Feedback GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

// 피드백 업데이트 (상태, 우선순위, 메모)
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 20) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, priority, adminNote, restore } = body;

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    const [current] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, parseInt(id)))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
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
      if (!FEEDBACK_STATUSES[status]) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;
    }

    if (priority) {
      if (!FEEDBACK_PRIORITIES[priority]) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
      }
      updateData.priority = priority;
    }

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    await db
      .update(feedback)
      .set(updateData)
      .where(eq(feedback.id, parseInt(id)));

    // 업데이트 후 author join 포함해서 다시 조회
    const [updatedFeedback] = await db
      .select({
        id: feedback.id,
        authorId: feedback.authorId,
        guestEmail: feedback.guestEmail,
        category: feedback.category,
        title: feedback.title,
        content: feedback.content,
        status: feedback.status,
        previousStatus: feedback.previousStatus,
        priority: feedback.priority,
        adminNote: feedback.adminNote,
        userAgent: feedback.userAgent,
        ipAddress: feedback.ipAddress,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        author: {
          nickname: users.nickname,
          image: users.image,
        },
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.authorId, users.id))
      .where(eq(feedback.id, parseInt(id)))
      .limit(1);

    return NextResponse.json({ success: true, feedback: updatedFeedback });
  } catch (error) {
    console.error('Admin Feedback PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

// 피드백 완전 삭제 (휴지통에서만)
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.grade > 10) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    // 휴지통에 있는 것만 삭제 가능
    const [fb] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, parseInt(id)))
      .limit(1);

    if (!fb) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    if (fb.status !== 'deleted') {
      return NextResponse.json({ error: '휴지통에 있는 항목만 삭제할 수 있습니다.' }, { status: 400 });
    }

    await db
      .delete(feedback)
      .where(eq(feedback.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Feedback DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
