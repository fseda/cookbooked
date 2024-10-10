import { db } from "$lib/server/db";
import { and, eq, inArray } from "drizzle-orm";
import type { User } from "lucia";
import { ratings, recipes } from "../db/schema";
import { users } from "../db/schema/users";
import { bookmarks } from './../db/schema/index';

export type Recipe = typeof recipes.$inferSelect;
export type RecipeComplete = typeof recipes.$inferSelect & {
  ratings: typeof ratings.$inferSelect[],
  bookmarks: typeof bookmarks.$inferSelect[],
  user?: typeof users.$inferSelect | null,
  bookmarked?: boolean,
  bookmarkAmount?: number,
  rating?: number,
  ratingAmount?: number,
  userRating?: number,
}
/*export type RecipeCompleteForRequester = RecipeComplete */ & {
  bookmarked?: boolean | undefined,
  bookmarkAmount?: number,
}
export type NewRecipe = Omit<typeof recipes.$inferInsert, 'id'>;
export type EditRecipe = typeof recipes.$inferInsert;

export function isPublicDomain(recipe: Recipe): boolean {
  return !recipe.authorId;
}

export function isAuthor(recipe: Recipe, user?: User | null): boolean {
  return recipe.authorId === user?.id;
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

export function getRecipes(ids: string[]): Promise<RecipeComplete[]> {
  return db.query.recipes.findMany({
    where: inArray(recipes.id, ids),
    with: {
      bookmarks: true,
      ratings: true,
    },
  });
}

export function getRecipeComplete(id: string): Promise<RecipeComplete | undefined> {
  return db.query.recipes.findFirst({
    where: and(eq(recipes.id, id)),
    with: {
      ratings: true,
      bookmarks: true,
      level: true,
      tags: true,
      user: true,
    }
  })
}

export async function getRecipesByAuthor(authorId: string, includePrivate: boolean = false): Promise<RecipeComplete[]> {
  const rs = await db.query.recipes.findMany({
    where: eq(recipes.authorId, authorId),
    with: {
      ratings: true,
      bookmarks: true,
    }
  }) as RecipeComplete[];

  const filtered = includePrivate ? rs : filterPrivate(rs);

  return filtered;
}

export function getPublicRecipesByAuthor(authorId: string): Promise<RecipeComplete[]> {
  return db.query.recipes.findMany({
    where: and(eq(recipes.authorId, authorId), eq(recipes.private, false)),
    with: {
      ratings: true,
      bookmarks: true,
    },
  });
}

export async function getBookmarksByUser(userId: string): Promise<RecipeComplete[]> {
  const bkmks = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, userId),
  });

  const rs = filterPrivate((await getRecipes(bkmks.map(b => b.recipeId))), userId);

  rs.forEach(r => {
    r.bookmarked = true;
    r.bookmarkAmount = r.bookmarks.length;
    r.rating = r.ratings.reduce((acc, cur) => acc + cur.rating, 0);
    r.ratingAmount = r.ratings.length;
    return r;
  });

  return rs;
}

export async function createRecipe(recipe: NewRecipe): Promise<Recipe> {
  return (await db.insert(recipes).values({
    ...recipe,
  })
  .returning())[0];
}

export async function editRecipe(recipe: EditRecipe): Promise<Recipe> {
  const { id, authorId, ...otherFields } = recipe;

  return (await db.update(recipes).set({
    ...otherFields
  })
  .where(and(
    eq(recipes.id, id!), eq(recipes.authorId, authorId!)
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
      .where(and(eq(recipes.title, title), eq(recipes.authorId, userId)))
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

function filterPrivate<T extends RecipeComplete | Recipe>(recipes: T[], userId?: string): T[] {
  return recipes.filter(recipe => !recipe.private || recipe.authorId === userId);
}
