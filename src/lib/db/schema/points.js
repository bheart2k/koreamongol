import { pgTable, serial, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { POINT_CONFIG } from './constants.js';

export const points = pgTable('points', {
  id: serial('id').primaryKey(),

  // 사용자
  userId: integer('user_id').notNull().references(() => users.id),

  // 포인트 정보
  type: varchar('type', { length: 30 }).notNull(),
  points: integer('points').notNull(),
  description: varchar('description', { length: 200 }),

  // 연관 데이터 (polymorphic)
  relatedType: varchar('related_type', { length: 20 }), // Post, Comment, Badge
  relatedId: integer('related_id'),

  // 잔액 스냅샷
  balanceAfter: integer('balance_after'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('points_user_created_idx').on(table.userId, table.createdAt),
  index('points_user_type_created_idx').on(table.userId, table.type, table.createdAt),
  index('points_created_idx').on(table.createdAt),
]);
