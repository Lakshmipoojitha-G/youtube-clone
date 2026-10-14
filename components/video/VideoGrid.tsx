'use client';

import React, { useEffect, useRef } from 'react';
import { Video } from '@/types';
import { VideoCard } from './VideoCard';
import { Loader2 } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = 'No videos found.',
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Setup infinite scroll intersection observer
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: '300px', // trigger before reaching absolute bottom
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div style={{ width: '100%' }}>
      {/* Grid container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px 16px',
        }}
      >
        {videos.map((video, index) => (
          <VideoCard key={`${video.id}-${index}`} video={video} layout="grid" />
        ))}

        {/* Skeleton loaders while loading */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={`skeleton-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Thumbnail skeleton */}
              <div
                className="skeleton"
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}
              />
              {/* Meta skeleton */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  className="skeleton"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ width: '90%', height: '16px' }} />
                  <div className="skeleton" style={{ width: '60%', height: '14px' }} />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && videos.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 16px',
            color: '#aaa',
            fontSize: '16px',
          }}
        >
          {emptyMessage}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '36px 0',
            color: '#aaa',
          }}
        >
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading more videos...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && videos.length > 0 && (
        <div style={{ textAlign: 'center', padding: '36px 0', color: '#666', fontSize: '13px' }}>
          ✓ You are all caught up!
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
