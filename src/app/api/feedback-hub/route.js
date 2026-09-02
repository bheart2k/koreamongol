import { NextResponse } from 'next/server';
import { eq, ne, and, gte, desc, getTableColumns } from 'drizzle-orm';
import { db, feedback, inbox, users } from '@/lib/db';
import {
  checkHubAuth,
  HUB_SITE,
  HUB_STATUSES,
  HUB_CATEGORIES,
  HUB_PRIORITIES,
  feedbackStatusToHub,
  inboxStatusToHub,
  inboxStatusFromHub,
  feedbackToHubItem,
  inboxToHubItem,
  isStandardFeedbackRow,
} from '@/lib/feedbackHub';

// 피드백 허브 어댑터: 목록 + 통계 (스펙 §3.2)
// feedback(4문항 평점) + inbox(문의/제보) 두 테이블을 표준 shape 하나로 병합해 내보낸다.
export async function GET(request) {
  const authError = checkHubAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10) || 50));
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const since = searchParams.get('since');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let sinceDate = null;
    if (since) {
      const d = new Date(since);
      if (!Number.isNaN(d.getTime())) sinceDate = d;
    }

    // inbox는 항상 category 'other'. feedback은 신형(표준 모듈) 행이 5개 카테고리 전부 가능(2026-09-02),
    // 구형 4문항 행은 'rating' — 신/구 판별이 행 단위(title)라 category 필터는 아래에서 JS로 적용한다.
    const wantFeedback = !category || HUB_CATEGORIES.includes(category);
    const wantInbox = !category || category === 'other';

    const feedbackConditions = [];
    if (status) {
      feedbackConditions.push(eq(feedback.status, status)); // 컬럼이 표준값을 그대로 저장(라운드트립)
    } else if (!includeDeleted) {
      feedbackConditions.push(ne(feedback.status, 'deleted'));
    }
    if (sinceDate) feedbackConditions.push(gte(feedback.createdAt, sinceDate));
    const feedbackWhere = feedbackConditions.length > 1 ? and(...feedbackConditions) : feedbackConditions[0];

    const inboxConditions = [];
    if (status) {
      inboxConditions.push(eq(inbox.status, inboxStatusFromHub(status)));
    } else if (!includeDeleted) {
      inboxConditions.push(ne(inbox.status, 'deleted'));
    }
    if (sinceDate) inboxConditions.push(gte(inbox.createdAt, sinceDate));
    const inboxWhere = inboxConditions.length > 1 ? and(...inboxConditions) : inboxConditions[0];

    // 목록(필터 적용) + 통계(필터와 무관, 휴지통 제외 전체 — 스펙 §3.2) 병렬 조회
    const [feedbackRows, inboxRows, feedbackStatsRows, inboxStatsRows] = await Promise.all([
      wantFeedback
        ? db
            .select({ ...getTableColumns(feedback), author: { nickname: users.nickname } })
            .from(feedback)
            .leftJoin(users, eq(feedback.userId, users.id))
            .where(feedbackWhere)
            .orderBy(desc(feedback.createdAt))
        : Promise.resolve([]),
      wantInbox
        ? db
            .select({ ...getTableColumns(inbox), user: { nickname: users.nickname } })
            .from(inbox)
            .leftJoin(users, eq(inbox.userId, users.id))
            .where(inboxWhere)
            .orderBy(desc(inbox.createdAt))
        : Promise.resolve([]),
      db
        .select({
          ratingUseful: feedback.ratingUseful,
          ratingTrust: feedback.ratingTrust,
          ratingEasy: feedback.ratingEasy,
          ratingRecommend: feedback.ratingRecommend,
          status: feedback.status,
          category: feedback.category,
          title: feedback.title,
          rating: feedback.rating,
          priority: feedback.priority,
        })
        .from(feedback)
        .where(ne(feedback.status, 'deleted')),
      db
        .select({ status: inbox.status, priority: inbox.priority })
        .from(inbox)
        .where(ne(inbox.status, 'deleted')),
    ]);

    // 병합 정렬 + 페이지네이션 (개인 운영 규모 — 전체 조회 후 JS에서 병합/페이징)
    // category 필터는 행 단위 판별(신형=표준 컬럼/구형=rating)이라 변환 후 JS에서 적용
    let items = [...feedbackRows.map(feedbackToHubItem), ...inboxRows.map(inboxToHubItem)].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (category) items = items.filter((item) => item.category === category);
    const total = items.length;
    const paged = items.slice((page - 1) * limit, (page - 1) * limit + limit);

    // 통계 집계 (byPriority는 미처리 건 pending/reviewing/planned만 — 스펙 §3.2)
    const byStatus = Object.fromEntries(HUB_STATUSES.filter((s) => s !== 'deleted').map((s) => [s, 0]));
    const byCategory = Object.fromEntries(HUB_CATEGORIES.map((c) => [c, 0]));
    const byPriority = Object.fromEntries(HUB_PRIORITIES.map((p) => [p, 0]));
    const inProgress = new Set(['pending', 'reviewing', 'planned']);

    let ratingSum = 0;
    let ratingCount = 0;
    for (const row of feedbackStatsRows) {
      const s = feedbackStatusToHub(row.status);
      byStatus[s] = (byStatus[s] || 0) + 1;

      // 신형(표준 모듈) 행은 저장된 category/rating/priority, 구형 4문항 행은 'rating'+평균 별점
      const standard = isStandardFeedbackRow(row);
      const cat = standard && HUB_CATEGORIES.includes(row.category) ? row.category : standard ? 'other' : 'rating';
      byCategory[cat] += 1;
      if (inProgress.has(s)) {
        const p = HUB_PRIORITIES.includes(row.priority) ? row.priority : 'medium';
        byPriority[p] += 1;
      }

      if (standard) {
        if (row.rating != null) {
          ratingSum += row.rating;
          ratingCount += 1;
        }
      } else {
        const vals = [row.ratingUseful, row.ratingTrust, row.ratingEasy, row.ratingRecommend].filter(
          (v) => v != null
        );
        if (vals.length) {
          ratingSum += Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          ratingCount += 1;
        }
      }
    }
    for (const row of inboxStatsRows) {
      const s = inboxStatusToHub(row.status);
      byStatus[s] = (byStatus[s] || 0) + 1;
      byCategory.other += 1;
      if (inProgress.has(s)) {
        const p = HUB_PRIORITIES.includes(row.priority) ? row.priority : 'medium';
        byPriority[p] += 1;
      }
    }

    return NextResponse.json({
      protocolVersion: 1,
      site: HUB_SITE,
      items: paged,
      total,
      page,
      limit,
      stats: {
        byStatus,
        byCategory,
        byPriority,
        avgRating: ratingCount ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
        ratingCount,
      },
    });
  } catch (error) {
    console.error('Feedback Hub GET Error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
