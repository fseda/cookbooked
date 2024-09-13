import { db } from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { User } from "lucia";
import { recipes } from "../db/schema";

export type Recipe = typeof recipes.$inferSelect;
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

export function getRecipesByUserId(userId: string): Promise<Recipe[] | undefined> {
  return db.query.recipes.findMany({
    where: eq(recipes.userId, userId),
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

