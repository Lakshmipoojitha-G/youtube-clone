'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Plus, Globe, Lock, Link as LinkIcon, Check } from 'lucide-react';

export const SaveToPlaylistModal: React.FC = () => {
  const {
    saveToPlaylistVideo,
    closeSaveModal,
    playlists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    createPlaylist,
  } = useApp();

  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrivacy, setNewPrivacy] = useState<'public' | 'private' | 'unlisted'>('private');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!saveToPlaylistVideo) return null;

  const handleToggle = async (playlistId: string, isChecked: boolean) => {
    if (isChecked) {
      await removeVideoFromPlaylist(playlistId, saveToPlaylistVideo.id);
    } else {
      await addVideoToPlaylist(playlistId, saveToPlaylistVideo.id);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPlaylist(newTitle.trim(), '', newPrivacy, saveToPlaylistVideo.id);
      setNewTitle('');
      setIsCreatingInline(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPrivacyIcon = (privacy: string) => {
    if (privacy === 'public') return <Globe size={14} color="#888" />;
    if (privacy === 'unlisted') return <LinkIcon size={14} color="#888" />;
    return <Lock size={14} color="#888" />;
  };

  return (
    <div className="modal-overlay" onClick={closeSaveModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '360px',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '12px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f1f1' }}>Save video to...</h3>
          <button
            onClick={closeSaveModal}
            style={{ padding: '4px', color: '#aaa', borderRadius: '50%' }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Playlists Checkbox List */}
        <div
          style={{
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {playlists.map((pl) => {
            const isChecked = pl.videoIds.includes(saveToPlaylistVideo.id);

            return (
              <label
                key={pl.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Custom Checkbox */}
                <div
                  onClick={() => handleToggle(pl.id, isChecked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: `2px solid ${isChecked ? '#3ea6ff' : '#888'}`,
                    backgroundColor: isChecked ? '#3ea6ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isChecked && <Check size={14} color="#000" strokeWidth={3} />}
                </div>

                <div
                  onClick={() => handleToggle(pl.id, isChecked)}
                  style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#f1f1f1',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pl.title}
                  </span>
                  <div style={{ marginLeft: '8px', flexShrink: 0 }}>
                    {renderPrivacyIcon(pl.privacy)}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Inline Create Playlist Toggle / Form */}
        {!isCreatingInline ? (
          <button
            onClick={() => setIsCreatingInline(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 0 4px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              color: '#3ea6ff',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <Plus size={18} />
            <span>Create new playlist</span>
          </button>
        ) : (
          <form
            onSubmit={handleCreateNew}
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '14px',
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
                Name
              </label>
              <input
                type="text"
                required
                maxLength={80}
                placeholder="Enter playlist title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#fff',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
                Privacy
              </label>
              <select
                value={newPrivacy}
                onChange={(e) => setNewPrivacy(e.target.value as 'public' | 'private' | 'unlisted')}
                style={{
                  width: '100%',
                  backgroundColor: '#2b2b2b',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#fff',
                }}
              >
                <option value="private">Private (Only you can view)</option>
                <option value="unlisted">Unlisted (Anyone with link)</option>
                <option value="public">Public (Anyone can search)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsCreatingInline(false)}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  color: '#aaa',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim() || isSubmitting}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#3ea6ff',
                  color: '#000',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  opacity: !newTitle.trim() || isSubmitting ? 0.5 : 1,
                }}
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
