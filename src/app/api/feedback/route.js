import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, feedback } from '@/lib/db';
import { gte, sql } from 'drizzle-orm';

// POST /api/feedback — 피드백 표준 제출(공개·비로그인 허용). 2026-09-02 표준 모듈 교체.
// 계약서: bloomingheart_next/docs/feedback-hub-스펙.md §4. 검증: category enum / content 또는 rating 필수 /
// title 자동 생성 / content ≤2000. 방어: 허니팟 + 사이트 전체 시간당 총량(DB COUNT).
// IP 분당 제한은 src/middleware.js(쓰기 10회/분)가 담당. 구 4문항 제출은 폐지 — 기존 행은 어댑터가 계속 노출.
const HUB_CATEGORIES = ['feature_request', 'improvement', 'bug_report', 'other', 'rating'];
const HUB_SOURCES = ['quick', 'micro', 'form'];
const MAX_PER_HOUR = 60; // 사이트 전체 시간당 접수 상한 — 서버리스 인스턴스와 무관한 DB 기준
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max).trim() : '');

// 서버 수집 메타 — Vercel 지오 헤더는 배포 환경에서만 존재.
function collectRequestMeta(request) {
  const city = request.headers.get('x-vercel-ip-city') ?? '';
  let decodedCity = city;
  try {
    decodedCity = decodeURIComponent(city);
  } catch {
    // 인코딩 깨진 값은 원문 유지
  }
  const fwd = request.headers.get('x-forwarded-for');
  const ip = fwd ? fwd.split(',')[0].trim() : request.headers.get('x-real-ip') || '';
  return {
    userAgent: str(request.headers.get('user-agent') ?? '', 500) || '',
    ipAddress: str(ip, 50) || null,
    country: str(request.headers.get('x-vercel-ip-country') ?? '', 5) || null,
    city: str(decodedCity, 100) || null,
  };
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Хүсэлт буруу байна.' }, { status: 400 });
    }

    // 허니팟 — 봇이 채우면 저장 없이 성공한 척 응답
    if (str(body.website, 10)) return NextResponse.json({ success: true });

    const category = str(body.category, 30);
    const content = str(body.content, 2000);
    const rating = body.rating;
    const hasRating = Number.isInteger(rating) && rating >= 1 && rating <= 5;

    if (!HUB_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Ангилал буруу байна.' }, { status: 400 });
    }
    if (!content && !hasRating) {
      return NextResponse.json({ error: 'Үнэлгээ эсвэл санал бичнэ үү.' }, { status: 400 });
    }
    if (rating != null && !hasRating) {
      return NextResponse.json({ error: 'Үнэлгээ 1~5 байх ёстой.' }, { status: 400 });
    }

    // title 자동 생성 — 내용 첫 줄(80자) 또는 '별점 n/5' (관리자·허브 표시용, 한국어 고정)
    let title = str(body.title, 100);
    if (!title) {
      const firstLine = content.split('\n')[0].trim();
      title = firstLine
        ? firstLine.length > 80
          ? `${firstLine.slice(0, 80)}…`
          : firstLine
        : `별점 ${rating}/5`;
    }

    const guestEmail = str(body.guestEmail, 255);
    if (guestEmail && !EMAIL_RE.test(guestEmail)) {
      return NextResponse.json({ error: 'И-мэйл хаяг буруу байна.' }, { status: 400 });
    }

    // 사이트 전체 총량 제한 — 폭주(스팸 대량 등록) 시 차단
    const [{ n }] = await db
      .select({ n: sql`count(*)` })
      .from(feedback)
      .where(gte(feedback.createdAt, new Date(Date.now() - 3600_000)));
    if (Number(n) >= MAX_PER_HOUR) {
      return NextResponse.json({ error: 'Түр хүлээгээд дахин оролдоно уу.' }, { status: 429 });
    }

    const pageUrlRaw = str(body.pageUrl, 255);
    const source = str(body.source, 20);
    const session = await auth();

    // extra — 사이트 고유 데이터. 객체만 허용, 직렬화 2000자 초과분은 버린다.
    let extra = null;
    if (body.extra && typeof body.extra === 'object' && !Array.isArray(body.extra)) {
      const json = JSON.stringify(body.extra);
      if (json.length <= 2000) extra = json;
    }

    const meta = collectRequestMeta(request);
    await db.insert(feedback).values({
      category,
      title,
      comment: content,
      rating: hasRating ? rating : null,
      feature: str(body.feature, 50) || null,
      pageUrl: pageUrlRaw.startsWith('/') ? pageUrlRaw.split('?')[0] : null,
      source: HUB_SOURCES.includes(source) ? source : null,
      language: str(body.locale, 20) || request.headers.get('accept-language')?.split(',')[0] || '',
      email: guestEmail,
      userId: session?.user?.id ? parseInt(session.user.id) : null,
      viewport: /^\d{2,5}x\d{2,5}$/.test(str(body.viewport, 12)) ? str(body.viewport, 12) : null,
      referrer: str(body.referrer, 500) || null,
      extra,
      ...meta,
    });

    // 웹훅 알림(Discord 호환) — 실패해도 접수는 성공 처리
    if (process.env.FEEDBACK_WEBHOOK_URL) {
      const lines = [
        `📮 **코리아몽골 새 피드백** [${category}] ${title}`,
        content ? content.slice(0, 500) : null,
        pageUrlRaw ? `📍 ${pageUrlRaw}` : null,
        guestEmail ? `✉️ ${guestEmail}` : null,
      ].filter(Boolean);
      await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: lines.join('\n') }),
      }).catch((e) => console.error('Feedback webhook error:', e.message));
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Feedback POST Error:', error);
    return NextResponse.json({ error: 'Илгээхэд алдаа гарлаа.' }, { status: 500 });
  }
}
