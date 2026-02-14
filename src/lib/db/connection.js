/**
 * Neon PostgreSQL + Drizzle ORM 연결
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as usersSchema from './schema/users.js';
import * as postsSchema from './schema/posts.js';
import * as commentsSchema from './schema/comments.js';
import * as badgesSchema from './schema/badges.js';
import * as pointsSchema from './schema/points.js';
import * as inboxSchema from './schema/inbox.js';
import * as analyticsEventsSchema from './schema/analyticsEvents.js';
import * as dailyStatsSchema from './schema/dailyStats.js';
import * as countersSchema from './schema/counters.js';
import * as likesSchema from './schema/likes.js';
import * as relationsSchema from './schema/relations.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL 환경 변수를 설정해주세요.');
}

const sql = neon(DATABASE_URL);

export const db = drizzle(sql, {
  schema: {
    ...usersSchema,
    ...postsSchema,
    ...commentsSchema,
    ...badgesSchema,
    ...pointsSchema,
    ...inboxSchema,
    ...analyticsEventsSchema,
    ...dailyStatsSchema,
    ...countersSchema,
    ...likesSchema,
    ...relationsSchema,
  },
});
