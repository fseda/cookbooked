import { isSignedIn } from '$lib/server/auth/index.js';
import { canEdit, createRecipe, deleteRecipe, getRecipeById, type NewRecipe } from '$lib/server/data/recipes.js';
import { error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export async function load({ locals, params }) {
  if (!isSignedIn(locals)) {
    return redirect(303, '/auth');
  }

  if (params.id) {
    const recipe = await getRecipeById(params.id);
    if (!recipe) {
      return error(404);
    }

    if (recipe.private && recipe.userId != locals.user!.id) {
      return error(404);
    }
  
    return {
      recipe,
    };
  }

  return {
    recipe: {} as NewRecipe,
  };
}

const createSchema = z.object({
  name: z.string().max(150),
  description: z.string().max(255).nullable(),
  body: z.string().nullable(),
  private: z.boolean(),
  level: z.string(),
});

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
