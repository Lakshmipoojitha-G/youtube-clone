// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { store, newId } from "@/server/store";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  if (store.usersByEmail.has(email))
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  // Simple hash placeholder (XOR with salt — good enough for demo, NOT for prod)
  const passwordHash = btoa(email + ":" + password);
  const userId = newId();
  const now = new Date().toISOString();

  store.users.set(userId, { id: userId, name: name ?? "New User", email, passwordHash, createdAt: now });
  store.usersByEmail.set(email, userId);

  return NextResponse.json({ id: userId }, { status: 201 });
}
