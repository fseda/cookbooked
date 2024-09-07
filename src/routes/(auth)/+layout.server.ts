import { isSignedIn } from '$lib/server/auth/index.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!isSignedIn(locals)) {
    return redirect(303, '/auth');
  }

  return {
    user: locals.user,
  }
}