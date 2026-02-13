import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),

  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  description: varchar('description', { length: 200 }),
  icon: varchar('icon', { length: 50 }),
  image: text('image'),

  // activity, learning, community, special, level
  category: varchar('category', { length: 20 }).default('activity'),

  // { type, count }
  condition: jsonb('condition'),

  rewardPoints: integer('reward_points').notNull().default(30),

  // common, uncommon, rare, epic, legendary
  rarity: varchar('rarity', { length: 20 }).default('common'),

  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0), // 예약어 회피: order -> sort_order

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('badges_category_order_idx').on(table.category, table.sortOrder),
  index('badges_active_idx').on(table.isActive),
]);
