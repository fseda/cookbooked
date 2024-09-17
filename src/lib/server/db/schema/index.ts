import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey().$default(createId),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),

  title: text('title').notNull(),
  description: text('description').default(sql`null`),
  body: text('body').default(sql`null`),
  private: integer('private', { mode: 'boolean' }).default(false).notNull(),
  level: text('level').references(() => levels.id),

  ...timestamps(),
}, recipes => {
  return { 
    userIdNameUnq: unique().on(recipes.userId, recipes.title),
  }
});

export const levels = sqliteTable('levels', {
  id: text('id').primaryKey(),
});

export const ratings = sqliteTable('ratings', {
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  rating: real('rating').notNull(),
  ...timestamps(),
}, ratings => ({
  pk: primaryKey({ columns: [ratings.userId, ratings.recipeId]}),
}));

export const bookmarks = sqliteTable('bookmarks', {
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps(),
}, bookmarks => {
  return {
    pk: primaryKey({ columns: [bookmarks.userId, bookmarks.recipeId] }),
  }
});

export const tags = sqliteTable('tags', {
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  name: text('name'),
  ...timestamps(),
}, tags => ({
  pk: primaryKey({ columns: [tags.recipeId, tags.name]}),
}));

export function timestamps() {
  return {
    createdAt: text('created_at')
      .default(sql`current_timestamp`)
      .notNull(),
    updatedAt: text('updated_at') 
      .default(sql`current_timestamp`)
      .$onUpdate(() => sql`current_timestamp`)
      .notNull(),
  }
}


export const recipesRelations = relations(recipes, ({ one, many }) => ({
  bookmarks: many(bookmarks),
  ratings: many(ratings),
  tags: many(tags),
  level: one(levels, {
    fields: [recipes.level],
    references: [levels.id],
  }),
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
}));

export const levelsRelations = relations(levels, ({ many }) => ({
  recipes: many(recipes),
}))

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

export const tagsRelations = relations(tags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [tags.recipeId],
    references: [recipes.id],
  })
}));
