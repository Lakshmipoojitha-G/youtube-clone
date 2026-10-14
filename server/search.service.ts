import { MOCK_VIDEOS, POPULAR_AUTOCOMPLETE_SUGGESTIONS, INITIAL_PLAYLISTS } from '@/lib/mockData';
import { Video, Playlist, SearchFilters, CursorPaginationResponse } from '@/types';

export interface SearchResultsPayload {
  videos: Video[];
  playlists?: Playlist[];
  totalMatches: number;
}

export class SearchService {
  /**
   * Search videos and playlists with advanced filters and cursor-based pagination
   */
  static search(
    query: string = '',
    filters: Partial<SearchFilters> = {},
    cursor: string | null = null,
    limit: number = 10
  ): CursorPaginationResponse<Video> {
    const cleanQuery = query.trim().toLowerCase();
    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    // 1. Filter by query
    let filtered = MOCK_VIDEOS.filter((video) => {
      if (queryTokens.length === 0) return true;

      const searchableText = [
        video.title,
        video.description,
        video.channel.name,
        video.category,
        ...video.tags,
      ]
        .join(' ')
        .toLowerCase();

      // Match all or some tokens
      return queryTokens.every((token) => searchableText.includes(token));
    });

    // 2. Apply Upload Date Filter
    if (filters.uploadDate && filters.uploadDate !== 'any') {
      const now = Date.now();
      const cutoffMap: Record<string, number> = {
        hour: 60 * 60 * 1000,
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
      };
      const cutoff = cutoffMap[filters.uploadDate];
      if (cutoff) {
        filtered = filtered.filter(
          (video) => now - new Date(video.uploadedAt).getTime() <= cutoff
        );
      }
    }

    // 3. Apply Duration Filter
    if (filters.duration && filters.duration !== 'any') {
      if (filters.duration === 'short') {
        filtered = filtered.filter((v) => v.duration < 240 || v.isShort); // < 4 min
      } else if (filters.duration === 'medium') {
        filtered = filtered.filter((v) => v.duration >= 240 && v.duration <= 1200); // 4-20 min
      } else if (filters.duration === 'long') {
        filtered = filtered.filter((v) => v.duration > 1200); // > 20 min
      }
    }

    // 4. Apply Sort Filter
    const sortBy = filters.sortBy || 'relevance';
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      if (sortBy === 'rating') {
        return b.likes - a.likes;
      }
      // 'relevance' (default: rank exact title matches higher)
      if (cleanQuery) {
        const aTitleMatch = a.title.toLowerCase().includes(cleanQuery) ? 1 : 0;
        const bTitleMatch = b.title.toLowerCase().includes(cleanQuery) ? 1 : 0;
        if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch;
      }
      return b.views - a.views;
    });

    // 5. Cursor Pagination (Decode base64 cursor representing offset index)
    let startIndex = 0;
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('ascii');
        const parsed = parseInt(decoded, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          startIndex = parsed;
        }
      } catch {
        startIndex = 0;
      }
    }

    const paginatedItems = filtered.slice(startIndex, startIndex + limit);
    const nextIndex = startIndex + limit;
    const hasMore = nextIndex < filtered.length;
    const nextCursor = hasMore ? Buffer.from(String(nextIndex)).toString('base64') : null;

    return {
      items: paginatedItems,
      nextCursor,
      hasMore,
      totalCount: filtered.length,
    };
  }

  /**
   * Autocomplete suggestions matching a search term
   */
  static getSuggestions(query: string, maxCount: number = 8): string[] {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return POPULAR_AUTOCOMPLETE_SUGGESTIONS.slice(0, maxCount);
    }

    const suggestionsSet = new Set<string>();

    // 1. Matches from popular list
    POPULAR_AUTOCOMPLETE_SUGGESTIONS.forEach((s) => {
      if (s.toLowerCase().includes(clean)) {
        suggestionsSet.add(s);
      }
    });

    // 2. Video titles & channel names
    MOCK_VIDEOS.forEach((v) => {
      if (v.title.toLowerCase().includes(clean)) {
        // extract concise suggestion
        suggestionsSet.add(v.title);
      }
      if (v.channel.name.toLowerCase().includes(clean)) {
        suggestionsSet.add(v.channel.name);
      }
    });

    return Array.from(suggestionsSet).slice(0, maxCount);
  }
}
