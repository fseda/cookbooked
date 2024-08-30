import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';
import { dev } from '$app/environment'

export const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

export const db = drizzle(client, { logger: dev });
