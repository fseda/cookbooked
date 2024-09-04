import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/server/db/schema/',
  out: './src/lib/server/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  dialect: 'sqlite',
} satisfies Config;
