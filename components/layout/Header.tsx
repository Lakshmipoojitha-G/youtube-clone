'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Plus, Bell, LogIn, User, Settings, LogOut, Check } from 'lucide-react';
import { SearchAutocomplete } from '../search/SearchAutocomplete';
import { useApp } from '@/context/AppContext';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export const Header: React.FC = () => {
  const router = useRouter();
  const { toggleSidebar, openCreatePlaylistModal } = useApp();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch current user and notifications
  useEffect(() => {
    async function loadUserAndNotifs() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          if (userData?.id) {
            const notifRes = await fetch('/api/notifications');
            if (notifRes.ok) {
              const notifs: NotificationItem[] = await notifRes.json();
              setNotifications(notifs);
              setUnreadCount(notifs.filter((n) => !n.read).length);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    loadUserAndNotifs();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleMarkAllRead() {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setUser(null);
      setIsProfileOpen(false);
      router.push('/auth/signin');
      router.refresh();
    } catch {
      // ignore
    }
  }

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

        {/* Notifications Bell & Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              color: '#fff',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#ff0033',
                  borderRadius: '10px',
                  padding: '1px 5px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#fff',
                  lineHeight: '12px',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: '0',
                width: '340px',
                maxHeight: '420px',
                backgroundColor: '#212121',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                overflowY: 'auto',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      fontSize: '12px',
                      color: '#3ea6ff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || '#'}
                    onClick={() => setIsNotifOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      backgroundColor: n.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{n.body}</div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Avatar / Profile Menu or Sign In */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          {user ? (
            <>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginLeft: '4px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#cc0000',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
                title={user.name || 'Account'}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user.name?.charAt(0) || 'U').toUpperCase()
                )}
              </button>

              {isProfileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: '0',
                    width: '240px',
                    backgroundColor: '#212121',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    padding: '8px 0',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{user.name}</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{user.email}</div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      color: '#eee',
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <User size={16} />
                    <span>Your Profile</span>
                  </Link>

                  <Link
                    href="/settings/channel"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      color: '#eee',
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Settings size={16} />
                    <span>Create / Manage Channel</span>
                  </Link>

                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      color: '#ff4d4f',
                      fontSize: '13px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/auth/signin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #3ea6ff',
                color: '#3ea6ff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
