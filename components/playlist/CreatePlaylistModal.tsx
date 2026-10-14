'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Lock, Globe, Link as LinkIcon } from 'lucide-react';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistOpen, closeCreatePlaylistModal, createPlaylist } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPlaylist(title.trim(), description.trim(), privacy);
      setTitle('');
      setDescription('');
      closeCreatePlaylistModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeCreatePlaylistModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', maxWidth: '420px', borderRadius: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Create New Playlist</h3>
          <button onClick={closeCreatePlaylistModal} style={{ color: '#aaa', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>
              Title (required)
            </label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Best Next.js Tutorials"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '14px',
                color: '#fff',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add an optional description for this playlist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '14px',
                color: '#fff',
                resize: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>
              Privacy Setting
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as 'public' | 'private' | 'unlisted')}
              style={{
                width: '100%',
                backgroundColor: '#2b2b2b',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '14px',
                color: '#fff',
              }}
            >
              <option value="public">Public – Anyone can search and view</option>
              <option value="unlisted">Unlisted – Anyone with the link can view</option>
              <option value="private">Private – Only you can view</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={closeCreatePlaylistModal}
              style={{ padding: '8px 16px', color: '#aaa', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              style={{
                padding: '8px 20px',
                backgroundColor: '#3ea6ff',
                color: '#000',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                opacity: !title.trim() || isSubmitting ? 0.5 : 1,
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
