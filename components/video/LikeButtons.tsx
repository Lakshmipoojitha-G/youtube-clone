"use client";

import { useState } from "react";
import type { Reaction } from "@/types/video";

interface Props {
  videoId: string;
  likes: number;
  dislikes: number;
  initial: Reaction;
}

export default function LikeButtons({ videoId, likes, dislikes, initial }: Props) {
  const [state, setState] = useState({ likes, dislikes, reaction: initial });

  async function react(kind: "like" | "dislike") {
    const next = state.reaction === kind ? "none" : kind;
    const res = await fetch(`/api/videos/${videoId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction: next }),
    });
    if (res.ok) setState(await res.json());
  }

  const base = "px-4 py-2 text-sm font-medium transition hover:bg-white/10";
  return (
    <div className="inline-flex overflow-hidden rounded-full bg-white/10 text-white">
      <button onClick={() => react("like")} className={`${base} ${state.reaction === "like" ? "bg-blue-600/30 text-blue-400 font-semibold" : ""}`}>
        👍 {state.likes}
      </button>
      <button onClick={() => react("dislike")} className={`${base} border-l border-white/10 ${state.reaction === "dislike" ? "bg-red-600/30 text-red-400 font-semibold" : ""}`}>
        👎 {state.dislikes}
      </button>
    </div>
  );
}
