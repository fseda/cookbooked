import { isSignedIn } from '$lib/server/auth/index.js';
import { getRecipeById, isOwner, toggleBookmark } from '$lib/server/data/recipes.js';
import { error } from '@sveltejs/kit';

export const actions = {
  bookmark: async ({ locals, params }) => {
    console.log('bookmark bookmark bookmark bookmark bookmark bookmark bookmark ');
    if (!isSignedIn(locals)) {
      return error(401);
    }

    const recipe = await getRecipeById(params.id);
    if (!recipe) {
      return error(404);
    }

    if (recipe.private && !isOwner(recipe, locals.user)) {
      return error(403);
    }

    const bookmarked = await toggleBookmark(recipe.id, locals.user!.id);

    return {
      bookmarked,
    }
  },
};
