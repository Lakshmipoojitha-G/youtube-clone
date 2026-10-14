import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/server/recommendation.service';
import { VideoCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const category = (searchParams.get('category') as VideoCategory) || 'All';

    const feed = RecommendationService.getHomeFeed(cursor, limit, category);

    return NextResponse.json({
      success: true,
      data: feed,
    });
  } catch (error) {
    console.error('Home feed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home feed' },
      { status: 500 }
    );
  }
}
