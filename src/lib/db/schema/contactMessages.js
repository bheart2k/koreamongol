import { pgTable, serial, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 255 }).default(''),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),

  // pending, read, replied, deleted
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  previousStatus: varchar('previous_status', { length: 20 }).default(''),
  adminNote: text('admin_note').default(''),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('contact_messages_status_created_idx').on(table.status, table.createdAt),
  index('contact_messages_email_idx').on(table.email),
]);
