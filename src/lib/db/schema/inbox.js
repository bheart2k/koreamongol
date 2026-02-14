import { pgTable, serial, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const inbox = pgTable('inbox', {
  id: serial('id').primaryKey(),

  // 분류
  type: varchar('type', { length: 20 }).notNull(), // 'inquiry' | 'report'
  category: varchar('category', { length: 30 }).default(''), // 'general' | 'improvement' | 'bug' | 'other'

  // 사용자 입력
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  email: varchar('email', { length: 255 }).default(''),

  // 제보 전용
  pageUrl: varchar('page_url', { length: 500 }).default(''),
  sectionId: varchar('section_id', { length: 100 }).default(''),
  sectionTitle: varchar('section_title', { length: 200 }).default(''),

  // 자동: 세션
  userId: integer('user_id').references(() => users.id),

  // 자동: 클라이언트
  currentUrl: varchar('current_url', { length: 500 }).default(''),
  referrer: varchar('referrer', { length: 500 }).default(''),
  userAgent: text('user_agent').default(''),
  screenSize: varchar('screen_size', { length: 20 }).default(''),
  viewportSize: varchar('viewport_size', { length: 20 }).default(''),
  language: varchar('language', { length: 20 }).default(''),
  timezone: varchar('timezone', { length: 50 }).default(''),

  // 자동: 서버
  ipAddress: varchar('ip_address', { length: 50 }).default(''),

  // 관리자
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  previousStatus: varchar('previous_status', { length: 20 }).default(''),
  priority: varchar('priority', { length: 10 }).notNull().default('medium'),
  adminNote: text('admin_note').default(''),

  // 타임스탬프
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('inbox_type_status_created_idx').on(table.type, table.status, table.createdAt),
  index('inbox_status_created_idx').on(table.status, table.createdAt),
  index('inbox_user_id_idx').on(table.userId),
]);
