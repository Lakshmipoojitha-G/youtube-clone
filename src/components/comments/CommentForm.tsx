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
    setBusy(true);
    setError("");
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
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="border-b border-gray-300 bg-transparent py-1 outline-none focus:border-black"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-1.5 text-sm hover:bg-gray-100">
            Cancel
          </button>
        )}
        <button disabled={busy || !text.trim()} className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white disabled:bg-gray-300">
          {parentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}
