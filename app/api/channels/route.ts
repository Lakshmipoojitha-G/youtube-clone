// app/api/channels/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/src/lib/prisma";

// POST /api/channels - create a channel
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { handle, title, description } = await req.json();
  if (!handle || !title) return NextResponse.json({ error: "handle and title are required" }, { status: 400 });

  const exists = await prisma.channel.findUnique({ where: { handle } });
  if (exists) return NextResponse.json({ error: "Handle already taken" }, { status: 409 });

  const channel = await prisma.channel.create({
    data: { handle, title, description, ownerId: session.user.id },
  });
  return NextResponse.json(channel, { status: 201 });
}

// GET /api/channels - list own channels
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channels = await prisma.channel.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(channels);
}
