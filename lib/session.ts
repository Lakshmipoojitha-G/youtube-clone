/**
 * lib/session.ts
 * Session helpers backed by NextAuth + Prisma.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/src/lib/prisma";

/** Returns the userId for the current request, or null if not signed in. */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

/** Returns the full User object for the current request, or null. */
export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
