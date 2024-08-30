import { Lucia, TimeSpan } from "lucia";
import { dev } from "$app/environment";
import { db } from "../db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users } from "../db/schema";
import { env as p_env } from "$env/dynamic/public";
import { env } from '$env/dynamic/private';


const adapter = new DrizzleSQLiteAdapter(db, sessions, users); // your adapter

export const lucia = new Lucia(adapter, {
	getUserAttributes: attributes => ({
		username: attributes.username,
	}),
	sessionExpiresIn: new TimeSpan(Number(env.SESSION_EXPIRATION_DAYS), 'd'),
	sessionCookie: {
		expires: false,
		attributes: {
			sameSite: 'lax',
			secure: !dev,
			domain: p_env.PUBLIC_ORIGIN,
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
}