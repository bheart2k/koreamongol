import { pgTable, serial, integer, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { comments } from './comments.js';
import { posts } from './posts.js';

export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  commentId: integer('comment_id').notNull().references(() => comments.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('comment_likes_user_comment_idx').on(table.userId, table.commentId),
  index('comment_likes_comment_idx').on(table.commentId),
  index('comment_likes_user_idx').on(table.userId),
]);

export const postLikes = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('post_likes_user_post_idx').on(table.userId, table.postId),
  index('post_likes_post_idx').on(table.postId),
  index('post_likes_user_idx').on(table.userId),
]);
