export type Visibility = "public" | "private" | "unlisted";
export type ProcessingStatus = "uploading" | "processing" | "ready" | "errored";

export const CATEGORIES = [
  "Music", "Gaming", "Education", "Entertainment", "News",
  "Sports", "Technology", "Travel", "Comedy", "Film & Animation",
] as const;

export interface StudioVideo {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: Visibility;
  status: ProcessingStatus;
  muxUploadId?: string;
  muxAssetId?: string;
  playbackId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}