/**
 * Drizzle ORM 헬퍼 유틸리티
 */
import { sql } from 'drizzle-orm';

/**
 * JSONB 필드 내 숫자 증가 (atomic)
 * 사용: set({ stats: jsonbIncrement(users.stats, 'postsCount', 1) })
 */
export function jsonbIncrement(column, key, amount = 1) {
  return sql`jsonb_set(${column}, ${`{${key}}`}, (COALESCE((${column}->>${ key })::int, 0) + ${amount})::text::jsonb)`;
}

/**
 * JSONB 배열에 요소 추가
 * 사용: set({ badges: jsonbArrayAppend(users.badges, badgeId) })
 */
export function jsonbArrayAppend(column, value) {
  return sql`${column} || ${JSON.stringify([value])}::jsonb`;
}

/**
 * 현재 시간 기준 통계용 필드 생성
 */
export function getTimeFields() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    dayOfWeek: now.getDay(),
  };
}

/**
 * 오늘 날짜 문자열 (YYYY-MM-DD)
 */
export function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 페이지네이션 헬퍼
 */
export function getPagination(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
  return { offset: (p - 1) * l, limit: l, page: p };
}
