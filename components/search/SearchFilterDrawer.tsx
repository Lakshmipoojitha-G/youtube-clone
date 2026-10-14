'use client';

import React, { useState } from 'react';
import { SearchFilters, UploadDateFilter, DurationFilter, SortByFilter, ContentTypeFilter } from '@/types';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface SearchFilterDrawerProps {
  filters: SearchFilters;
  onChange: (updated: SearchFilters) => void;
}

export const SearchFilterDrawer: React.FC<SearchFilterDrawerProps> = ({
  filters,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    filters.uploadDate !== 'any' ? 1 : 0,
    filters.duration !== 'any' ? 1 : 0,
    filters.sortBy !== 'relevance' ? 1 : 0,
    filters.type !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleReset = () => {
    onChange({
      uploadDate: 'any',
      duration: 'any',
      sortBy: 'relevance',
      type: 'all',
    });
  };

  const uploadDateOptions: { label: string; value: UploadDateFilter }[] = [
    { label: 'Any time', value: 'any' },
    { label: 'Last hour', value: 'hour' },
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
    { label: 'This month', value: 'month' },
    { label: 'This year', value: 'year' },
  ];

  const durationOptions: { label: string; value: DurationFilter }[] = [
    { label: 'Any duration', value: 'any' },
    { label: 'Under 4 minutes', value: 'short' },
    { label: '4 - 20 minutes', value: 'medium' },
    { label: 'Over 20 minutes', value: 'long' },
  ];

  const sortByOptions: { label: string; value: SortByFilter }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Upload date', value: 'date' },
    { label: 'View count', value: 'views' },
    { label: 'Rating', value: 'rating' },
  ];

  const typeOptions: { label: string; value: ContentTypeFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Video', value: 'video' },
    { label: 'Playlist', value: 'playlist' },
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Trigger Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
            padding: '8px 16px',
            borderRadius: '24px',
            color: '#f1f1f1',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'background 0.2s',
          }}
        >
          <SlidersHorizontal size={17} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span
              style={{
                backgroundColor: '#3ea6ff',
                color: '#000',
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            >
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#3ea6ff',
              padding: '6px 12px',
            }}
          >
            <RotateCcw size={14} /> Clear all
          </button>
        )}
      </div>

      {/* Expandable Options Drawer */}
      {isOpen && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '24px',
            padding: '24px 16px 16px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginTop: '12px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* UPLOAD DATE */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#aaa',
                letterSpacing: '0.6px',
                marginBottom: '14px',
                textTransform: 'uppercase',
              }}
            >
              Upload date
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {uploadDateOptions.map((opt) => {
                const isSelected = filters.uploadDate === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...filters, uploadDate: opt.value })}
                    style={{
                      justifyContent: 'flex-start',
                      fontSize: '13px',
                      color: isSelected ? '#fff' : '#aaa',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DURATION */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#aaa',
                letterSpacing: '0.6px',
                marginBottom: '14px',
                textTransform: 'uppercase',
              }}
            >
              Duration
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {durationOptions.map((opt) => {
                const isSelected = filters.duration === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...filters, duration: opt.value })}
                    style={{
                      justifyContent: 'flex-start',
                      fontSize: '13px',
                      color: isSelected ? '#fff' : '#aaa',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TYPE */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#aaa',
                letterSpacing: '0.6px',
                marginBottom: '14px',
                textTransform: 'uppercase',
              }}
            >
              Type
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {typeOptions.map((opt) => {
                const isSelected = filters.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...filters, type: opt.value })}
                    style={{
                      justifyContent: 'flex-start',
                      fontSize: '13px',
                      color: isSelected ? '#fff' : '#aaa',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SORT BY */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#aaa',
                letterSpacing: '0.6px',
                marginBottom: '14px',
                textTransform: 'uppercase',
              }}
            >
              Sort by
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortByOptions.map((opt) => {
                const isSelected = filters.sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...filters, sortBy: opt.value })}
                    style={{
                      justifyContent: 'flex-start',
                      fontSize: '13px',
                      color: isSelected ? '#fff' : '#aaa',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
