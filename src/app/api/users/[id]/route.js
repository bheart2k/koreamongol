import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET: 사용자 정보 조회
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      nickname: users.nickname,
      bio: users.bio,
      points: users.points,
      totalPoints: users.totalPoints,
      level: users.level,
      stats: users.stats,
      badges: users.badges,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, parseInt(id))).limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '사용자 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 사용자 정보 수정
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;

    // 인증 확인
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 본인 확인
    if (session.user.id !== id) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nickname, bio, image } = body;

    // 업데이트할 필드만 추출
    const updateData = { updatedAt: new Date() };
    if (nickname !== undefined) {
      updateData.nickname = nickname.trim().slice(0, 20);
    }
    if (bio !== undefined) {
      updateData.bio = bio.trim().slice(0, 200);
    }
    if (image !== undefined) {
      updateData.image = image;
    }

    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        nickname: users.nickname,
        bio: users.bio,
        points: users.points,
        totalPoints: users.totalPoints,
        level: users.level,
        stats: users.stats,
      });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('사용자 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '사용자 정보 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}
