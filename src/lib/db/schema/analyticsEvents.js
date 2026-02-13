import { pgTable, serial, varchar, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),

  // 이벤트 정보
  event: varchar('event', { length: 50 }).notNull(),
  category: varchar('category', { length: 20 }).default('engagement'),

  // 이벤트별 추가 데이터
  label: varchar('label', { length: 255 }).default(''),
  value: integer('value').default(1),
  metadata: jsonb('metadata').default({}),

  // 시간 정보 (집계 쿼리용)
  date: varchar('date', { length: 10 }).notNull(), // 'YYYY-MM-DD'
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  day: integer('day').notNull(),
  hour: integer('hour').notNull(),
  dayOfWeek: integer('day_of_week').notNull(),

  // 사용자 정보
  userId: integer('user_id'),
  sessionId: varchar('session_id', { length: 255 }),

  // 요청 정보
  userAgent: text('user_agent').default(''),
  locale: varchar('locale', { length: 10 }).default('ko'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('analytics_date_event_idx').on(table.date, table.event),
  index('analytics_event_created_idx').on(table.event, table.createdAt),
  index('analytics_year_month_idx').on(table.year, table.month),
  index('analytics_category_idx').on(table.category),
]);
