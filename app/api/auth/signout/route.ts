// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { store } from "@/server/store";
import { SESSION_COOKIE } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) store.sessions.delete(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
