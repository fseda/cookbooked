import { isSignedIn } from '$lib/server/auth/index.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!isSignedIn(locals)) {
    error(401);
  }
}