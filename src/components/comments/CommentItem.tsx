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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-black">
        {comment.author[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">@{comment.author}</span>{" "}
          <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
        </p>
        <p className="text-sm">{comment.text}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
          <button onClick={like} className={liked ? "text-blue-600" : ""}>👍 {likes}</button>
          {!comment.parentId && <button onClick={() => setReplying(true)}>Reply</button>}
          <button onClick={remove}>Delete</button>
        </div>
        {replying && (
          <div className="mt-2">
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
          <div className="mt-3 flex flex-col gap-3">
            {replies.map((r) => (
              <CommentItem key={r.id} comment={r} replies={[]} videoId={videoId} onCreated={onCreated} onDeleted={onDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
