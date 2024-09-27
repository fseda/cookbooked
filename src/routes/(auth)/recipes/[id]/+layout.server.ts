import { isSignedIn } from '$lib/server/auth/index.js';
import { getRecipeComplete, isBookmarked, isOwner } from "$lib/server/data/recipes";
import { error } from "@sveltejs/kit";

export async function load({ locals, params }) {
  const recipe = await getRecipeComplete(params.id);
  if (!recipe) {
    return error(404);
  }

  if (recipe.private && !isOwner(recipe, locals.user)) {
    return error(404);
  }

  return {
    ownerId: recipe.userId,
    recipe,
    bookmarked: isSignedIn(locals) ? await isBookmarked(recipe.id, locals.user!.id) : false,
    yourRating: recipe.ratings.find(r => r.userId === locals.user!.id)?.rating,
  }
}