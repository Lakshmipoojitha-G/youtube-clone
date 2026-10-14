export type Reaction = "like" | "dislike" | null;

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  channelName: string;
  channelHandle: string;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  parentId: string | null;
  author: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface WatchProgress {
  videoId: string;
  seconds: number;
  updatedAt: string;
}
