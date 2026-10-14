// app/api/users/profile/route.ts
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { store } from "@/server/store";

// GET /api/users/profile - get own profile
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = store.users.get(userId);
  const profile = store.profiles.get(userId);
  return NextResponse.json({
    ...profile,
    userId,
    user: { name: user?.name, email: user?.email, image: user?.image ?? null },
  });
}

// PATCH /api/users/profile - update profile
export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bio, website, location, name } = await req.json();

  const existing = store.profiles.get(userId) ?? { userId, bio: "", website: "", location: "" };
  store.profiles.set(userId, {
    userId,
    bio: bio ?? existing.bio,
    website: website ?? existing.website,
    location: location ?? existing.location,
  });

  if (name) {
    const user = store.users.get(userId);
    if (user) store.users.set(userId, { ...user, name });
  }

  return NextResponse.json(store.profiles.get(userId));
}
