import type { Cookie } from "lucia";
import { lucia } from "../auth/lucia";
import { getOrCreateUserByEmail } from "./users";

export async function emailSignIn(email: string): Promise<Cookie | undefined> {
  const user = await getOrCreateUserByEmail(email);
  if (user.status !== 'active') {
    return;
  }
  
  const session = await lucia.createSession(user.id, {});
  return lucia.createSessionCookie(session.id);
}
