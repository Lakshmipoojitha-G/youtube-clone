import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SaveToPlaylistModal } from '@/components/playlist/SaveToPlaylistModal';
import { CreatePlaylistModal } from '@/components/playlist/CreatePlaylistModal';
import { Toast } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'YouTube – Discovery, Search & Playlists',
  description: 'Full-featured Next.js YouTube clone with infinite scroll feed, search filters, autocomplete, trending, and playlists management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="app-container">
            <Suspense fallback={<header style={{ height: 'var(--header-height)', backgroundColor: '#0f0f0f' }} />}>
              <Header />
            </Suspense>
            <div className="main-body">
              <Suspense fallback={<aside style={{ width: 'var(--sidebar-width)', backgroundColor: '#0f0f0f' }} />}>
                <Sidebar />
              </Suspense>
              <main className="content-area">
                <Suspense fallback={<div style={{ padding: '24px', color: '#aaa' }}>Loading content...</div>}>
                  {children}
                </Suspense>
              </main>
            </div>
            <SaveToPlaylistModal />
            <CreatePlaylistModal />
            <Toast />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
