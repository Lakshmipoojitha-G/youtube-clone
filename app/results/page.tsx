'use client';

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Video, SearchFilters } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { SearchFilterDrawer } from '@/components/search/SearchFilterDrawer';
import { Loader2, SearchX } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('search_query') || searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({
    uploadDate: 'any',
    duration: 'any',
    sortBy: 'relevance',
    type: 'all',
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(
    async (targetQuery: string, currentFilters: SearchFilters, cursor: string | null = null, append = false) => {
      setIsLoading(true);
      try {
        const url = new URL('/api/search', window.location.origin);
        url.searchParams.set('q', targetQuery);
        url.searchParams.set('uploadDate', currentFilters.uploadDate);
        url.searchParams.set('duration', currentFilters.duration);
        url.searchParams.set('sortBy', currentFilters.sortBy);
        url.searchParams.set('type', currentFilters.type);
        url.searchParams.set('limit', '10');
        if (cursor) url.searchParams.set('cursor', cursor);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.success && data.data) {
          if (append) {
            setVideos((prev) => [...prev, ...data.data.items]);
          } else {
            setVideos(data.data.items);
          }
          setTotalMatches(data.data.totalCount || data.data.items.length);
          setNextCursor(data.data.nextCursor);
          setHasMore(data.data.hasMore);
        }
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger search on query or filter change
  useEffect(() => {
    fetchResults(query, filters, null, false);
  }, [query, filters, fetchResults]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          fetchResults(query, filters, nextCursor, true);
        }
      },
      { rootMargin: '300px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoading, nextCursor, query, filters, fetchResults]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 12px' }}>
      {/* Search Header & Filter Controls */}
      <div style={{ marginBottom: '16px' }}>
        <SearchFilterDrawer filters={filters} onChange={(updated) => setFilters(updated)} />

        {query && (
          <div style={{ fontSize: '13px', color: '#aaa', marginTop: '-10px', marginBottom: '16px' }}>
            Showing results for <span style={{ color: '#fff', fontWeight: 600 }}>&ldquo;{query}&rdquo;</span>
            {totalMatches > 0 && <span> ({totalMatches} videos found)</span>}
          </div>
        )}
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {videos.map((video, idx) => (
          <VideoCard key={`${video.id}-${idx}`} video={video} layout="horizontal" />
        ))}
      </div>

      {/* Skeletons when initial loading */}
      {isLoading && videos.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              <div className="skeleton" style={{ width: '360px', aspectRatio: '16/9', borderRadius: '12px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ width: '80%', height: '22px' }} />
                <div className="skeleton" style={{ width: '40%', height: '14px' }} />
                <div className="skeleton" style={{ width: '60%', height: '14px' }} />
                <div className="skeleton" style={{ width: '90%', height: '36px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && videos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: '#aaa' }}>
          <SearchX size={54} color="#666" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#f1f1f1', marginBottom: '8px' }}>No results found</h3>
          <p style={{ fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
            Try different keywords or remove search filters to find what you are looking for.
          </p>
        </div>
      )}

      {/* Sentinel / Load more indicator */}
      {hasMore && (
        <div ref={sentinelRef} style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading more results...</span>
            </div>
          )}
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
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px', color: '#aaa' }}>
          Loading search results...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
