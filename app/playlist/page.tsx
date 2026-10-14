'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListVideo, Plus, Lock, Globe, Link as LinkIcon, Play } from 'lucide-react';

export default function PlaylistsIndexPage() {
  const { playlists, openCreatePlaylistModal } = useApp();

  const renderPrivacyIcon = (privacy: string) => {
    if (privacy === 'public') return <Globe size={13} color="#aaa" />;
    if (privacy === 'unlisted') return <LinkIcon size={13} color="#aaa" />;
    return <Lock size={13} color="#aaa" />;
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 8px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListVideo size={26} color="#3ea6ff" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f1f1' }}>Your Playlists</h1>
            <p style={{ fontSize: '13px', color: '#aaa' }}>
              {playlists.length} playlists created
            </p>
          </div>
        </div>

        <button
          onClick={openCreatePlaylistModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#3ea6ff',
            color: '#000',
            fontWeight: 600,
            fontSize: '14px',
            padding: '10px 18px',
            borderRadius: '24px',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={18} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Playlist Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Create Card Shortcut */}
        <div
          onClick={openCreatePlaylistModal}
          style={{
            aspectRatio: '16/9',
            borderRadius: '12px',
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = '#3ea6ff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={22} color="#3ea6ff" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f1' }}>
            Create New Playlist
          </span>
        </div>

        {/* Existing Playlists */}
        {playlists.map((pl) => (
          <Link
            key={pl.id}
            href={`/playlist/${pl.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
          >
            {/* Stacked Thumbnail Effect */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#1f1f1f',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pl.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=405&fit=crop'}
                alt={pl.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* YouTube-style Playlist Badge overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                  <ListVideo size={16} />
                  <span>{pl.videoIds.length} videos</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#aaa',
                  }}
                >
                  {renderPrivacyIcon(pl.privacy)}
                  <span style={{ textTransform: 'capitalize' }}>{pl.privacy}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ marginTop: '10px' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#f1f1f1',
                  lineHeight: '20px',
                }}
                className="line-clamp-1"
              >
                {pl.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                View full playlist
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
