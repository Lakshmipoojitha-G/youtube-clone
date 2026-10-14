'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        backgroundColor: '#282828',
        color: '#f1f1f1',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 2000,
        fontSize: '14px',
        fontWeight: 500,
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'slideUp 0.2s ease-out',
      }}
    >
      <CheckCircle2 size={18} color="#3ea6ff" />
      <span>{toastMessage}</span>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
