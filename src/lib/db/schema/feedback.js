import { pgTable, serial, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),

  // 작성자 (로그인 시)
  authorId: integer('author_id').references(() => users.id),

  // 이메일 (비로그인)
  guestEmail: varchar('guest_email', { length: 255 }).default(''),

  // 피드백 내용
  category: varchar('category', { length: 30 }).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),

  // 관리자 필드
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  previousStatus: varchar('previous_status', { length: 20 }).default(''),
  priority: varchar('priority', { length: 10 }).notNull().default('medium'),
  adminNote: text('admin_note').default(''),

  // 메타
  userAgent: text('user_agent').default(''),
  ipAddress: varchar('ip_address', { length: 50 }).default(''),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('feedback_status_created_idx').on(table.status, table.createdAt),
  index('feedback_category_status_idx').on(table.category, table.status),
  index('feedback_priority_status_idx').on(table.priority, table.status),
]);
