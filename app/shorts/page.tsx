'use client';

import React from 'react';
import { RecommendationService } from '@/server/recommendation.service';
import { ShortsPlayer } from '@/components/shorts/ShortsPlayer';

export default function ShortsPage() {
  const shorts = RecommendationService.getShorts();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ShortsPlayer shorts={shorts} />
    </div>
  );
}
