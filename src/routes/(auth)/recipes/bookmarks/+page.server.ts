import { isSignedIn } from '$lib/server/auth/index.js';
import { getBookmarksByUser } from '$lib/server/data/recipes.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const isUserSignedIn = isSignedIn(locals);
  if (!isUserSignedIn) {
    return error(401);
  }

  const recipes = await getBookmarksByUser(locals.user!.id);  
  
  return {
    recipes,
  };
}

