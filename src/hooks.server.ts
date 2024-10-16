import { env } from "$env/dynamic/private";
import { lucia } from "$lib/server/auth/lucia";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: env.SENTRY_DNS,
	tracesSampleRate: 1,
})

const handleCookies: Handle = async function({ event, resolve }) {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}

export const handle: Handle = sequence(
	Sentry.sentryHandle(),
	handleCookies
);

export const handleError = Sentry.handleErrorWithSentry();