import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/services/recommendation.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = (searchParams.get('tab') as 'now' | 'music' | 'gaming' | 'movies') || 'now';

    const trendingVideos = RecommendationService.getTrendingFeed(tab);

    return NextResponse.json({
      success: true,
      videos: trendingVideos,
    });
  } catch (error) {
    console.error('Trending feed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending feed' },
      { status: 500 }
    );
  }
}
