import { lucia } from "$lib/server/auth/lucia";
import { redirect } from "@sveltejs/kit";

export const prerender = false;

export const GET = async ({ cookies, locals }): Promise<void> => {
  Promise.all([
    lucia.invalidateSession(locals.session?.id || ''),
    // auth.signOut(), // Think this only works in the browser
  ]).then(() => {
    cookies.delete(lucia.sessionCookieName, { path: '/' });
    redirect(303, '/auth');
  }).catch(e => {
    console.log(e);
  });

  redirect(303, '/auth');
};