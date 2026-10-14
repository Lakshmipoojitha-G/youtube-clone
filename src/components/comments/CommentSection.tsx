"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/types/video";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch(`/api/comments?videoId=${videoId}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []));
  }, [videoId]);

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) =>
    comments.filter((c) => c.parentId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-xl font-semibold">{comments.length} Comments</h2>
      <CommentForm videoId={videoId} onCreated={(c) => setComments((p) => [c, ...p])} />
      <div className="mt-6 flex flex-col gap-5">
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
    </section>
  );
}
