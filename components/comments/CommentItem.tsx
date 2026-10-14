"use client";

import { useState } from "react";
import type { Comment } from "@/types/video";
import CommentForm from "./CommentForm";

interface Props {
  comment: Comment;
  replies: Comment[];
  videoId: string;
  onCreated: (c: Comment) => void;
  onDeleted: (id: string) => void;
}

export default function CommentItem({ comment, replies, videoId, onCreated, onDeleted }: Props) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);

  async function like() {
    const res = await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setLikes(d.likes);
      setLiked(d.liked);
    }
  }

  async function remove() {
    const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(comment.id);
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow">
        {comment.author[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-400">
          <span className="font-semibold text-white text-sm">@{comment.author}</span>{" "}
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </p>
        <p className="text-sm text-neutral-200 mt-1">{comment.text}</p>
        <div className="mt-2 flex items-center gap-4 text-xs font-medium text-neutral-400">
          <button onClick={like} className={`hover:text-white transition flex items-center gap-1 ${liked ? "text-blue-400 font-semibold" : ""}`}>
            👍 {likes > 0 && likes}
          </button>
          {!comment.parentId && (
            <button onClick={() => setReplying(true)} className="hover:text-white transition">
              Reply
            </button>
          )}
          <button onClick={remove} className="hover:text-red-400 transition">
            Delete
          </button>
        </div>
        {replying && (
          <div className="mt-3 pl-2 border-l border-white/10">
            <CommentForm
              videoId={videoId}
              parentId={comment.id}
              placeholder="Add a reply..."
              onCreated={(c) => {
                onCreated(c);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}
        {replies.length > 0 && (
          <div className="mt-3 pl-4 border-l border-white/10 flex flex-col gap-3">
            {replies.map((r) => (
              <CommentItem key={r.id} comment={r} replies={[]} videoId={videoId} onCreated={onCreated} onDeleted={onDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
