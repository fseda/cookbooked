export function isSignedIn(locals: App.Locals): boolean {
	return !!locals.session && !!locals.user;
}
