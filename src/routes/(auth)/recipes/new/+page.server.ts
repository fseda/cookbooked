import { isSignedIn } from "$lib/server/auth";
import { createRecipe, hasDuplicateTitle, type NewRecipe } from "$lib/server/data/recipes";
import { error, redirect } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createRecipeSchema } from "../schema";

export async function load({ locals }) {
  if (!isSignedIn(locals)) {
    return redirect(303, '/auth');
  }

  return {
    form: await superValidate(zod(createRecipeSchema)),
  };
}

export const actions = {
  create: async ({ locals, request }) => {
    if (!isSignedIn(locals)) {
      return error(401);
    }

    const form = await superValidate(request, zod(createRecipeSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    if (await hasDuplicateTitle(form.data.title, locals.user!.id)) {
      return fail(400, { 
        form,
        error: "Duplicate Title",
      });
    }

    const nRecipe: NewRecipe = {
      ...form.data,
      authorId: locals.user!.id,
    };

    const recipe = await createRecipe(nRecipe);

    return {
      recipe,
      form,
    }
  },
};
