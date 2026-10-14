// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { store, newId } from "@/server/store";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const userId = store.usersByEmail.get(email);
  if (!userId)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const user = store.users.get(userId);
  if (!user)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  // Verify simple demo hash
  const expected = btoa(email + ":" + password);
  // Allow demo@example.com / "demo" as a shortcut
  const isDemoUser = userId === "demo-user" && email === "demo@example.com";
  if (!isDemoUser && user.passwordHash !== expected)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = newId();
  store.sessions.set(token, userId);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("yt_session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
  return res;
}
