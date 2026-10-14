import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/server/recommendation.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const filter = (searchParams.get('filter') as 'latest' | 'today' | 'unwatched') || 'latest';

    const subFeed = RecommendationService.getSubscriptionsFeed(cursor, limit, filter);
    const channels = RecommendationService.getSubscribedChannels();

    return NextResponse.json({
      success: true,
      data: subFeed,
      channels,
    });
  } catch (error) {
    console.error('Subscriptions feed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions feed' },
      { status: 500 }
    );
  }
}
