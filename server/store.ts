import type { Comment, Reaction, Video, WatchProgress } from "@/types/video";
import { SEED_VIDEOS } from "./seed-videos";

// In-memory store, survives hot reload. Replace with Prisma once the schema is merged.
interface Store {
  videos: Map<string, Video>;
  comments: Comment[];
  reactions: Map<string, Reaction>; // key: `${userId}:${videoId}`
  commentLikes: Set<string>; // key: `${userId}:${commentId}`
  history: Map<string, WatchProgress>; // key: videoId (single demo user)
  viewKeys: Map<string, number>; // key: `${ip}:${videoId}` -> timestamp (spam guard)
}

const g = globalThis as unknown as { __m3store?: Store };

export const store: Store =
  g.__m3store ??
  (g.__m3store = {
    videos: new Map(SEED_VIDEOS.map((v) => [v.id, { ...v }])),
    comments: [],
    reactions: new Map(),
    commentLikes: new Set(),
    history: new Map(),
    viewKeys: new Map(),
  });

// Until Member 1's Auth.js is merged, everyone is this demo user.
export const DEMO_USER = "demo-user";
