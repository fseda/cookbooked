import { isSignedIn } from '$lib/server/auth/index.js';
import { getRecipeById, isAuthor, toggleBookmark } from '$lib/server/data/recipes.js';
import { error, fail } from '@sveltejs/kit';

export const actions = {
  bookmark: async ({ locals, params, request }) => {
    if (!isSignedIn(locals)) {
      return fail(401, {
        message: 'You need to be signed in to bookmark.',
      });
    }

    const formData = await request.formData();
    const id = (formData.get('id')?.valueOf() as string | undefined) || params.id;

    const recipe = await getRecipeById(id);
    if (!recipe) {
      return error(404);
    }

    if (recipe.private && !isAuthor(recipe, locals.user)) {
      return error(403);
    }

    const bookmarked = await toggleBookmark(recipe.id, locals.user!.id);

    return {
      bookmarked,
    }
  },
};
