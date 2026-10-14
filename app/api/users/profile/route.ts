// app/api/users/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

// GET /api/users/profile - get own profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { name: true, email: true, image: true } } },
  });
  return NextResponse.json(profile);
}

// PATCH /api/users/profile - update profile
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { bio, website, location, name } = body;

  // upsert profile
  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { bio, website, location },
    create: { userId: session.user.id, bio, website, location },
  });

  // also update user name if provided
  if (name) {
    await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  }

  return NextResponse.json(profile);
}
