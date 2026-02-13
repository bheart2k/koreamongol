import { pgTable, serial, varchar, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  image: text('image'),

  // 커스텀 프로필
  nickname: varchar('nickname', { length: 20 }),
  bio: varchar('bio', { length: 200 }),

  provider: varchar('provider', { length: 50 }).notNull().default('google'),
  providerId: varchar('provider_id', { length: 255 }).notNull(),

  // 1~10: 개발자, 11~20: 관리자, 21+: 일반 유저
  grade: integer('grade').notNull().default(99),

  lastLoginAt: timestamp('last_login_at').defaultNow(),

  // 포인트/레벨 시스템
  points: integer('points').notNull().default(0),
  totalPoints: integer('total_points').notNull().default(0),
  level: integer('level').notNull().default(1),

  // 배지 (Badge ID 배열)
  badges: jsonb('badges').notNull().default([]),

  // 출석
  consecutiveLogins: integer('consecutive_logins').notNull().default(0),

  // 통계
  stats: jsonb('stats').notNull().default({
    postsCount: 0,
    commentsCount: 0,
    loginDays: 0,
    namesGenerated: 0,
    lessonsCompleted: 0,
  }),

  // 상태: Y(활성), D(탈퇴)
  state: varchar('state', { length: 1 }).notNull().default('Y'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('users_total_points_idx').on(table.totalPoints),
  index('users_level_idx').on(table.level),
  index('users_state_idx').on(table.state),
]);
