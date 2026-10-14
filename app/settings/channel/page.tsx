// app/settings/channel/page.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/atoms/Button";

export default function CreateChannelPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: handle.toLowerCase().replace(/\s+/g, "-"), title, description }),
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

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Create your channel</h1>
      <p className="text-gray-400 text-sm mb-6">Choose a unique handle so people can find you.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="ch-title" className="block text-sm text-gray-400 mb-1">Channel name</label>
          <input
            id="ch-title"
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
            placeholder="My Awesome Channel"
          />
        </div>
        <div>
          <label htmlFor="ch-handle" className="block text-sm text-gray-400 mb-1">Handle (@handle)</label>
          <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
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
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white text-sm focus:border-red-500 focus:outline-none resize-none"
            placeholder="Tell the world about your channel…"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button id="create-channel-btn" type="submit" disabled={loading} className="w-full">
          {loading ? "Creating…" : "Create channel"}
        </Button>
      </form>
    </div>
  );
}
