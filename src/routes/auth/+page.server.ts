import { lucia } from '$lib/server/auth/lucia/index.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  signout: async ({ cookies, locals }) => {
    Promise.all([
      lucia.invalidateSession(locals.session?.id || ''),
    ]).then(() => {
      cookies.delete(lucia.sessionCookieName, { path: '/' });
      redirect(303, '/auth');
    }).catch(e => {
      console.log(e);
    });
  },
}