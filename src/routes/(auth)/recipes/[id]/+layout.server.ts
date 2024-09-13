import { type Recipe, getRecipeById, isOwner, isPublicDomain } from "$lib/server/data/recipes";
import { error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createSchema } from "../schema";

export async function load({ locals, params }) {
  let recipe: Recipe | undefined = {} as Recipe;
  recipe = await getRecipeById(params.id);
  if (!recipe) {
    return error(404);
  }

  if (recipe.private && !isOwner(recipe, locals.user)) {
    return error(404);
  }

  if (!isOwner(recipe, locals.user) || isPublicDomain(recipe)) {
    error(403);
  }

  return {
    form: await superValidate(recipe, zod(createSchema)),
    ownerId: recipe.userId,
  }
}