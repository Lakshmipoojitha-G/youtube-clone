// app/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export const metadata = {
  title: "MyTube – Home",
  description: "Watch and share videos",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-4 py-6">
      {/* Hero for guests */}
      {!session && (
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 90 20" className="h-14 w-auto" aria-label="MyTube">
              <path fill="#FF0000" d="M25.9 3.3A3.26 3.26 0 0 0 23.6.9C21.5.4 13.6.4 13.6.4S5.7.4 3.6.9A3.26 3.26 0 0 0 1.3 3.3C.8 5.4.8 9.8.8 9.8s0 4.4.5 6.5a3.26 3.26 0 0 0 2.3 2.4c2.1.5 10 .5 10 .5s7.9 0 10-.5a3.26 3.26 0 0 0 2.3-2.4c.5-2.1.5-6.5.5-6.5s0-4.4-.5-6.5z"/>
              <polygon fill="#fff" points="11,6.5 17.2,9.8 11,13.1"/>
              <text x="30" y="15" fontSize="13" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">MyTube</text>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3">Watch. Upload. Share.</h1>
          <p className="text-gray-400 text-lg mb-8">Your personal video platform built with Next.js and PostgreSQL.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/signin"
              id="hero-signin"
              className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              id="hero-register"
              className="rounded-full border border-gray-600 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Placeholder feed (Member 4 will fill this with real videos) */}
      {session && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recommended</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-gray-900 border border-gray-800 animate-pulse">
                <div className="aspect-video bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 text-sm">Video feed will be populated by the team (Members 2–4).</p>
        </div>
      )}
    </div>
  );
}
