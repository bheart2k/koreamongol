import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const customers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        grade: users.grade,
        provider: users.provider,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      customers,
      total: customers.length,
    });
  } catch (error) {
    console.error('Admin customers API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
