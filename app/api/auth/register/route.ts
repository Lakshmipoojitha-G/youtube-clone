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

  const user = { id: userId, name: name ?? "New User", email, passwordHash, createdAt: now };
  store.users.set(userId, user);
  store.usersByEmail.set(email, userId);

  const token = newId();
  store.sessions.set(token, userId);

  const res = NextResponse.json({ id: userId, ok: true }, { status: 201 });
  res.cookies.set("yt_session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return res;
}
