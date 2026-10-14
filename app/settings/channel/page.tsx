"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function CreateChannelPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [handle, setHandle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(async (res) => {
      const me = await res.json();
      if (!me) { router.push("/auth/signin"); return; }
      setUser(me);
      setCheckingAuth(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: handle.toLowerCase().replace(/\s+/g, "-"),
        title,
        description,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Something went wrong");
    } else {
      const ch = await res.json();
      router.push(`/channel/${ch.handle}`);
    }
  }

  if (checkingAuth) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Create your channel</h1>
      <p className="text-gray-400 text-sm mb-6">
        Hi <span className="text-white">{user?.name}</span> — choose a unique handle so people can find you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="ch-title" className="block text-sm text-gray-400 mb-1">Channel name</label>
          <input
            id="ch-title"
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-red-500 focus:outline-none transition"
            placeholder="My Awesome Channel"
          />
        </div>
        <div>
          <label htmlFor="ch-handle" className="block text-sm text-gray-400 mb-1">Handle (@handle)</label>
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <span className="px-3 text-gray-500 text-sm">@</span>
            <input
              id="ch-handle"
              type="text"
              required
              value={handle}
              onChange={e => setHandle(e.target.value)}
              className="flex-1 bg-transparent px-2 py-2 text-white text-sm focus:outline-none"
              placeholder="mychannel"
              pattern="[a-zA-Z0-9_\-]+"
              title="Only letters, numbers, hyphens and underscores"
            />
          </div>
        </div>
        <div>
          <label htmlFor="ch-desc" className="block text-sm text-gray-400 mb-1">Description (optional)</label>
          <textarea
            id="ch-desc"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-red-500 focus:outline-none resize-none transition"
            placeholder="Tell the world about your channel…"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          id="create-channel-btn"
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create channel"}
        </button>
      </form>
    </div>
  );
}
