import { db } from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { User } from "lucia";
import { recipes } from "../db/schema";

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

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

export function getRecipesByUserId(userId: string): Promise<Recipe[] | undefined> {
  return db.query.recipes.findMany({
    where: eq(recipes.userId, userId),
  });
}

export async function createRecipe(nRecipe: NewRecipe): Promise<Recipe> {
  return (await db.insert(recipes).values({
    ...nRecipe,
  })
  .onConflictDoUpdate({
    target: recipes.id,
    set: {
      ...nRecipe,
    }
  })
  .returning())[0];
}

export async function deleteRecipe(recipeId: string): Promise<number> {
  return (await db.delete(recipes).where(eq(recipes.id, recipeId))).rowsAffected;
}

export async function hasDuplicateName(name: string, userId: string): Promise<boolean> {
  return (
    await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.title, name), eq(recipes.userId, userId)))
  ).length > 0;
}

export function canEdit(recipe: Recipe, user: User): boolean {
  return recipe.userId === user.id;
}
