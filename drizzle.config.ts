import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/server/db/schema/',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    // url: process.env.TURSO_DATABASE_URL!, 
    // authToken: process.env.TURSO_AUTH_TOKEN,
    url: 'file:./local.db',
  },
  dialect: 'sqlite',
} satisfies Config;
