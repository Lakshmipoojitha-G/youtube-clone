import type { Reaction, Video } from "@/types/video";
import { DEMO_USER, store } from "./store";

const VIEW_WINDOW_MS = 30 * 60 * 1000; // same viewer counts once per 30 min

export function getVideo(id: string): Video | undefined {
  return store.videos.get(id);
}

export function getRelatedVideos(id: string, limit = 8): Video[] {
  return [...store.videos.values()].filter((v) => v.id !== id).slice(0, limit);
}

export function getUserReaction(videoId: string): Reaction {
  return store.reactions.get(`${DEMO_USER}:${videoId}`) ?? null;
}

export function setReaction(videoId: string, next: "like" | "dislike" | "none") {
  const video = store.videos.get(videoId);
  if (!video) return null;
  const key = `${DEMO_USER}:${videoId}`;
  const prev = store.reactions.get(key) ?? null;
  if (prev === "like") video.likes--;
  if (prev === "dislike") video.dislikes--;
  if (next === "like") video.likes++;
  if (next === "dislike") video.dislikes++;
  if (next === "none") store.reactions.delete(key);
  else store.reactions.set(key, next);
  return { likes: video.likes, dislikes: video.dislikes, reaction: next === "none" ? null : next };
}

/** Counts a view unless the same viewer already counted one recently (Redis replacement). */
export function registerView(videoId: string, viewerKey: string) {
  const video = store.videos.get(videoId);
  if (!video) return null;
  const key = `${viewerKey}:${videoId}`;
  const last = store.viewKeys.get(key);
  const now = Date.now();
  if (!last || now - last > VIEW_WINDOW_MS) {
    store.viewKeys.set(key, now);
    video.views++;
  }
  return { views: video.views };
}

export function saveProgress(videoId: string, seconds: number) {
  store.history.set(videoId, { videoId, seconds, updatedAt: new Date().toISOString() });
}

export function getProgress(videoId: string): number {
  return store.history.get(videoId)?.seconds ?? 0;
}

export function getHistory() {
  return [...store.history.values()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((h) => ({ ...h, video: store.videos.get(h.videoId)! }))
    .filter((h) => h.video);
}

export function getLikedVideos(): Video[] {
  return [...store.reactions.entries()]
    .filter(([k, r]) => k.startsWith(`${DEMO_USER}:`) && r === "like")
    .map(([k]) => store.videos.get(k.split(":")[1]))
    .filter((v): v is Video => !!v);
}
