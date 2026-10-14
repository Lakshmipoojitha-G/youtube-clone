import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/search.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    const suggestions = SearchService.getSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
