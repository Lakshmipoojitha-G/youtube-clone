import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./discovery.css";
import { AppProvider } from "@/context/AppContext";
import { SaveToPlaylistModal } from "@/components/playlist/SaveToPlaylistModal";
import { CreatePlaylistModal } from "@/components/playlist/CreatePlaylistModal";
import { Toast } from "@/components/ui/Toast";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import MainLayout from "@/src/components/templates/MainLayout";
import SessionProvider from "@/src/components/providers/SessionProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyTube – Watch, upload and share",
  description: "A YouTube‑like video platform built with Next.js, Prisma and PostgreSQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}>
        <SessionProvider>
          <ThemeProvider>
            <AppProvider>
              <MainLayout>{children}</MainLayout>
              <SaveToPlaylistModal />
              <CreatePlaylistModal />
              <Toast />
            </AppProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
