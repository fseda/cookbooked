import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { oauthAccounts, sessions } from "./auth";
import { bookmarks, ratings } from './index';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$default(createId),
  username: text('username', { length: 100 }).unique(),
  name: text('name', { length: 250 }),
  email: text('email', { length: 250 }).unique().notNull(),
  avatar: blob('avatar', { mode: 'buffer' }),
  bio: text('bio'),

  status: text('status').notNull().references(() => userStatus.id),

  avatar_url: text('avatar_url'),

  ...timestamps(),
});

export const userStatus = sqliteTable('user_status', {
  id: text('id').primaryKey().$type<'active' | 'inactive' | 'suspended'>(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  oauthAccounts: many(oauthAccounts),
  status: one(userStatus, {
    fields: [users.status],
    references: [userStatus.id],
  }),
  ratings: many(ratings),
  bookmarks: many(bookmarks),
}));

export function timestamps() {
  return {
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`current_timestamp`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }) 
      .$onUpdate(() => sql`current_timestamp`)
      .notNull(),
  }
}
