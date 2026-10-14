// app/api/channels/[handle]/route.ts
import { NextResponse } from "next/server";
import { store } from "@/server/store";

// GET /api/channels/:handle - public channel info
export async function GET(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const channelId = store.channelsByHandle.get(handle);
  if (!channelId) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  const channel = store.channels.get(channelId);
  const subscriberCount = store.subscriptions.filter((s) => s.channelId === channelId).length;
  return NextResponse.json({ ...channel, subscriberCount });
}
