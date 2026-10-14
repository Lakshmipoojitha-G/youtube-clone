// src/components/organisms/Navbar.tsx
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/src/components/atoms/Button";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <Link href="/" className="text-2xl font-bold">
        MyTube
      </Link>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span>{session.user.name}</span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link href="/api/auth/signin" className="underline">
            Sign In
          </Link>
        )}
        <button
          className="text-xl"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          🌙
        </button>
      </div>
    </nav>
  );
}
