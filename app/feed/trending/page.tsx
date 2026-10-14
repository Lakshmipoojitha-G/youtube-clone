'use client';

import React, { useState, useEffect } from 'react';
import { Video } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { Flame, Music2, Gamepad2, Film } from 'lucide-react';

type TrendingTab = 'now' | 'music' | 'gaming' | 'movies';

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<TrendingTab>('now');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/feed/trending?tab=${activeTab}`);
        const data = await res.json();
        if (data.success && data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.error('Failed to fetch trending videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, [activeTab]);

  const tabs: { key: TrendingTab; label: string; icon: React.FC<{ size?: number }> }[] = [
    { key: 'now', label: 'Now', icon: Flame },
    { key: 'music', label: 'Music', icon: Music2 },
    { key: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { key: 'movies', label: 'Movies & Podcasts', icon: Film },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 8px' }}>
      {/* Trending Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ff0033',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255, 0, 51, 0.4)',
          }}
        >
          <Flame size={36} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f1f1f1' }}>Trending</h1>
          <p style={{ fontSize: '14px', color: '#aaa' }}>
            What the world is watching right now
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 6px',
                fontSize: '15px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#f1f1f1' : '#aaa',
                borderBottom: `3px solid ${isActive ? '#f1f1f1' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Videos List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {videos.map((video, idx) => (
          <div key={video.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Big Rank Number */}
            <div
              style={{
                width: '32px',
                fontSize: '22px',
                fontWeight: 800,
                color: idx < 3 ? '#ff0033' : '#666',
                textAlign: 'center',
                marginTop: '12px',
              }}
            >
              #{idx + 1}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <VideoCard video={video} layout="horizontal" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeletons */}
      {isLoading && videos.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px' }}>
              <div className="skeleton" style={{ width: '360px', aspectRatio: '16/9', borderRadius: '12px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton" style={{ width: '70%', height: '20px' }} />
                <div className="skeleton" style={{ width: '30%', height: '14px' }} />
                <div className="skeleton" style={{ width: '90%', height: '40px' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
