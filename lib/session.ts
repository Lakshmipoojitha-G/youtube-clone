/**
 * lib/session.ts
 * Lightweight mock-auth session helper (no Prisma / NextAuth required).
 * Uses a cookie "yt_session" that maps to a userId in the in-memory store.
 */
import { cookies } from "next/headers";
import { store } from "@/server/store";

export const SESSION_COOKIE = "yt_session";

/** Returns the userId for the current request, or null if not signed in. */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = store.sessions.get(token);
  return userId ?? null;
}

/** Returns the full User object for the current request, or null. */
export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return store.users.get(userId) ?? null;
}
