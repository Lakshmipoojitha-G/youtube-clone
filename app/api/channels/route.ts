// app/api/channels/route.ts
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { store, newId } from "@/server/store";

// POST /api/channels - create a channel
export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { handle, title, description } = await req.json();
  if (!handle || !title)
    return NextResponse.json({ error: "handle and title are required" }, { status: 400 });

  if (store.channelsByHandle.has(handle))
    return NextResponse.json({ error: "Handle already taken" }, { status: 409 });

  const id = newId();
  const channel = {
    id,
    handle,
    title,
    description: description ?? "",
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };
  store.channels.set(id, channel);
  store.channelsByHandle.set(handle, id);
  return NextResponse.json(channel, { status: 201 });
}

// GET /api/channels - list own channels
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channels = Array.from(store.channels.values()).filter((c) => c.ownerId === userId);
  return NextResponse.json(channels);
}
