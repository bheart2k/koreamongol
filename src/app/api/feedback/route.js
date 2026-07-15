import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, feedback, FEEDBACK_CATEGORIES } from '@/lib/db';

const RATING_KEYS = ['ratingUseful', 'ratingTrust', 'ratingEasy', 'ratingRecommend'];

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { category, comment, email } = body;

    if (category && !FEEDBACK_CATEGORIES[category]) {
      return NextResponse.json({ error: 'Ангилал буруу байна.' }, { status: 400 });
    }

    // 평점 검증 (1~5, 미응답 null)
    const ratings = {};
    for (const key of RATING_KEYS) {
      const v = body[key];
      if (v == null) {
        ratings[key] = null;
        continue;
      }
      const n = parseInt(v);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        return NextResponse.json({ error: 'Үнэлгээ 1~5 байх ёстой.' }, { status: 400 });
      }
      ratings[key] = n;
    }

    const trimmedComment = (comment || '').trim();
    const hasRating = RATING_KEYS.some((key) => ratings[key] != null);

    if (!hasRating && !trimmedComment) {
      return NextResponse.json({ error: 'Үнэлгээ эсвэл санал бичнэ үү.' }, { status: 400 });
    }

    if (trimmedComment.length > 3000) {
      return NextResponse.json({ error: 'Санал 3000 тэмдэгтээс хэтрэхгүй байна.' }, { status: 400 });
    }

    // 비로그인 이메일 검증 (optional)
    if (!session?.user?.id && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'И-мэйл хаяг буруу байна.' }, { status: 400 });
      }
    }

    await db.insert(feedback).values({
      category: category || 'opinion',
      ...ratings,
      comment: trimmedComment,
      email: !session?.user?.id && email ? email.trim() : '',
      userId: session?.user?.id ? parseInt(session.user.id) : null,
      userAgent: request.headers.get('user-agent') || '',
      language: request.headers.get('accept-language')?.split(',')[0] || '',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Feedback POST Error:', error);
    return NextResponse.json({ error: 'Илгээхэд алдаа гарлаа.' }, { status: 500 });
  }
}
