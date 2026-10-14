'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist, Video, Channel } from '@/types';
import { INITIAL_PLAYLISTS, MOCK_CHANNELS, MOCK_VIDEOS } from '@/lib/mockData';

interface AppContextType {
  // Playlists
  playlists: Playlist[];
  createPlaylist: (title: string, description?: string, privacy?: 'public' | 'private' | 'unlisted', initialVideoId?: string) => Promise<Playlist>;
  addVideoToPlaylist: (playlistId: string, videoId: string) => Promise<boolean>;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => Promise<boolean>;
  deletePlaylist: (playlistId: string) => Promise<boolean>;
  isVideoInPlaylist: (playlistId: string, videoId: string) => boolean;

  // Save to Playlist Modal
  saveToPlaylistVideo: Video | null;
  openSaveModal: (video: Video) => void;
  closeSaveModal: () => void;

  // Create Playlist Modal
  isCreatePlaylistOpen: boolean;
  openCreatePlaylistModal: () => void;
  closeCreatePlaylistModal: () => void;

  // Subscriptions
  subscribedChannels: Channel[];
  isSubscribed: (channelId: string) => boolean;
  toggleSubscribe: (channelId: string) => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [saveToPlaylistVideo, setSaveToPlaylistVideo] = useState<Video | null>(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [subscribedIds, setSubscribedIds] = useState<string[]>([
    'ch-vercel',
    'ch-fireship',
    'ch-lex',
    'ch-chill',
    'ch-mkbhd',
    'ch-cursor',
  ]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedPl = localStorage.getItem('yt_clone_playlists');
      if (savedPl) {
        setPlaylists(JSON.parse(savedPl));
      }
      const savedSubs = localStorage.getItem('yt_clone_subs');
      if (savedSubs) {
        setSubscribedIds(JSON.parse(savedSubs));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const persistPlaylists = (updated: Playlist[]) => {
    setPlaylists(updated);
    try {
      localStorage.setItem('yt_clone_playlists', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const createPlaylist = async (
    title: string,
    description: string = '',
    privacy: 'public' | 'private' | 'unlisted' = 'private',
    initialVideoId?: string
  ): Promise<Playlist> => {
    const videoIds = initialVideoId ? [initialVideoId] : [];
    const firstVideo = initialVideoId ? MOCK_VIDEOS.find((v) => v.id === initialVideoId) : undefined;

    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim() || 'Untitled Playlist',
      description: description.trim(),
      privacy,
      videoIds,
      videoCount: videoIds.length,
      thumbnailUrl: firstVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=405&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPlaylist, ...playlists];
    persistPlaylists(updated);
    showToast(`Created playlist "${newPlaylist.title}"`);
    return newPlaylist;
  };

  const addVideoToPlaylist = async (playlistId: string, videoId: string): Promise<boolean> => {
    const updated = playlists.map((pl) => {
      if (pl.id === playlistId && !pl.videoIds.includes(videoId)) {
        const video = MOCK_VIDEOS.find((v) => v.id === videoId);
        return {
          ...pl,
          videoIds: [...pl.videoIds, videoId],
          videoCount: pl.videoIds.length + 1,
          thumbnailUrl: pl.thumbnailUrl || video?.thumbnailUrl,
          updatedAt: new Date().toISOString(),
        };
      }
      return pl;
    });

    persistPlaylists(updated);
    const target = playlists.find((p) => p.id === playlistId);
    showToast(`Added to "${target?.title || 'playlist'}"`);
    return true;
  };

  const removeVideoFromPlaylist = async (playlistId: string, videoId: string): Promise<boolean> => {
    const updated = playlists.map((pl) => {
      if (pl.id === playlistId) {
        const filtered = pl.videoIds.filter((id) => id !== videoId);
        return {
          ...pl,
          videoIds: filtered,
          videoCount: filtered.length,
          updatedAt: new Date().toISOString(),
        };
      }
      return pl;
    });

    persistPlaylists(updated);
    const target = playlists.find((p) => p.id === playlistId);
    showToast(`Removed from "${target?.title || 'playlist'}"`);
    return true;
  };

  const deletePlaylist = async (playlistId: string): Promise<boolean> => {
    const target = playlists.find((p) => p.id === playlistId);
    const updated = playlists.filter((pl) => pl.id !== playlistId);
    persistPlaylists(updated);
    showToast(`Deleted playlist "${target?.title || ''}"`);
    return true;
  };

  const isVideoInPlaylist = (playlistId: string, videoId: string): boolean => {
    const pl = playlists.find((p) => p.id === playlistId);
    return Boolean(pl?.videoIds.includes(videoId));
  };

  const isSubscribed = (channelId: string): boolean => {
    return subscribedIds.includes(channelId);
  };

  const toggleSubscribe = (channelId: string) => {
    let next: string[];
    const channel = MOCK_CHANNELS.find((c) => c.id === channelId);
    if (subscribedIds.includes(channelId)) {
      next = subscribedIds.filter((id) => id !== channelId);
      showToast(`Unsubscribed from ${channel?.name || 'channel'}`);
    } else {
      next = [...subscribedIds, channelId];
      showToast(`Subscribed to ${channel?.name || 'channel'}`);
    }
    setSubscribedIds(next);
    try {
      localStorage.setItem('yt_clone_subs', JSON.stringify(next));
    } catch {
      // fallback
    }
  };

  const subscribedChannels = MOCK_CHANNELS.map((ch) => ({
    ...ch,
    isSubscribed: subscribedIds.includes(ch.id),
  }));

  return (
    <AppContext.Provider
      value={{
        playlists,
        createPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        deletePlaylist,
        isVideoInPlaylist,
        saveToPlaylistVideo,
        openSaveModal: (v) => setSaveToPlaylistVideo(v),
        closeSaveModal: () => setSaveToPlaylistVideo(null),
        isCreatePlaylistOpen,
        openCreatePlaylistModal: () => setIsCreatePlaylistOpen(true),
        closeCreatePlaylistModal: () => setIsCreatePlaylistOpen(false),
        subscribedChannels,
        isSubscribed,
        toggleSubscribe,
        isSidebarCollapsed,
        toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
