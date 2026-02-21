import { pgTable, serial, varchar, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const dailyStats = pgTable('daily_stats', {
  id: serial('id').primaryKey(),

  date: varchar('date', { length: 10 }).notNull().unique(), // 'YYYY-MM-DD'

  // 카테고리별 이벤트 수
  toolUsage: jsonb('tool_usage').notNull().default({
    guide: 0,
    social: 0,
    tools: 0,
    community: 0,
  }),

  // 주요 지표
  learning: jsonb('learning').notNull().default({
    guideViews: 0,
    shares: 0,
    exchangeCalc: 0,
    donateClicks: 0,
  }),

  totalEvents: integer('total_events').notNull().default(0),

  // 시간대별 분포 (24개 요소)
  hourlyDistribution: jsonb('hourly_distribution').notNull().default(new Array(24).fill(0)),

  // 카테고리별 분포
  categoryDistribution: jsonb('category_distribution').notNull().default({
    guide: 0,
    social: 0,
    tools: 0,
    community: 0,
    engagement: 0,
  }),

  year: integer('year').notNull(),
  month: integer('month').notNull(),
  dayOfWeek: integer('day_of_week').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('daily_stats_year_month_idx').on(table.year, table.month),
]);
