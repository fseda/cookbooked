import { lucia } from '$lib/server/auth/lucia/index.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function load() {
  const form = await superValidate(zod(schema));
  return { form };
}

export const actions = {
  signout: async ({ cookies, locals }) => {
    Promise.all([
      lucia.invalidateSession(locals.session?.id || ''),
      // auth.signOut(), // Think this only works in the browser
    ]).then(() => {
      cookies.delete(lucia.sessionCookieName, { path: '/' });
      redirect(303, '/auth');
    }).catch(e => {
      console.log(e);
    });
  },
}