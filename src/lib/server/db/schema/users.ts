import { bookmarks, ratings, timestamps } from './index';
import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { oauthAccounts, sessions } from "./auth";
import { createId } from '@paralleldrive/cuid2';

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
