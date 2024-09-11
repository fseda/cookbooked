
export async function load({ locals }) {
  // if (!isSignedIn(locals)) {
  //   return redirect(303, '/auth');
  // }

  return {
    user: locals.user,
  }
}