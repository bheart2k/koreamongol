import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { posts } from './posts.js';
import { comments } from './comments.js';
import { points } from './points.js';
import { inbox } from './inbox.js';
import { commentLikes, postLikes } from './likes.js';

// Users relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  points: many(points),
  inbox: many(inbox),
  commentLikes: many(commentLikes),
  postLikes: many(postLikes),
}));

// Posts relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// Comments relations
export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'commentReplies',
  }),
  replies: many(comments, {
    relationName: 'commentReplies',
  }),
}));

// Points relations
export const pointsRelations = relations(points, ({ one }) => ({
  user: one(users, {
    fields: [points.userId],
    references: [users.id],
  }),
}));

// Inbox relations
export const inboxRelations = relations(inbox, ({ one }) => ({
  user: one(users, {
    fields: [inbox.userId],
    references: [users.id],
  }),
}));

// CommentLikes relations
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}));

// PostLikes relations
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
}));
