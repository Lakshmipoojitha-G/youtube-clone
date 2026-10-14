// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/channel/:path*",
    "/subscriptions/:path*",
    "/api/:path*",
    // add more protected routes as needed
  ],
};
