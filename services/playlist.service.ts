import { INITIAL_PLAYLISTS, MOCK_VIDEOS } from '@/lib/mockData';
import { Playlist, Video } from '@/types';

// Server-side persistent store (in-memory for mock runtime)
let playlistsStore: Playlist[] = [...INITIAL_PLAYLISTS];

export class PlaylistService {
  /**
   * Return all user playlists with video counts
   */
  static getPlaylists(): Playlist[] {
    return playlistsStore.map((pl) => {
      const firstVideo = MOCK_VIDEOS.find((v) => v.id === pl.videoIds[0]);
      return {
        ...pl,
        videoCount: pl.videoIds.length,
        thumbnailUrl: pl.thumbnailUrl || firstVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=405&fit=crop',
      };
    });
  }

  /**
   * Get single playlist by ID, populated with complete Video objects
   */
  static getPlaylistById(id: string): (Playlist & { videos: Video[] }) | null {
    const playlist = playlistsStore.find((p) => p.id === id);
    if (!playlist) return null;

    const populatedVideos: Video[] = playlist.videoIds
      .map((vidId) => MOCK_VIDEOS.find((v) => v.id === vidId))
      .filter((v): v is Video => Boolean(v));

    const firstVideo = populatedVideos[0];

    return {
      ...playlist,
      videoCount: playlist.videoIds.length,
      thumbnailUrl: playlist.thumbnailUrl || firstVideo?.thumbnailUrl,
      videos: populatedVideos,
    };
  }

  /**
   * Create a new playlist
   */
  static createPlaylist(payload: {
    title: string;
    description?: string;
    privacy?: 'public' | 'private' | 'unlisted';
    initialVideoId?: string;
  }): Playlist {
    const videoIds = payload.initialVideoId ? [payload.initialVideoId] : [];
    const firstVideo = payload.initialVideoId
      ? MOCK_VIDEOS.find((v) => v.id === payload.initialVideoId)
      : undefined;

    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: payload.title.trim() || 'Untitled Playlist',
      description: payload.description?.trim() || '',
      privacy: payload.privacy || 'private',
      videoIds,
      videoCount: videoIds.length,
      thumbnailUrl:
        firstVideo?.thumbnailUrl ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=405&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    playlistsStore.unshift(newPlaylist);
    return newPlaylist;
  }

  /**
   * Add video to a playlist
   */
  static addVideo(playlistId: string, videoId: string): boolean {
    const playlist = playlistsStore.find((p) => p.id === playlistId);
    if (!playlist) return false;

    if (!playlist.videoIds.includes(videoId)) {
      playlist.videoIds.push(videoId);
      playlist.videoCount = playlist.videoIds.length;
      playlist.updatedAt = new Date().toISOString();

      if (!playlist.thumbnailUrl) {
        const video = MOCK_VIDEOS.find((v) => v.id === videoId);
        if (video) playlist.thumbnailUrl = video.thumbnailUrl;
      }
    }
    return true;
  }

  /**
   * Remove video from playlist
   */
  static removeVideo(playlistId: string, videoId: string): boolean {
    const playlist = playlistsStore.find((p) => p.id === playlistId);
    if (!playlist) return false;

    playlist.videoIds = playlist.videoIds.filter((id) => id !== videoId);
    playlist.videoCount = playlist.videoIds.length;
    playlist.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Delete playlist
   */
  static deletePlaylist(playlistId: string): boolean {
    const prevLength = playlistsStore.length;
    playlistsStore = playlistsStore.filter((p) => p.id !== playlistId);
    return playlistsStore.length < prevLength;
  }

  /**
   * Check if a video is inside a playlist
   */
  static hasVideo(playlistId: string, videoId: string): boolean {
    const playlist = playlistsStore.find((p) => p.id === playlistId);
    return Boolean(playlist?.videoIds.includes(videoId));
  }
}
