import { isSignedIn } from '$lib/server/auth/index.js';
import { getPublicRecipesByUserId, getRecipesByUserId } from '$lib/server/data/recipes.js';
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
  const isOwner = referencedUser.id === locals.user?.id;

  const recipes = isOwner 
    ? await getRecipesByUserId(referencedUser.id) 
    : await getPublicRecipesByUserId(referencedUser.id);
  
  return {
    recipesOwner: getPublicUser(referencedUser),
    recipes,
    isOwner,
  };
}

