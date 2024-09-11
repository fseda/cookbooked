import { isSignedIn } from '$lib/server/auth/index.js';
import { canEdit, createRecipe, deleteRecipe, getRecipeById, type NewRecipe, type Recipe } from '$lib/server/data/recipes.js';
import { error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createSchema } from './schema.js';

export async function load({ locals, params, url }) {
  let recipe: Recipe | undefined = {} as Recipe;
  if (params.id) {
    recipe = await getRecipeById(params.id);
    if (!recipe) {
      return error(404);
    }

    if (recipe.private && recipe.userId !== locals.user?.id) {
      return error(404);
    }

    if (url.searchParams.get('edit') === 'true' && recipe.userId !== locals.user?.id) {
      error(403);
    }

    return {
      form: await superValidate(recipe, zod(createSchema)),
      ownerId: recipe.userId,
    }
  }

  if (!isSignedIn(locals)) {
    return redirect(303, `/auth`);
  }

  return {
    form: await superValidate(zod(createSchema)),
  };
}

export const actions = {
  create: async ({ locals, params, request }) => {
    if (!isSignedIn(locals)) {
      return error(401);
    }

    const form = await superValidate(request, zod(createSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    if (params.id) {
      const recipe = await getRecipeById(params.id);
      if (!recipe) {
        return error(404);
      }

      if (recipe.userId !== locals.user!.id) {
        return error(403);
      }
    }

    const nRecipe: NewRecipe = {
      id: params.id,
      userId: locals.user!.id,
      ...form.data,
    };
    const recipe = await createRecipe(nRecipe);
    
    return {
      recipe,
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

    if (!canEdit(recipe, locals.user!)) {
      return error(403);
    }

    await deleteRecipe(recipe.id);
  },
};
