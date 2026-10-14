"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/types/video";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?videoId=${videoId}`)
      .then((r) => r.json())
      .then((d) => {
        setComments(d.comments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [videoId]);

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) =>
    comments.filter((c) => c.parentId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>
      <CommentForm videoId={videoId} onCreated={(c) => setComments((p) => [c, ...p])} />
      {loading ? (
        <div className="py-8 text-center text-sm text-neutral-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-neutral-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {topLevel.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={repliesOf(c.id)}
              videoId={videoId}
              onCreated={(n) => setComments((p) => [n, ...p])}
              onDeleted={(id) => setComments((p) => p.filter((x) => x.id !== id && x.parentId !== id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
