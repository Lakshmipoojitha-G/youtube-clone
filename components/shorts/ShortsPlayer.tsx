'use client';

import React, { useState, useEffect } from 'react';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ShortsPlayerProps {
  shorts: Video[];
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ shorts }) => {
  const { toggleSubscribe, isSubscribed, showToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [disliked, setDisliked] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const currentShort = shorts[currentIndex];

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  if (!currentShort) {
    return <div style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>No Shorts available</div>;
  }

  const isCurrentLiked = liked[currentShort.id] || false;
  const isCurrentDisliked = disliked[currentShort.id] || false;
  const isChannelSubbed = isSubscribed(currentShort.channel.id);

  const toggleLike = () => {
    setLiked((prev) => ({ ...prev, [currentShort.id]: !prev[currentShort.id] }));
    if (isCurrentDisliked) {
      setDisliked((prev) => ({ ...prev, [currentShort.id]: false }));
    }
  };

  const toggleDislike = () => {
    setDisliked((prev) => ({ ...prev, [currentShort.id]: !prev[currentShort.id] }));
    if (isCurrentLiked) {
      setLiked((prev) => ({ ...prev, [currentShort.id]: false }));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(currentShort.videoUrl || window.location.href);
    showToast('Short link copied to clipboard!');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        height: 'calc(100vh - var(--header-height) - 32px)',
        padding: '12px 0',
      }}
    >
      {/* 9:16 Shorts Video Container */}
      <div
        style={{
          position: 'relative',
          width: '380px',
          height: '100%',
          maxHeight: '680px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#000',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Background Visual (Image / Video simulation) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentShort.thumbnailUrl}
          alt={currentShort.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.9)',
          }}
        />

        {/* Play / Sound Overlay Controls */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              color: '#fff',
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              color: '#fff',
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>

        {/* Bottom Details Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 16px 20px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Channel Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentShort.channel.avatarUrl}
              alt={currentShort.channel.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              @{currentShort.channel.name.replace(/\s+/g, '').toLowerCase()}
            </span>

            <button
              onClick={() => toggleSubscribe(currentShort.channel.id)}
              style={{
                backgroundColor: isChannelSubbed ? 'rgba(255,255,255,0.2)' : '#fff',
                color: isChannelSubbed ? '#fff' : '#000',
                padding: '6px 14px',
                borderRadius: '18px',
                fontSize: '12px',
                fontWeight: 600,
                marginLeft: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {isChannelSubbed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Title */}
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', lineHeight: '20px' }}>
            {currentShort.title}
          </p>

          {/* Audio meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
            <Music size={14} />
            <span>Original sound – {currentShort.channel.name}</span>
          </div>
        </div>
      </div>

      {/* Action Rail (Right) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
        {/* Like */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={toggleLike}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isCurrentLiked ? '#3ea6ff' : 'rgba(255, 255, 255, 0.12)',
              color: isCurrentLiked ? '#000' : '#fff',
              transition: 'all 0.15s',
            }}
          >
            <ThumbsUp size={20} />
          </button>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
            {((currentShort.likes + (isCurrentLiked ? 1 : 0)) / 1000).toFixed(0)}K
          </span>
        </div>

        {/* Dislike */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={toggleDislike}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isCurrentDisliked ? '#ff4444' : 'rgba(255, 255, 255, 0.12)',
              color: isCurrentDisliked ? '#fff' : '#fff',
            }}
          >
            <ThumbsDown size={20} />
          </button>
          <span style={{ fontSize: '12px', color: '#fff' }}>Dislike</span>
        </div>

        {/* Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => showToast('Comments section opened')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
            }}
          >
            <MessageSquare size={20} />
          </button>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>1.2K</span>
        </div>

        {/* Share */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleShare}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
            }}
          >
            <Share2 size={20} />
          </button>
          <span style={{ fontSize: '12px', color: '#fff' }}>Share</span>
        </div>

        {/* Navigation Arrows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              opacity: currentIndex === 0 ? 0.3 : 1,
            }}
            title="Previous Short"
          >
            <ChevronUp size={22} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === shorts.length - 1}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              opacity: currentIndex === shorts.length - 1 ? 0.3 : 1,
            }}
            title="Next Short"
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
