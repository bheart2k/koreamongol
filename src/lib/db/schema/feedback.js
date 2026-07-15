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

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('feedback_created_idx').on(table.createdAt),
  index('feedback_category_created_idx').on(table.category, table.createdAt),
]);
