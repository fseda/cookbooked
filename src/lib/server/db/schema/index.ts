import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./users";

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

export const recipesRelations = relations(recipes, ({ many }) => ({
  bookmarks: many(bookmarks),
  ratings: many(ratings),
  tags: many(tags),
}));

export const ratings = sqliteTable('ratings', {
  userId: integer('user_id').references(() => users.id).notNull(),
  recipeId: integer('recipe_id').references(() => recipes.id).notNull(),
  rating: real('rating').notNull(),
  ...timestamps(),
}, ratings => ({
  pk: primaryKey({ columns: [ratings.userId, ratings.recipeId]}),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ratings.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
}));

export const bookmarks = sqliteTable('bookmarks', {
  recipeId: integer('recipe_id').references(() => recipes.id),
  userId: text('user_id').references(() => users.id),
  ...timestamps(),
}, bookmarks => {
  return {
    pk: primaryKey({ columns: [bookmarks.userId, bookmarks.recipeId] }),
  }
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  recipe: one(recipes, {
    fields: [bookmarks.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const tags = sqliteTable('tags', {
  recipeId: integer('recipe_id').references(() => recipes.id),
  name: text('name'),
  ...timestamps(),
}, tags => ({
  pk: primaryKey({ columns: [tags.recipeId, tags.name]}),
}));

export const tagsRelations = relations(tags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [tags.recipeId],
    references: [recipes.id],
  })
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
