"use client";

import { useState } from "react";
import type { Comment } from "@/types/video";

interface Props {
  videoId: string;
  parentId?: string;
  placeholder?: string;
  onCreated: (c: Comment) => void;
  onCancel?: () => void;
}

export default function CommentForm({ videoId, parentId, placeholder = "Add a comment...", onCreated, onCancel }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, parentId: parentId ?? null, text }),
      });
      const data = await res.json();
      setBusy(false);
      if (!res.ok) return setError(data.error ?? "Failed to post");
      setText("");
      onCreated(data.comment);
    } catch {
      setBusy(false);
      setError("Network error. Could not post comment.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="border-b border-white/20 bg-transparent py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 mt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-1.5 text-sm font-medium text-neutral-300 hover:bg-white/10 transition">
            Cancel
          </button>
        )}
        <button disabled={busy || !text.trim()} className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-500 transition disabled:opacity-40 disabled:hover:bg-blue-600">
          {parentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}
