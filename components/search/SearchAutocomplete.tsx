'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, History, Mic, ArrowUpLeft } from 'lucide-react';

interface SearchAutocompleteProps {
  initialQuery?: string;
  onSearchSubmit?: (query: string) => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  initialQuery = '',
  onSearchSubmit,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with initialQuery prop if it changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yt_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('yt_recent_searches', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, searchTerm: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== searchTerm);
    setRecentSearches(updated);
    try {
      localStorage.setItem('yt_recent_searches', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleExecuteSearch = (targetQuery: string) => {
    const clean = targetQuery.trim();
    if (!clean) return;

    saveRecentSearch(clean);
    setIsOpen(false);
    inputRef.current?.blur();

    if (onSearchSubmit) {
      onSearchSubmit(clean);
    } else {
      router.push(`/results?search_query=${encodeURIComponent(clean)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && displayedList[selectedIndex]) {
      handleExecuteSearch(displayedList[selectedIndex]);
    } else {
      handleExecuteSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < displayedList.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayedList.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Voice Search Mock
  const triggerVoiceSearch = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      const mockPhrases = ['Next.js 15 full course', 'Lofi hip hop beats', 'React 19 updates'];
      const sample = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setQuery(sample);
      setIsVoiceListening(false);
      handleExecuteSearch(sample);
    }, 2000);
  };

  // Decide what to show in dropdown
  const displayedList = query.trim() ? suggestions : recentSearches;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Search Input Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#121212',
            border: `1px solid ${isOpen ? '#1c62b9' : 'rgba(255, 255, 255, 0.2)'}`,
            borderRadius: '40px 0 0 40px',
            padding: '0 16px',
            height: '40px',
            boxShadow: isOpen ? 'inset 0 1px 2px rgba(0,0,0,0.4)' : 'none',
            transition: 'border-color 0.2s',
          }}
        >
          {isOpen && (
            <Search size={18} color="#aaa" style={{ marginRight: '10px', flexShrink: 0 }} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            style={{
              width: '100%',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              style={{ padding: '4px', color: '#aaa', borderRadius: '50%' }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          style={{
            height: '40px',
            width: '64px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderLeft: 'none',
            borderRadius: '0 40px 40px 0',
            color: '#fff',
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          title="Search"
        >
          <Search size={19} />
        </button>

        {/* Mic / Voice Search Button */}
        <button
          type="button"
          onClick={triggerVoiceSearch}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isVoiceListening ? '#ff0033' : 'rgba(255, 255, 255, 0.08)',
            marginLeft: '12px',
            color: '#fff',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          title={isVoiceListening ? 'Listening...' : 'Search with your voice'}
        >
          <Mic size={18} />
        </button>
      </form>

      {/* Dropdown Suggestions Menu */}
      {isOpen && displayedList.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '46px',
            left: 0,
            right: 0,
            backgroundColor: '#212121',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000,
            padding: '8px 0',
            overflow: 'hidden',
          }}
        >
          {displayedList.map((item, idx) => {
            const isRecent = !query.trim();
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={`${item}-${idx}`}
                onClick={() => handleExecuteSearch(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: isRecent ? '#c2a1ff' : '#f1f1f1',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background-color 0.1s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent')}
              >
                {isRecent ? (
                  <History size={17} color="#aaa" style={{ marginRight: '14px', flexShrink: 0 }} />
                ) : (
                  <Search size={17} color="#aaa" style={{ marginRight: '14px', flexShrink: 0 }} />
                )}

                <span style={{ flex: 1, color: isRecent ? '#d4bbfb' : '#f1f1f1' }}>{item}</span>

                {isRecent ? (
                  <button
                    onClick={(e) => removeRecentSearch(e, item)}
                    style={{
                      fontSize: '12px',
                      color: '#3ea6ff',
                      padding: '4px',
                    }}
                    title="Remove from history"
                  >
                    Delete
                  </button>
                ) : (
                  <ArrowUpLeft size={16} color="#777" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Voice listening modal overlay */}
      {isVoiceListening && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ padding: '32px', textAlign: 'center', maxWidth: '360px' }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ff0033',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                animation: 'pulse 1.2s infinite',
              }}
            >
              <Mic size={36} color="#fff" />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Listening...</h3>
            <p style={{ color: '#aaa', fontSize: '13px' }}>Try saying &ldquo;Next.js 15&rdquo; or &ldquo;Lofi beats&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
};
