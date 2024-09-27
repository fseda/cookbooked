import { isSignedIn } from '$lib/server/auth/index.js';
import { deleteRecipe, editRecipe, getRecipeById, isOwner, isPublicDomain, type EditRecipe } from '$lib/server/data/recipes.js';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createSchema } from '../../schema';

export async function load({ locals, parent }) {
  const { recipe } = await parent();

  if (!isOwner(recipe, locals.user) || isPublicDomain(recipe)) {
    return error(403);
  }

  return {
    form: await superValidate(recipe, zod(createSchema)),
  };
}

export const actions = {
  edit: async ({ locals, params, request }) => {
    if (!isSignedIn(locals)) {
      return error(401);
    }

    const form = await superValidate(request, zod(createSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const recipe = await getRecipeById(params.id);
    if (!recipe) {
      return error(404);
    }

    if (!isOwner(recipe, locals.user)) {
      return error(403);
    }

    const eRecipe: EditRecipe = {
      id: params.id,
      userId: locals.user!.id,
      ...form.data,
    };
    
    return {
      recipe: await editRecipe(eRecipe),
      form,
    }
  },

  delete: async ({ locals, params }) => {
    if (!isSignedIn(locals)) {
      return error(401);
    }

    if (!params.id) {
      return error(404);
    }

    const recipe = await getRecipeById(params.id);
    if (!recipe) {
      return error(404);
    }

    if (!isOwner(recipe, locals.user)) {
      return error(403);
    }

    try {
      await deleteRecipe(recipe.id);
    } catch (e: unknown) {
      console.log(e);
      return fail(500);
    }
  },
};
