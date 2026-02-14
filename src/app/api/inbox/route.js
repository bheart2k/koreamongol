import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, inbox, INBOX_TYPES, INBOX_CATEGORIES } from '@/lib/db';

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();
    const {
      type, category, subject, content, email,
      pageUrl, sectionId, sectionTitle,
      currentUrl, referrer, screenSize, viewportSize, language, timezone,
    } = body;

    // 타입 검증
    if (!type || !INBOX_TYPES[type]) {
      return NextResponse.json({ error: 'Төрөл буруу байна.' }, { status: 400 });
    }

    // 필수 필드 검증
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Гарчиг оруулна уу.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Агуулга оруулна уу.' }, { status: 400 });
    }

    if (subject.trim().length > 255) {
      return NextResponse.json({ error: 'Гарчиг 255 тэмдэгтээс хэтрэхгүй байна.' }, { status: 400 });
    }

    if (content.trim().length > 5000) {
      return NextResponse.json({ error: 'Агуулга 5000 тэмдэгтээс хэтрэхгүй байна.' }, { status: 400 });
    }

    // inquiry 카테고리 검증
    if (type === 'inquiry' && category && !INBOX_CATEGORIES[category]) {
      return NextResponse.json({ error: 'Ангилал буруу байна.' }, { status: 400 });
    }

    // 비로그인 시 이메일 검증
    if (!session?.user?.id && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'И-мэйл хаяг буруу байна.' }, { status: 400 });
      }
    }

    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : '';

    const [item] = await db.insert(inbox).values({
      type,
      category: (type === 'inquiry' ? category : '') || '',
      subject: subject.trim(),
      content: content.trim(),
      email: email || '',

      // 제보 전용
      pageUrl: (pageUrl || '').slice(0, 500),
      sectionId: (sectionId || '').slice(0, 100),
      sectionTitle: (sectionTitle || '').slice(0, 200),

      // 세션
      userId: session?.user?.id ? parseInt(session.user.id) : null,

      // 클라이언트
      currentUrl: (currentUrl || '').slice(0, 500),
      referrer: (referrer || '').slice(0, 500),
      userAgent,
      screenSize: (screenSize || '').slice(0, 20),
      viewportSize: (viewportSize || '').slice(0, 20),
      language: (language || '').slice(0, 20),
      timezone: (timezone || '').slice(0, 50),

      // 서버
      ipAddress,
    }).returning();

    return NextResponse.json({ success: true, data: { id: item.id } }, { status: 201 });
  } catch (error) {
    console.error('Inbox POST Error:', error);
    return NextResponse.json({ error: 'Илгээхэд алдаа гарлаа.' }, { status: 500 });
  }
}
