import { NextRequest, NextResponse } from 'next/server';
import { PlaylistService } from '@/services/playlist.service';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: playlistId } = await context.params;
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'videoId is required' },
        { status: 400 }
      );
    }

    const added = PlaylistService.addVideo(playlistId, videoId);
    if (!added) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video added to playlist',
    });
  } catch (error) {
    console.error('Playlist add video error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add video to playlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: playlistId } = await context.params;
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'videoId query parameter is required' },
        { status: 400 }
      );
    }

    const removed = PlaylistService.removeVideo(playlistId, videoId);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video removed from playlist',
    });
  } catch (error) {
    console.error('Playlist remove video error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove video from playlist' },
      { status: 500 }
    );
  }
}
