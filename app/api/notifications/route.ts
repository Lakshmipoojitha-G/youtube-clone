// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { store } from "@/server/store";

// GET /api/notifications - fetch user's notifications
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = store.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 30);
  return NextResponse.json(notifications);
}

// PATCH /api/notifications - mark all as read
export async function PATCH() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  store.notifications
    .filter((n) => n.userId === userId && !n.read)
    .forEach((n) => { n.read = true; });

  return NextResponse.json({ ok: true });
}
