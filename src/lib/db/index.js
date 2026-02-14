/**
 * DB 연결 및 스키마 통합 Export
 *
 * 사용법:
 * import { db, users, posts } from '@/lib/db';
 */

// DB 인스턴스
export { db } from './connection.js';

// 스키마 (테이블)
export { users } from './schema/users.js';
export { posts } from './schema/posts.js';
export { comments } from './schema/comments.js';
export { badges } from './schema/badges.js';
export { points } from './schema/points.js';
export { inbox } from './schema/inbox.js';
export { analyticsEvents } from './schema/analyticsEvents.js';
export { dailyStats } from './schema/dailyStats.js';
export { counters } from './schema/counters.js';
export { commentLikes, postLikes } from './schema/likes.js';

// 상수
export {
  POINT_CONFIG,
  LEVEL_CONFIG,
  DEFAULT_BADGES,
  INBOX_TYPES,
  INBOX_CATEGORIES,
  INBOX_STATUSES,
  INBOX_PRIORITIES,
} from './schema/constants.js';

// 헬퍼
export { getTimeFields, getTodayString, getPagination } from './helpers.js';
