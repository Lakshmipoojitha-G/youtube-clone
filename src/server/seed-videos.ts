import type { Video } from "@/types/video";

// Temporary seed data until Member 1's Prisma schema + prisma/seed.ts land.
const BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

const make = (id: string, title: string, file: string, thumb: string, views: number): Video => ({
  id,
  title,
  description: `${title} - sample video used for development.`,
  videoUrl: `${BASE}/${file}`,
  thumbnailUrl: `${BASE}/images/${thumb}`,
  channelName: "Blender Foundation",
  channelHandle: "blender",
  views,
  likes: 120,
  dislikes: 4,
  createdAt: new Date("2026-01-01").toISOString(),
});

export const SEED_VIDEOS: Video[] = [
  make("1", "Big Buck Bunny", "BigBuckBunny.mp4", "BigBuckBunny.jpg", 15230),
  make("2", "Elephants Dream", "ElephantsDream.mp4", "ElephantsDream.jpg", 8120),
  make("3", "Sintel", "Sintel.mp4", "Sintel.jpg", 22010),
  make("4", "Tears of Steel", "TearsOfSteel.mp4", "TearsOfSteel.jpg", 5400),
  make("5", "For Bigger Blazes", "ForBiggerBlazes.mp4", "ForBiggerBlazes.jpg", 980),
];
