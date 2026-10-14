export type VideoCategory =
  | 'All'
  | 'Gaming'
  | 'Music'
  | 'Tech'
  | 'Next.js'
  | 'React'
  | 'AI'
  | 'Podcasts'
  | 'Education'
  | 'Entertainment';

export interface Channel {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  subscribers: string;
  isSubscribed?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  formattedDuration: string; // e.g. "14:20"
  views: number;
  formattedViews: string; // e.g. "1.4M views"
  uploadedAt: string; // ISO string
  formattedUploadTime: string; // e.g. "3 days ago"
  channel: Channel;
  category: VideoCategory;
  tags: string[];
  likes: number;
  isShort?: boolean;
  commentsCount?: number;
  trendingRank?: number;
  trendingCategory?: 'now' | 'music' | 'gaming' | 'movies';
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  privacy: 'public' | 'private' | 'unlisted';
  videoIds: string[];
  videos?: Video[];
  videoCount: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UploadDateFilter = 'any' | 'hour' | 'today' | 'week' | 'month' | 'year';
export type DurationFilter = 'any' | 'short' | 'medium' | 'long'; // short <4m, medium 4-20m, long >20m
export type SortByFilter = 'relevance' | 'date' | 'views' | 'rating';
export type ContentTypeFilter = 'all' | 'video' | 'playlist';

export interface SearchFilters {
  uploadDate: UploadDateFilter;
  duration: DurationFilter;
  sortBy: SortByFilter;
  type: ContentTypeFilter;
}

export interface CursorPaginationResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}
