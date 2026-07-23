import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { submitToIndexNow } from '@/lib/indexnow';
import sitemap from '@/app/sitemap';

/**
 * POST /api/indexnow - IndexNow 수동 제출 (관리자 전용)
 *
 * body: { urls: ['/visa', ...] }  특정 URL만 제출
 *       { all: true }             사이트맵 전체 URL 제출
 */
export async function POST(request) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { urls, all } = body;

    let targets = [];
    if (all) {
      const entries = await sitemap();
      targets = entries.map((entry) => entry.url);
    } else if (Array.isArray(urls)) {
      targets = urls;
    }

    if (targets.length === 0) {
      return NextResponse.json({ success: false, error: '제출할 URL이 없습니다.' }, { status: 400 });
    }

    const result = await submitToIndexNow(targets);

    return NextResponse.json({
      success: result.ok,
      submitted: result.submitted,
      total: targets.length,
      status: result.status,
      skipped: result.skipped,
      error: result.error,
    }, { status: result.ok ? 200 : 502 });
  } catch (error) {
    console.error('IndexNow 제출 오류:', error);
    return NextResponse.json({ success: false, error: 'IndexNow 제출 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
