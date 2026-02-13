import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const counters = pgTable('counters', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 100 }).notNull().unique(),
  count: integer('count').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
