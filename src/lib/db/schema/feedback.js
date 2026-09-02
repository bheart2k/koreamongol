import { pgTable, serial, varchar, text, integer, smallint, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

// 사이트 피드백 — 평점 4문항(1~5, 미응답 null) + 유형 + 의견 + 이메일(비로그인 optional)
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),

  // 유형: 'opinion'(의견) | 'bug'(버그) | 'improvement'(개선)
  category: varchar('category', { length: 30 }).notNull().default('opinion'),

  // 평점 (1~5)
  ratingUseful: smallint('rating_useful'),
  ratingTrust: smallint('rating_trust'),
  ratingEasy: smallint('rating_easy'),
  ratingRecommend: smallint('rating_recommend'),

  // 의견
  comment: text('comment').default(''),

  // 회신용
  email: varchar('email', { length: 255 }).default(''),
  userId: integer('user_id').references(() => users.id),

  // 클라이언트
  userAgent: text('user_agent').default(''),
  language: varchar('language', { length: 20 }).default(''),

  // 관리자
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  adminNote: text('admin_note').default(''),

  // 표준 제출 모듈 필드 (2026-09-02, 허브 스펙 §2.2) — 신형 행 전용(title 비어있으면 구형 4문항 행).
  // category 컬럼은 신형 행에서 표준 enum(rating/feature_request/improvement/bug_report/other)을 담는다.
  rating: smallint('rating'),
  title: varchar('title', { length: 100 }).default(''),
  feature: varchar('feature', { length: 50 }),
  pageUrl: varchar('page_url', { length: 255 }),
  source: varchar('source', { length: 20 }),
  viewport: varchar('viewport', { length: 20 }),
  referrer: varchar('referrer', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 50 }),
  country: varchar('country', { length: 5 }),
  city: varchar('city', { length: 100 }),
  extra: text('extra'), // JSON 문자열
  priority: varchar('priority', { length: 10 }).default('medium'),
  previousStatus: varchar('previous_status', { length: 20 }).default(''),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('feedback_created_idx').on(table.createdAt),
  index('feedback_category_created_idx').on(table.category, table.createdAt),
]);
