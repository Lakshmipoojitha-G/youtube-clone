// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      // store hashed pw in profile (extend schema as needed for full implementation)
      profile: { create: { bio: hashed } }, // placeholder - use a password field in prod
    },
  });
  return NextResponse.json({ id: user.id }, { status: 201 });
}
