// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null);
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
  });
}
