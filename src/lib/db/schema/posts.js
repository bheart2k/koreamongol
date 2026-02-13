import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),

  // 작성자
  authorId: integer('author_id').notNull().references(() => users.id),

  // 게시판 타입: blog, free, notice
  boardType: varchar('board_type', { length: 20 }).notNull(),

  // 게시글 내용
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  summary: varchar('summary', { length: 200 }).default(''),

  // 첨부 이미지: [{ url, alt }]
  images: jsonb('images').notNull().default([]),

  // 태그: ["tag1", "tag2"]
  tags: jsonb('tags').notNull().default([]),

  // 카운트
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),

  // 공지/고정
  isPinned: boolean('is_pinned').notNull().default(false),
  isNotice: boolean('is_notice').notNull().default(false),

  // Soft Delete
  state: varchar('state', { length: 1 }).notNull().default('Y'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('posts_board_created_idx').on(table.boardType, table.createdAt),
  index('posts_board_pinned_created_idx').on(table.boardType, table.isPinned, table.createdAt),
  index('posts_author_created_idx').on(table.authorId, table.createdAt),
  index('posts_state_idx').on(table.state),
  index('posts_like_created_idx').on(table.likeCount, table.createdAt),
]);
