// app/api/channels/[handle]/subscribe/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

// POST - subscribe to channel
export async function POST(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channel = await prisma.channel.findUnique({ where: { handle: (await params).handle } });
  if (!channel) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  const sub = await prisma.subscription.upsert({
    where: { subscriberId_channelId: { subscriberId: session.user.id, channelId: channel.id } },
    update: {},
    create: { subscriberId: session.user.id, channelId: channel.id },
  });

  // Create notification for channel owner
  await prisma.notification.create({
    data: {
      userId: channel.ownerId,
      title: "New subscriber!",
      body: `${session.user.name ?? "Someone"} subscribed to your channel.`,
      link: `/channel/${channel.handle}`,
    },
  });

  return NextResponse.json(sub, { status: 201 });
}

// DELETE - unsubscribe
export async function DELETE(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channel = await prisma.channel.findUnique({ where: { handle: (await params).handle } });
  if (!channel) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  await prisma.subscription.deleteMany({
    where: { subscriberId: session.user.id, channelId: channel.id },
  });
  return NextResponse.json({ ok: true });
}
