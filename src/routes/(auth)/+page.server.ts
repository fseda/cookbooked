import { isSignedIn } from '$lib/server/auth/index.js';
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
  if (!isSignedIn(locals)) {
    return redirect(303, '/auth');
  }
}