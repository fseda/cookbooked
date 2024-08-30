import { sql } from "drizzle-orm";
import { blob, integer, primaryKey, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username', { length: 100 }).unique(),
  name: text('name', { length: 250 }),
  email: text('email', { length: 250 }).unique().notNull(),
  avatar: blob('avatar', { mode: 'buffer' }),
  bio: text('bio'),

  avatar_url: text('avatar_url'),
  googleId: text('google_id'),

  ...timestamps(),
});

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),

  name: text('name').notNull(),
  description: text('description').default(sql`null`),
  body: text('body').default(sql`null`),

  private: integer('private', { mode: 'boolean' }).default(false),

  ...timestamps(),
}, recipes => {
  return { 
    userIdNameUnq: unique().on(recipes.userId, recipes.name),
  }
});

export const ratings = sqliteTable('ratings', {
  userId: integer('user_id').references(() => users.id).notNull(),
  recipeId: integer('recipe_id').references(() => recipes.id).notNull(),
  rating: real('rating').notNull(),
  ...timestamps(),
}, ratings => ({
  pk: primaryKey({ columns: [ratings.userId, ratings.recipeId]}),
}));

export const bookmarks = sqliteTable('bookmarks', {
  recipeId: integer('recipe_id').references(() => recipes.id),
  userId: integer('user_id').references(() => users.id),
  ...timestamps(),
}, bookmarks => {
  return {
    pk: primaryKey({ columns: [bookmarks.userId, bookmarks.recipeId] }),
  }
});

export const tags = sqliteTable('tags', {
  recipeId: integer('recipe_id').references(() => recipes.id),
  name: text('name'),
  ...timestamps(),
}, tags => ({
  pk: primaryKey({ columns: [tags.recipeId, tags.name]}),
}));

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  IpAddress: text('ip_address'),
  signinAt: integer('signin_at', { mode: 'timestamp' }).default(sql`current_timestamp`).notNull(),
  signoutAt: integer('signout_at', { mode: 'timestamp' }).default(sql`null`),
  expiresAt: integer('expires_at').notNull(),
});

function timestamps() {
  return {
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`current_timestamp`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }) 
      .$onUpdate(() => sql`current_timestamp`)
      .notNull(),
  }
}
