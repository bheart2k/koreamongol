import { pgTable, serial, varchar, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { posts } from './posts.js';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),

  // 게시글 연결
  postId: integer('post_id').notNull().references(() => posts.id),

  // 작성자
  authorId: integer('author_id').notNull().references(() => users.id),

  // 대댓글 (self-reference)
  parentCommentId: integer('parent_comment_id'),
  depth: integer('depth').notNull().default(0), // 0: 댓글, 1: 대댓글

  // 답글 대상 사용자: { _id, nickname }
  replyToUser: jsonb('reply_to_user'),

  // 내용
  content: text('content').notNull(),

  // 카운트
  likeCount: integer('like_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),

  // Soft Delete
  state: varchar('state', { length: 1 }).notNull().default('Y'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('comments_post_created_idx').on(table.postId, table.createdAt),
  index('comments_post_parent_created_idx').on(table.postId, table.parentCommentId, table.createdAt),
  index('comments_author_created_idx').on(table.authorId, table.createdAt),
  index('comments_state_idx').on(table.state),
  index('comments_like_idx').on(table.likeCount),
]);
