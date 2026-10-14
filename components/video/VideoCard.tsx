'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  MoreVertical, 
  ListPlus, 
  Share2, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Play
} from 'lucide-react';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'horizontal' | 'compact';
  playlistId?: string; // If rendered inside a specific playlist
  index?: number; // Sequential index if inside a playlist
  onRemoveFromPlaylist?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  layout = 'grid',
  playlistId,
  index,
  onRemoveFromPlaylist,
}) => {
  const { openSaveModal, showToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    const watchUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${video.id}` : `/watch/${video.id}`;
    navigator.clipboard.writeText(watchUrl);
    showToast('Video link copied to clipboard!');
  };

  const handleSaveToPlaylist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    openSaveModal(video);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onRemoveFromPlaylist) {
      onRemoveFromPlaylist(video.id);
    }
  };

  // 1. HORIZONTAL LAYOUT (Used on Search Results and Trending pages)
  if (layout === 'horizontal') {
    return (
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        position: 'relative',
        borderRadius: '12px',
        padding: '8px',
        transition: 'background-color 0.2s',
      }}
      className="video-card-horizontal"
      >
        {/* Thumbnail */}
        <Link 
          href={`/watch/${video.id}`}
          style={{ position: 'relative', flexShrink: 0, width: '360px', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e1e1e' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.25s ease' }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <span style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: video.formattedDuration === 'LIVE' ? '#cc0000' : 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            padding: '2px 5px',
            borderRadius: '4px',
            letterSpacing: '0.4px',
          }}>
            {video.formattedDuration}
          </span>
        </Link>

        {/* Content details */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Link 
              href={`/watch/${video.id}`}
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#f1f1f1',
                lineHeight: '26px',
                marginRight: '12px',
              }}
              className="line-clamp-2"
            >
              {video.title}
            </Link>

            {/* Menu Trigger */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  color: '#aaa',
                  transition: 'background 0.2s',
                }}
                title="Options"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  width: '200px',
                  backgroundColor: '#282828',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  zIndex: 50,
                  padding: '6px 0',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <button
                    onClick={handleSaveToPlaylist}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#f1f1f1',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <ListPlus size={18} /> Save to playlist
                  </button>
                  <button
                    onClick={handleShare}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#f1f1f1',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Share2 size={18} /> Share
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
            <span>{video.formattedViews}</span> • <span>{video.formattedUploadTime}</span>
          </div>

          {/* Channel metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.channel.avatarUrl}
              alt={video.channel.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {video.channel.name}
              {video.channel.verified && <CheckCircle2 size={13} color="#aaa" />}
            </span>
          </div>

          {/* Description snippet */}
          <p style={{ fontSize: '13px', color: '#999', lineHeight: '18px' }} className="line-clamp-2">
            {video.description}
          </p>

          {/* Badges */}
          {video.tags && video.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {video.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#aaa',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. COMPACT / PLAYLIST ROW LAYOUT
  if (layout === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        borderRadius: '8px',
        position: 'relative',
        transition: 'background-color 0.15s',
      }}
      className="video-card-compact"
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {/* Index number if in playlist */}
        {typeof index === 'number' && (
          <span style={{ width: '24px', textAlign: 'center', fontSize: '13px', color: '#777', fontWeight: 600 }}>
            {index + 1}
          </span>
        )}

        {/* Thumbnail */}
        <Link
          href={`/watch/${video.id}`}
          style={{
            position: 'relative',
            width: '120px',
            aspectRatio: '16/9',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#1e1e1e',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontSize: '11px',
            padding: '1px 4px',
            borderRadius: '4px',
          }}>
            {video.formattedDuration}
          </span>
        </Link>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            href={`/watch/${video.id}`}
            style={{ fontSize: '14px', fontWeight: 500, color: '#f1f1f1', lineHeight: '20px' }}
            className="line-clamp-2"
          >
            {video.title}
          </Link>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
            {video.channel.name} • {video.formattedViews}
          </div>
        </div>

        {/* Action Button */}
        {playlistId && onRemoveFromPlaylist ? (
          <button
            onClick={handleRemove}
            title="Remove from playlist"
            style={{
              padding: '6px',
              color: '#888',
              borderRadius: '50%',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ff4444')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#888')}
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <button
            onClick={handleSaveToPlaylist}
            title="Save to playlist"
            style={{ padding: '6px', color: '#888' }}
          >
            <ListPlus size={16} />
          </button>
        )}
      </div>
    );
  }

  // 3. DEFAULT GRID CARD LAYOUT (Home feed, Subscriptions feed)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'visible',
      transition: 'transform 0.2s ease',
    }}>
      {/* Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
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
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.25s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Trending Rank Pill if available */}
        {typeof video.trendingRank === 'number' && video.trendingRank <= 10 && (
          <span style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'linear-gradient(135deg, #ff0033 0%, #ff5500 100%)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            #{video.trendingRank} TRENDING
          </span>
        )}

        <span style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: video.formattedDuration === 'LIVE' ? '#cc0000' : 'rgba(0,0,0,0.85)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          {video.formattedDuration}
        </span>
      </Link>

      {/* Meta Row */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'flex-start' }}>
        {/* Channel Avatar */}
        <div style={{ flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.channel.avatarUrl}
            alt={video.channel.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        {/* Title & Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            href={`/watch/${video.id}`}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#f1f1f1',
              lineHeight: '22px',
              display: 'block',
              transition: 'color 0.15s',
            }}
            className="line-clamp-2"
            title={video.title}
          >
            {video.title}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <span style={{ fontSize: '13px', color: '#aaa', fontWeight: 400 }}>{video.channel.name}</span>
            {video.channel.verified && <CheckCircle2 size={13} color="#aaa" />}
          </div>

          <div style={{ fontSize: '13px', color: '#aaa', marginTop: '2px' }}>
            <span>{video.formattedViews}</span> • <span>{video.formattedUploadTime}</span>
          </div>
        </div>

        {/* 3-dots Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: '#aaa',
              transition: 'background 0.2s',
            }}
            title="Action menu"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              width: '190px',
              backgroundColor: '#282828',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
              zIndex: 100,
              padding: '6px 0',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <button
                onClick={handleSaveToPlaylist}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  color: '#f1f1f1',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ListPlus size={16} /> Save to playlist
              </button>

              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  color: '#f1f1f1',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
