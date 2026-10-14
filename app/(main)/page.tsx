'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Video, VideoCategory } from '@/types';
import { VideoGrid } from '@/components/video/VideoGrid';

const CATEGORIES: VideoCategory[] = [
  'All',
  'Next.js',
  'React',
  'AI',
  'Gaming',
  'Music',
  'Tech',
  'Podcasts',
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('All');
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch feed with cursor
  const fetchFeed = useCallback(async (category: VideoCategory, cursor: string | null = null, append = false) => {
    setIsLoading(true);
    try {
      const url = new URL('/api/feed/home', window.location.origin);
      if (cursor) url.searchParams.set('cursor', cursor);
      url.searchParams.set('category', category);
      url.searchParams.set('limit', '8');

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.success && data.data) {
        if (append) {
          setVideos((prev) => [...prev, ...data.data.items]);
        } else {
          setVideos(data.data.items);
        }
        setNextCursor(data.data.nextCursor);
        setHasMore(data.data.hasMore);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load or category change
  useEffect(() => {
    fetchFeed(selectedCategory, null, false);
  }, [selectedCategory, fetchFeed]);

  // Load more via cursor
  const handleLoadMore = () => {
    if (!isLoading && hasMore && nextCursor) {
      fetchFeed(selectedCategory, nextCursor, true);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1800px', margin: '0 auto' }}>
      {/* Category Pills Header Bar */}
      <div className="category-chips-bar" style={{ position: 'sticky', top: 'var(--header-height)', backgroundColor: '#0f0f0f', zIndex: 10 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (selectedCategory !== cat) {
                setSelectedCategory(cat);
                setNextCursor(null);
                setVideos([]);
              }
            }}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid Feed */}
      <div style={{ marginTop: '16px' }}>
        <VideoGrid
          videos={videos}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          emptyMessage={`No videos found under category "${selectedCategory}".`}
        />
      </div>
    </div>
  );
}
