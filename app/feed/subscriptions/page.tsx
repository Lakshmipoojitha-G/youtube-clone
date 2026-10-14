'use client';

import React, { useState, useEffect } from 'react';
import { Video, Channel } from '@/types';
import { VideoGrid } from '@/components/video/VideoGrid';
import { useApp } from '@/context/AppContext';
import { Tv, Check, Bell } from 'lucide-react';

export default function SubscriptionsPage() {
  const { subscribedChannels, toggleSubscribe } = useApp();
  const [filter, setFilter] = useState<'latest' | 'today' | 'unwatched'>('latest');
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubFeed = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/feed/subscriptions?filter=${filter}&limit=12`);
        const data = await res.json();
        if (data.success && data.data) {
          setVideos(data.data.items);
          setNextCursor(data.data.nextCursor);
          setHasMore(data.data.hasMore);
        }
      } catch (err) {
        console.error('Failed to fetch subscriptions feed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubFeed();
  }, [filter]);

  return (
    <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '8px 12px' }}>
      {/* Subscribed Channels Avatar Reel */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '12px 0 20px 0',
          scrollbarWidth: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '20px',
        }}
      >
        {subscribedChannels.map((channel) => (
          <div
            key={channel.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              width: '74px',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={channel.avatarUrl}
                alt={channel.name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.15)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#3ea6ff',
                  border: '2px solid #0f0f0f',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                color: '#aaa',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {channel.name}
            </span>
          </div>
        ))}
      </div>

      {/* Header & Filter Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tv size={22} color="#3ea6ff" />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f1f1' }}>Latest from Subscriptions</h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['latest', 'today', 'unwatched'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`category-chip ${filter === tab ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        hasMore={hasMore}
        emptyMessage="No new videos from your subscriptions right now."
      />
    </div>
  );
}
