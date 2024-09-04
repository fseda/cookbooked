import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';
import { dev } from '$app/environment'
import * as mainSchema from '$lib/server/db/schema';
import * as userSchema from '$lib/server/db/schema/users';
import * as authSchema from '$lib/server/db/schema/auth';

export const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

export const db = drizzle(client, { logger: dev, schema: {
  ...mainSchema,
  ...userSchema,
  ...authSchema,
}});
