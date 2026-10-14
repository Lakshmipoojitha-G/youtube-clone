'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Plus, Bell, Video as VideoIcon } from 'lucide-react';
import { SearchAutocomplete } from '../search/SearchAutocomplete';
import { useApp } from '@/context/AppContext';

export const Header: React.FC = () => {
  const { toggleSidebar, openCreatePlaylistModal } = useApp();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 900,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Left Section: Menu Toggle + Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            padding: '8px',
            borderRadius: '50%',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: '#ff0000',
              borderRadius: '8px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* YouTube Play Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: '#ffffff',
              marginLeft: '4px',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            YouTube
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#aaa',
              verticalAlign: 'top',
              alignSelf: 'flex-start',
              marginLeft: '2px',
              fontWeight: 500,
            }}
          >
            PRO
          </span>
        </Link>
      </div>

      {/* Middle Section: Search Bar & Autocomplete */}
      <div style={{ flex: 1, maxWidth: '640px', margin: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <SearchAutocomplete />
      </div>

      {/* Right Section: Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Create / New Playlist Button */}
        <button
          onClick={openCreatePlaylistModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#f1f1f1',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
        >
          <Plus size={18} />
          <span>Create</span>
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              padding: '8px',
              borderRadius: '50%',
              color: '#fff',
              position: 'relative',
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ff0033',
                borderRadius: '50%',
                border: '2px solid #0f0f0f',
              }}
            />
          </button>
        </div>

        {/* User Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginLeft: '4px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          title="Profile"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="Profile Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  );
};
