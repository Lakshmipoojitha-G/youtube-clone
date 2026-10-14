// app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 90 20" className="h-7 w-auto fill-white" aria-label="MyTube">
            <path fill="#FF0000" d="M25.9 3.3A3.26 3.26 0 0 0 23.6.9C21.5.4 13.6.4 13.6.4S5.7.4 3.6.9A3.26 3.26 0 0 0 1.3 3.3C.8 5.4.8 9.8.8 9.8s0 4.4.5 6.5a3.26 3.26 0 0 0 2.3 2.4c2.1.5 10 .5 10 .5s7.9 0 10-.5a3.26 3.26 0 0 0 2.3-2.4c.5-2.1.5-6.5.5-6.5s0-4.4-.5-6.5z"/>
            <polygon fill="#fff" points="11,6.5 17.2,9.8 11,13.1"/>
            <text x="30" y="15" fontSize="13" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">MyTube</text>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              placeholder="min 8 characters"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-red-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
