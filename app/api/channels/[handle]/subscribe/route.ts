// app/api/channels/[handle]/subscribe/route.ts
import { NextResponse } from "next/server";
import { getSessionUserId, getSessionUser } from "@/lib/session";
import { store, newId } from "@/server/store";

// POST - subscribe to channel
export async function POST(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channelId = store.channelsByHandle.get(handle);
  if (!channelId) return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  const channel = store.channels.get(channelId)!;

  // Upsert subscription
  const existing = store.subscriptions.find(
    (s) => s.subscriberId === userId && s.channelId === channelId
  );
  if (!existing) {
    const sub = { id: newId(), subscriberId: userId, channelId, createdAt: new Date().toISOString() };
    store.subscriptions.push(sub);

    // Notify channel owner
    const user = await getSessionUser();
    store.notifications.push({
      id: newId(),
      userId: channel.ownerId,
      title: "New subscriber!",
      body: `${user?.name ?? "Someone"} subscribed to your channel.`,
      link: `/channel/${channel.handle}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

// DELETE - unsubscribe
export async function DELETE(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channelId = store.channelsByHandle.get(handle);
  if (!channelId) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  const idx = store.subscriptions.findIndex(
    (s) => s.subscriberId === userId && s.channelId === channelId
  );
  if (idx !== -1) store.subscriptions.splice(idx, 1);

  return NextResponse.json({ ok: true });
}

// GET - check subscription status
export async function GET(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const userId = await getSessionUserId();

  const channelId = store.channelsByHandle.get(handle);
  if (!channelId) return NextResponse.json({ subscribed: false });

  const subscribed = userId
    ? store.subscriptions.some((s) => s.subscriberId === userId && s.channelId === channelId)
    : false;

  return NextResponse.json({ subscribed });
}
