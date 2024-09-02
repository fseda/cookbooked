import { dev } from "$app/environment";
import { env } from '$env/dynamic/private';
import { env as p_env } from "$env/dynamic/public";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { db } from "../../db";
import { sessions } from '../../db/schema/auth';
import { users } from '../../db/schema/users';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	getUserAttributes: attributes => ({
		username: attributes.username,
		email: attributes.email,
	}),
	sessionExpiresIn: new TimeSpan(Number(env.SESSION_EXPIRATION_DAYS), 'd'),
	sessionCookie: {
		expires: false,
		attributes: {
			sameSite: 'lax',
			secure: !dev,
			domain: p_env.PUBLIC_ORIGIN,
			path: '/',
		}
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	email: string;
}
