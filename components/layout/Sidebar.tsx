'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Home,
  Flame,
  Tv,
  ListVideo,
  Clock,
  Compass,
  Music2,
  Gamepad2,
  ChevronRight,
  Radio,
  Sparkles,
  History,
  ThumbsUp,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, subscribedChannels } = useApp();

  const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shorts', href: '/shorts', icon: Sparkles },
    { label: 'Subscriptions', href: '/feed/subscriptions', icon: Tv },
  ];

  const libraryLinks = [
    { label: 'Your Profile', href: '/profile', icon: History },
    { label: 'Create Channel', href: '/settings/channel', icon: Tv },
    { label: 'Subscriptions', href: '/subscriptions', icon: ListVideo },
    { label: 'History', href: '/feed/history', icon: Clock },
    { label: 'Liked Videos', href: '/feed/liked', icon: ThumbsUp },
    { label: 'Playlists', href: '/playlist', icon: ListVideo },
    { label: 'Trending', href: '/feed/trending', icon: Flame },
  ];

  const exploreLinks = [
    { label: 'Music', href: '/feed/trending?tab=music', icon: Music2 },
    { label: 'Gaming', href: '/feed/trending?tab=gaming', icon: Gamepad2 },
  ];

  // Collapsed Sidebar view (only icons + small text)
  if (isSidebarCollapsed) {
    return (
      <aside
        style={{
          width: 'var(--sidebar-collapsed-width)',
          backgroundColor: '#0f0f0f',
          position: 'sticky',
          top: 'var(--header-height)',
          height: 'calc(100vh - var(--header-height))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: '20px',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {mainLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 4px',
                width: '64px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: isActive ? '#fff' : '#aaa',
                transition: 'background 0.15s',
              }}
              title={item.label}
            >
              <Icon size={20} color={isActive ? '#fff' : '#aaa'} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/playlist"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 4px',
            width: '64px',
            borderRadius: '10px',
            backgroundColor: pathname.startsWith('/playlist') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: pathname.startsWith('/playlist') ? '#fff' : '#aaa',
          }}
          title="Playlists"
        >
          <ListVideo size={20} />
          <span style={{ fontSize: '10px' }}>Playlists</span>
        </Link>
      </aside>
    );
  }

  // Full Expanded Sidebar
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#0f0f0f',
        position: 'sticky',
        top: 'var(--header-height)',
        height: 'calc(100vh - var(--header-height))',
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Primary Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {mainLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: isActive ? '#fff' : '#f1f1f1',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                transition: 'background-color 0.15s',
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={20} color={isActive ? '#fff' : '#f1f1f1'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

      {/* Library Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 600, color: '#f1f1f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>You</span>
          <ChevronRight size={16} color="#aaa" />
        </div>
        {libraryLinks.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: isActive ? '#fff' : '#f1f1f1',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

      {/* Subscriptions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h4 style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 600, color: '#f1f1f1' }}>
          Subscriptions
        </h4>
        {subscribedChannels.map((channel) => (
          <Link
            key={channel.id}
            href={`/feed/subscriptions`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 14px',
              borderRadius: '10px',
              color: '#f1f1f1',
              fontSize: '13px',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {channel.name}
            </span>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#3ea6ff',
              }}
              title="New videos"
            />
          </Link>
        ))}
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

      {/* Explore section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h4 style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 600, color: '#f1f1f1' }}>
          Explore
        </h4>
        {exploreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#f1f1f1',
                fontSize: '14px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
