// src/components/organisms/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Moon, Sun, Upload, User, LogOut, Settings, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import Avatar from "@/src/components/atoms/Avatar";
import SearchBar from "@/src/components/molecules/SearchBar";
import NotificationBell from "@/src/components/molecules/NotificationBell";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800 gap-4">
      {/* Left – hamburger + logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button id="sidebar-toggle" onClick={onMenuClick} className="p-2 rounded-full hover:bg-gray-800 transition">
          <Menu className="h-5 w-5 text-gray-300" />
        </button>
        <Link href="/" className="flex items-center gap-1" id="home-logo">
          <svg viewBox="0 0 90 20" className="h-7 w-auto" aria-label="MyTube">
            <path fill="#FF0000" d="M25.9 3.3A3.26 3.26 0 0 0 23.6.9C21.5.4 13.6.4 13.6.4S5.7.4 3.6.9A3.26 3.26 0 0 0 1.3 3.3C.8 5.4.8 9.8.8 9.8s0 4.4.5 6.5a3.26 3.26 0 0 0 2.3 2.4c2.1.5 10 .5 10 .5s7.9 0 10-.5a3.26 3.26 0 0 0 2.3-2.4c.5-2.1.5-6.5.5-6.5s0-4.4-.5-6.5z"/>
            <polygon fill="#fff" points="11,6.5 17.2,9.8 11,13.1"/>
            <text x="30" y="15" fontSize="13" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">MyTube</text>
          </svg>
        </Link>
      </div>

      {/* Centre – search */}
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>

      {/* Right – actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* dark mode toggle */}
        <button
          id="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-300" />}
        </button>

        {session?.user ? (
          <>
            <Link href="/studio" id="upload-btn" className="flex items-center gap-1.5 rounded-full border border-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-800 transition">
              <Upload className="h-4 w-4" /> Create
            </Link>
            <NotificationBell />
            {/* user avatar / menu */}
            <div className="relative">
              <button id="user-menu-btn" onClick={() => setUserMenuOpen(v => !v)} className="flex items-center">
                <Avatar src={session.user.image} alt={session.user.name ?? "User"} size={32} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-semibold text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.email}</p>
                  </div>
                  <ul className="py-1 text-sm">
                    <li>
                      <Link href="/profile" id="nav-profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-800">
                        <User className="h-4 w-4" /> Your channel
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" id="nav-settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-800">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        id="nav-signout"
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-800"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            id="signin-link"
            href="/auth/signin"
            className="flex items-center gap-1.5 rounded-full border border-gray-600 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-950 transition"
          >
            <User className="h-4 w-4" /> Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
