import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";

type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function createUser(newUser: NewUser): Promise<User>  {
  return (await db.insert(users).values(newUser).returning())[0];
}

export async function getOrCreateUserByEmail(email: string): Promise<User> {
  return await getUserByEmail(email) || await createUser({ email, status: 'active' });
}

