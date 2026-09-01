/**
 * 피드백 허브 어댑터 공용 유틸
 * 스펙: bloomingheart_next/docs/feedback-hub-스펙.md §2, §3
 *
 * 코리아몽골은 feedback(4문항 평점) 테이블과 inbox(문의/제보) 테이블 2개를
 * 표준 shape 하나로 병합해 내보낸다. id 충돌 방지를 위해 "fb-<id>"/"in-<id>" 접두사 사용.
 */
import { NextResponse } from 'next/server';

export const HUB_SITE = 'koreamongol';

export const HUB_STATUSES = ['pending', 'reviewing', 'planned', 'completed', 'declined', 'deleted'];
export const HUB_CATEGORIES = ['feature_request', 'improvement', 'bug_report', 'other', 'rating'];
export const HUB_PRIORITIES = ['low', 'medium', 'high'];

/** Authorization: Bearer <FEEDBACK_HUB_TOKEN> 검증. 통과 시 null, 실패 시 에러 응답 */
export function checkHubAuth(request) {
  const token = process.env.FEEDBACK_HUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'not_configured' }, { status: 501 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const provided = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!provided || provided !== token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return null;
}

// feedback.status: 자유 varchar(20), 사이트 자체 상태 관리 UI 없음(항상 'pending'만 실사용).
// 제약 컬럼이 아니므로 표준 status 문자열을 그대로 저장/조회한다(라운드트립 보장).
export function feedbackStatusToHub(status) {
  return HUB_STATUSES.includes(status) ? status : 'pending';
}
export function feedbackStatusFromHub(status) {
  return status;
}

// inbox.status: pending/reviewing/resolved/deleted (INBOX_STATUSES). resolved만 표준값과 다름.
const INBOX_STATUS_TO_HUB = { resolved: 'completed' };
const HUB_STATUS_TO_INBOX = { completed: 'resolved' };

export function inboxStatusToHub(status) {
  if (INBOX_STATUS_TO_HUB[status]) return INBOX_STATUS_TO_HUB[status];
  return HUB_STATUSES.includes(status) ? status : 'pending';
}
// planned/declined은 이 테이블에 대응 값이 없어 표준 문자열을 그대로 저장한다(컬럼 제약 없음).
export function inboxStatusFromHub(status) {
  return HUB_STATUS_TO_INBOX[status] || status;
}

/** feedback 행(leftJoin users → row.author.nickname) → 표준 필드 shape */
export function feedbackToHubItem(row) {
  const ratingValues = [row.ratingUseful, row.ratingTrust, row.ratingEasy, row.ratingRecommend].filter(
    (v) => v != null
  );
  const rating = ratingValues.length
    ? Math.round(ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length)
    : null;

  const comment = (row.comment || '').trim();
  const title = comment
    ? comment.split('\n')[0].slice(0, 100)
    : rating != null
      ? `별점 ${rating}/5`
      : '(제목 없음)';

  return {
    id: `fb-${row.id}`,
    category: 'rating',
    status: feedbackStatusToHub(row.status),
    previousStatus: null, // feedback 테이블에 previousStatus 컬럼 없음 — 휴지통 복원 백업 미지원(스펙 §3.3 일부 미준수)
    priority: 'medium', // feedback 테이블에 priority 컬럼 없음
    title,
    content: row.comment || '',
    rating,
    feature: null,
    pageUrl: null,
    source: null,
    locale: row.language || null,
    guestEmail: row.email || null,
    authorId: row.userId ?? null,
    authorName: row.author?.nickname || null,
    userAgent: row.userAgent || null,
    ipAddress: null,
    country: null,
    city: null,
    viewport: null,
    referrer: null,
    attachments: [],
    extra: {
      type: row.category, // 'opinion' | 'bug' | 'improvement'
      ratingUseful: row.ratingUseful,
      ratingTrust: row.ratingTrust,
      ratingEasy: row.ratingEasy,
      ratingRecommend: row.ratingRecommend,
    },
    adminNote: row.adminNote || null,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

/** inbox 행(leftJoin users → row.user.nickname) → 표준 필드 shape */
export function inboxToHubItem(row) {
  return {
    id: `in-${row.id}`,
    category: 'other',
    status: inboxStatusToHub(row.status),
    previousStatus: row.previousStatus || null,
    priority: HUB_PRIORITIES.includes(row.priority) ? row.priority : 'medium',
    title: row.subject,
    content: row.content,
    rating: null,
    feature: null,
    pageUrl: row.pageUrl || row.currentUrl || null,
    source: null,
    locale: row.language || null,
    guestEmail: row.email || null,
    authorId: row.userId ?? null,
    authorName: row.user?.nickname || null,
    userAgent: row.userAgent || null,
    ipAddress: row.ipAddress || null,
    country: null,
    city: null,
    viewport: row.viewportSize || null,
    referrer: row.referrer || null,
    attachments: [],
    extra: {
      type: row.type, // 'inquiry' | 'report' | 'question'
      category: row.category || null, // inquiry 하위분류: general/improvement/bug/other
      sectionId: row.sectionId || null,
      sectionTitle: row.sectionTitle || null,
      currentUrl: row.currentUrl || null,
      screenSize: row.screenSize || null,
      timezone: row.timezone || null,
    },
    adminNote: row.adminNote || null,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}
