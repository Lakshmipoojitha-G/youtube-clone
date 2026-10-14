import { randomUUID } from "crypto";
import type { Comment } from "@/types/video";
import type { CreateCommentInput } from "@/validators/comment";
import { DEMO_USER, store } from "./store";

export function listComments(videoId: string): Comment[] {
  return store.comments
    .filter((c) => c.videoId === videoId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createComment(input: CreateCommentInput): Comment {
  const comment: Comment = {
    id: randomUUID(),
    videoId: input.videoId,
    parentId: input.parentId ?? null,
    author: DEMO_USER,
    text: input.text,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  store.comments.push(comment);
  return comment;
}

export function toggleCommentLike(commentId: string) {
  const comment = store.comments.find((c) => c.id === commentId);
  if (!comment) return null;
  const key = `${DEMO_USER}:${commentId}`;
  if (store.commentLikes.has(key)) {
    store.commentLikes.delete(key);
    comment.likes--;
  } else {
    store.commentLikes.add(key);
    comment.likes++;
  }
  return { likes: comment.likes, liked: store.commentLikes.has(key) };
}

export function deleteComment(commentId: string) {
  const before = store.comments.length;
  store.comments = store.comments.filter((c) => c.id !== commentId && c.parentId !== commentId);
  return store.comments.length < before;
}
