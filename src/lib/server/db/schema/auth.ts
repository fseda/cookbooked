import dayjs from "dayjs";
import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
// import { timestamps } from "./index";
import { users } from "./users";

export const oauthAccounts = sqliteTable('oauth_accounts', {
  provider_id: text('provider_id').notNull().references(() => oauthProviders.id),
  provider_user_id: text('provider_user_id').notNull(),
  user_id: text('user_id ').notNull().references(() => users.id),
}, oauth => ({
  pk: primaryKey({ columns: [oauth.provider_id, oauth.provider_user_id] }),
}));

export const oauthProviders = sqliteTable('oauth_providers', {
  id: text('id').primaryKey(),
  active: integer('active', { mode: 'boolean' }).notNull().default(false),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  IpAddress: text('ip_address'),
  signinAt: integer('signin_at', { mode: 'timestamp' }).default(sql`current_timestamp`).notNull(),
  signoutAt: integer('signout_at', { mode: 'timestamp' }).default(sql`null`),
  expiresAt: integer('expires_at').notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  })
}));

export const accessTokens = sqliteTable('access_tokens', {
  token: text('token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  active: integer('active', { mode: 'boolean' }).default(true).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
    .default(dayjs(new Date()).add(24, 'hours').toDate()),
  ...timestamps(),
});

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

