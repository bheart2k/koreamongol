import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, feedback, FEEDBACK_CATEGORIES } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, title, content, guestEmail } = body;

    // 필수 필드 검증
    if (!category || !title || !content) {
      return NextResponse.json(
        { error: '카테고리, 제목, 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 카테고리 검증
    if (!FEEDBACK_CATEGORIES[category]) {
      return NextResponse.json(
        { error: '유효하지 않은 카테고리입니다.' },
        { status: 400 }
      );
    }

    // 길이 검증
    if (title.length > 100) {
      return NextResponse.json(
        { error: '제목은 100자 이내로 작성해주세요.' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: '내용은 2000자 이내로 작성해주세요.' },
        { status: 400 }
      );
    }

    // 세션 확인 (선택적 - 로그인 안 해도 됨)
    const session = await auth();

    // 피드백 생성
    const feedbackData = {
      category,
      title,
      content,
      userAgent: request.headers.get('user-agent') || '',
    };

    // 로그인 사용자면 authorId 저장
    if (session?.user?.id) {
      feedbackData.authorId = parseInt(session.user.id);
    }

    // 이메일 (선택)
    if (guestEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        return NextResponse.json(
          { error: '유효하지 않은 이메일 형식입니다.' },
          { status: 400 }
        );
      }
      feedbackData.guestEmail = guestEmail;
    }

    await db.insert(feedback).values(feedbackData);

    return NextResponse.json(
      { success: true, message: '피드백이 성공적으로 제출되었습니다.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: '피드백 제출에 실패했습니다.' },
      { status: 500 }
    );
  }
}
