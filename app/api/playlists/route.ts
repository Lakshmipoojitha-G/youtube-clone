import { NextRequest, NextResponse } from 'next/server';
import { PlaylistService } from '@/services/playlist.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const playlists = PlaylistService.getPlaylists();
    return NextResponse.json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error('Playlists GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, privacy, initialVideoId } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Playlist title is required' },
        { status: 400 }
      );
    }

    const playlist = PlaylistService.createPlaylist({
      title,
      description,
      privacy,
      initialVideoId,
    });

    return NextResponse.json({
      success: true,
      playlist,
    }, { status: 201 });
  } catch (error) {
    console.error('Playlists POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
