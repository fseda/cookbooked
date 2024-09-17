import { db } from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { User } from "lucia";
import { ratings, recipes } from "../db/schema";
import { bookmarks } from './../db/schema/index';

export type Recipe = typeof recipes.$inferSelect;
export type RecipeComplete = typeof recipes.$inferSelect & {
  ratings: typeof ratings.$inferSelect[],
  bookmarks: typeof bookmarks.$inferSelect[],
}
export type NewRecipe = Omit<typeof recipes.$inferInsert, 'id'>;
export type EditRecipe = typeof recipes.$inferInsert;

export function isPublicDomain(recipe: Recipe): boolean {
  return !recipe.userId;
}

export function isOwner(recipe: Recipe, user?: User | null): boolean {
  return recipe.userId === user?.id;
}

export function getRecipeById(id: string): Promise<Recipe | undefined> {
  return db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      bookmarks: true,
      ratings: true,
      level: true,
      tags: true,
      user: true,
    },
  });
}

export function getRecipeComplete(id: string): Promise<RecipeComplete | undefined> {
  return db.query.recipes.findFirst({
    where: and(eq(recipes.id, id)),
    with: {
      ratings: true,
      bookmarks: true,
    }
  })
}

export function getRecipesByUserId(userId: string): Promise<RecipeComplete[] | undefined> {
 return db.query.recipes.findMany({
    where: eq(recipes.userId, userId),
    with: {
      ratings: true,
      bookmarks: true,
    }
  });
}

export function getPublicRecipesByUserId(userId: string): Promise<RecipeComplete[] | undefined> {
  return db.query.recipes.findMany({
    where: and(eq(recipes.userId, userId), eq(recipes.private, false)),
    with: {
      ratings: true,
      bookmarks: true,
    }
  });
}

export async function createRecipe(recipe: NewRecipe): Promise<Recipe> {
  return (await db.insert(recipes).values({
    ...recipe,
  })
  .returning())[0];
}

export async function editRecipe(recipe: EditRecipe): Promise<Recipe> {
  const { id, userId, ...otherFields } = recipe;

  return (await db.update(recipes).set({
    ...otherFields
  })
  .where(and(
    eq(recipes.id, id!), eq(recipes.userId, userId!)
  ))
  .returning())[0];
}

export async function deleteRecipe(recipeId: string): Promise<number> {
  return (await db.delete(recipes).where(eq(recipes.id, recipeId))).rowsAffected;
}

export async function hasDuplicateTitle(title: string, userId: string): Promise<boolean> {
  return (
    await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.title, title), eq(recipes.userId, userId)))
  ).length > 0;
}

export async function toggleBookmark(recipeId: string, userId: string): Promise<boolean> {
  const bookmarked = await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.recipeId, recipeId), eq(bookmarks.userId, userId)
    ),
  });

  if (bookmarked) {
    await db.delete(bookmarks)
      .where(and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.recipeId, recipeId),
        ),
      );
  } else {
    await db.insert(bookmarks).values({ recipeId, userId });
  }

  return !bookmarked;
}

export async function isBookmarked(recipeId: string, userId: string): Promise<boolean> {
  return !!(await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.recipeId, recipeId), eq(bookmarks.userId, userId)
    ),
  }));
}


