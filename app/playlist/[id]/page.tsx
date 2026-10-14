'use client';

import React, { use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { VideoCard } from '@/components/video/VideoCard';
import { MOCK_VIDEOS } from '@/lib/mockData';
import { Video } from '@/types';
import {
  Play,
  Shuffle,
  Share2,
  Trash2,
  ListVideo,
  ArrowLeft,
} from 'lucide-react';


interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

function PlaylistDetailContent({ params }: PlaylistPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { playlists, removeVideoFromPlaylist, deletePlaylist, showToast } = useApp();

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div style={{ maxWidth: '800px', margin: '48px auto', textAlign: 'center', color: '#aaa' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px' }}>Playlist not found</h2>
        <p style={{ marginBottom: '20px' }}>This playlist may have been deleted or does not exist.</p>
        <Link
          href="/playlist"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#3ea6ff',
            color: '#000',
            padding: '8px 18px',
            borderRadius: '20px',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Return to Playlists
        </Link>
      </div>
    );
  }

  const videos: Video[] = playlist.videoIds
    .map((vidId) => MOCK_VIDEOS.find((v) => v.id === vidId))
    .filter((v): v is Video => Boolean(v));

  const firstVideo = videos[0];

  const handleDeletePlaylist = async () => {
    if (confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
      await deletePlaylist(playlist.id);
      router.push('/playlist');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Playlist link copied to clipboard!');
  };

  const handlePlayAll = () => {
    if (firstVideo?.videoUrl) {
      window.open(firstVideo.videoUrl, '_blank');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '32px',
      }}
    >
      {/* Left Column: Playlist Details Card */}
      <div
        style={{
          width: '360px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: 'calc(var(--header-height) + 16px)',
        }}
      >
        {/* Playlist Cover Art */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#1f1f1f',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={playlist.thumbnailUrl || firstVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=405&fit=crop'}
            alt={playlist.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              cursor: 'pointer',
            }}
            onClick={handlePlayAll}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={24} color="#fff" style={{ marginLeft: '3px' }} />
            </div>
          </div>
        </div>

        {/* Title & Creator */}
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f1f1', lineHeight: '30px' }}>
            {playlist.title}
          </h1>
          <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600, marginTop: '8px' }}>
            Created by You
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#aaa', marginTop: '6px' }}>
            <span>{playlist.videoIds.length} videos</span> • <span>Updated today</span>
          </div>
          {playlist.description && (
            <p style={{ fontSize: '13px', color: '#aaa', marginTop: '10px', lineHeight: '18px' }}>
              {playlist.description}
            </p>
          )}
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePlayAll}
            disabled={videos.length === 0}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 600,
              fontSize: '14px',
              padding: '10px 14px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: videos.length === 0 ? 0.5 : 1,
            }}
          >
            <Play size={18} fill="#000" />
            <span>Play all</span>
          </button>

          <button
            onClick={handlePlayAll}
            disabled={videos.length === 0}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              padding: '10px 14px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: videos.length === 0 ? 0.5 : 1,
            }}
          >
            <Shuffle size={18} />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Secondary Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#aaa',
              padding: '6px',
            }}
          >
            <Share2 size={16} /> Share
          </button>

          <button
            onClick={handleDeletePlaylist}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#ff4444',
              padding: '6px',
            }}
          >
            <Trash2 size={16} /> Delete playlist
          </button>
        </div>
      </div>

      {/* Right Column: Video Queue List */}
      <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {videos.map((video, idx) => (
          <VideoCard
            key={`${video.id}-${idx}`}
            video={video}
            layout="compact"
            playlistId={playlist.id}
            index={idx}
            onRemoveFromPlaylist={(vidId) => removeVideoFromPlaylist(playlist.id, vidId)}
          />
        ))}

        {videos.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
            }}
          >
            <ListVideo size={48} color="#666" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '18px', color: '#f1f1f1', marginBottom: '8px' }}>No videos in this playlist yet</h3>
            <p style={{ fontSize: '14px', color: '#888', maxWidth: '360px', margin: '0 auto 20px auto' }}>
              Explore videos from the Home feed or Search and click the 3-dots menu &gt; &ldquo;Save to playlist&rdquo;.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '14px',
              }}
            >
              Discover Videos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlaylistDetailPage(props: PlaylistPageProps) {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: '#aaa' }}>Loading playlist...</div>}>
      <PlaylistDetailContent {...props} />
    </Suspense>
  );
}
