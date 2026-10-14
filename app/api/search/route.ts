import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/search.service';
import { SearchFilters, UploadDateFilter, DurationFilter, SortByFilter, ContentTypeFilter } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search_query') || '';
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const filters: Partial<SearchFilters> = {
      uploadDate: (searchParams.get('uploadDate') as UploadDateFilter) || 'any',
      duration: (searchParams.get('duration') as DurationFilter) || 'any',
      sortBy: (searchParams.get('sortBy') as SortByFilter) || 'relevance',
      type: (searchParams.get('type') as ContentTypeFilter) || 'all',
    };

    const results = SearchService.search(query, filters, cursor, limit);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
