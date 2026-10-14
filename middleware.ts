// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/channel/:path*",
    "/subscriptions",
    "/profile",
    "/settings/:path*",
    "/studio/:path*",
    "/history",
    "/liked",
    "/playlists/:path*",
  ],
};
