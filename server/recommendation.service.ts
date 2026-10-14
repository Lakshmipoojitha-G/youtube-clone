import { MOCK_VIDEOS, MOCK_CHANNELS } from '@/lib/mockData';
import { Video, Channel, VideoCategory, CursorPaginationResponse } from '@/types';

export class RecommendationService {
  /**
   * Home Feed with cursor pagination and category filtering
   * Generates seamless infinite scroll data with cursor tokens
   */
  static getHomeFeed(
    cursor: string | null = null,
    limit: number = 8,
    category: VideoCategory = 'All'
  ): CursorPaginationResponse<Video> {
    // Exclude shorts from regular video grid, or include them as normal
    let pool = MOCK_VIDEOS.filter((v) => !v.isShort);

    if (category && category !== 'All') {
      pool = pool.filter((v) => v.category.toLowerCase() === category.toLowerCase());
    }

    if (pool.length === 0) {
      pool = MOCK_VIDEOS.filter((v) => !v.isShort);
    }

    // Decode cursor
    let offset = 0;
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('ascii');
        const parsed = parseInt(decoded, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          offset = parsed;
        }
      } catch {
        offset = 0;
      }
    }

    // Wrap around pool for endless realistic infinite scroll experience
    const items: Video[] = [];
    for (let i = 0; i < limit; i++) {
      const index = (offset + i) % pool.length;
      // create unique id for appended repeats if looping
      const repeatCount = Math.floor((offset + i) / pool.length);
      const original = pool[index];
      if (repeatCount > 0) {
        items.push({
          ...original,
          id: `${original.id}-loop-${repeatCount}`,
        });
      } else {
        items.push(original);
      }
    }

    const nextOffset = offset + limit;
    // Set a practical cap of 40 videos before soft end, but allow continuation
    const hasMore = nextOffset < 60;
    const nextCursor = hasMore ? Buffer.from(String(nextOffset)).toString('base64') : null;

    return {
      items,
      nextCursor,
      hasMore,
      totalCount: pool.length,
    };
  }

  /**
   * Trending page feed categorized by tab
   */
  static getTrendingFeed(tab: 'now' | 'music' | 'gaming' | 'movies' = 'now'): Video[] {
    let trending = MOCK_VIDEOS.filter((v) => !v.isShort);

    if (tab === 'music') {
      trending = trending.filter((v) => v.category === 'Music');
    } else if (tab === 'gaming') {
      trending = trending.filter((v) => v.category === 'Gaming');
    } else if (tab === 'movies') {
      trending = trending.filter((v) => v.category === 'Podcasts' || v.category === 'Entertainment');
    }

    // Sort by trending weight (views * likes factor)
    return trending
      .sort((a, b) => b.views - a.views)
      .map((video, idx) => ({
        ...video,
        trendingRank: idx + 1,
      }));
  }

  /**
   * Subscriptions feed - only videos from channels the user has subscribed to
   */
  static getSubscriptionsFeed(
    cursor: string | null = null,
    limit: number = 12,
    filter: 'latest' | 'today' | 'unwatched' = 'latest'
  ): CursorPaginationResponse<Video> {
    const subscribedChannelIds = new Set(
      MOCK_CHANNELS.filter((ch) => ch.isSubscribed).map((ch) => ch.id)
    );

    let subVideos = MOCK_VIDEOS.filter((v) => subscribedChannelIds.has(v.channel.id));

    if (filter === 'today') {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      subVideos = subVideos.filter((v) => new Date(v.uploadedAt).getTime() >= oneDayAgo);
      if (subVideos.length === 0) {
        // fallback to recent
        subVideos = MOCK_VIDEOS.filter((v) => subscribedChannelIds.has(v.channel.id));
      }
    }

    // Sort by most recently uploaded
    subVideos.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    let offset = 0;
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('ascii');
        const parsed = parseInt(decoded, 10);
        if (!isNaN(parsed) && parsed >= 0) offset = parsed;
      } catch {
        offset = 0;
      }
    }

    const items = subVideos.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    const hasMore = nextOffset < subVideos.length;
    const nextCursor = hasMore ? Buffer.from(String(nextOffset)).toString('base64') : null;

    return {
      items,
      nextCursor,
      hasMore,
      totalCount: subVideos.length,
    };
  }

  /**
   * Get all subscribed channels
   */
  static getSubscribedChannels(): Channel[] {
    return MOCK_CHANNELS.filter((c) => c.isSubscribed);
  }

  /**
   * Get Shorts feed
   */
  static getShorts(): Video[] {
    return MOCK_VIDEOS.filter((v) => v.isShort);
  }
}
