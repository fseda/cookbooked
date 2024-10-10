import { isSignedIn } from '$lib/server/auth/index.js';
import { getRecipesByAuthor } from '$lib/server/data/recipes.js';
import { getPublicUser, getUserById, getUserByIdOrUsername } from '$lib/server/data/users.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  const isUserSignedIn = isSignedIn(locals);
  const isMe = ['my', 'me'].includes(params.user.toLocaleLowerCase());
  if (isMe && !isUserSignedIn) {
    return error(401);
  }

  const referencedUser = isMe ? await getUserById(locals.user!.id) : await getUserByIdOrUsername(params.user);
  if (!referencedUser) {
    return error(404, 'User not found');
  }
  const isAuthor = referencedUser.id === locals.user?.id;

  const recipes = await getRecipesByAuthor(referencedUser.id, isAuthor);

  recipes.forEach(r => {
    r.bookmarked = r.bookmarks.some(b => b.userId === locals.user?.id);
    r.bookmarkAmount = r.bookmarks.length;
    r.rating = r.ratings.reduce((acc, cur) => acc + cur.rating, 0);
    r.ratingAmount = r.ratings.length;
  });

  return {
    recipesAuthor: getPublicUser(referencedUser),
    recipes,
    isAuthor,
  };
}

