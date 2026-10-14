// src/components/organisms/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, PlaySquare, History, ThumbsUp, ListVideo, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/subscriptions", label: "Subscriptions", icon: PlaySquare },
];

const libraryItems = [
  { href: "/history", label: "History", icon: History },
  { href: "/liked", label: "Liked videos", icon: ThumbsUp },
  { href: "/playlists", label: "Playlists", icon: ListVideo },
];

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <aside className="flex flex-col items-center gap-1 py-2 w-16 bg-gray-950 border-r border-gray-800 min-h-screen">
        {[...navItems, ...libraryItems].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              "flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] text-gray-400 hover:bg-gray-800 transition w-14",
              pathname === href && "bg-gray-800 text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {label.split(" ")[0]}
          </Link>
        ))}
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-60 bg-gray-950 border-r border-gray-800 min-h-screen py-2 px-2 overflow-y-auto">
      <nav className="space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            id={`sidebar-${label.toLowerCase()}`}
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition",
              pathname === href && "bg-gray-800 text-white font-semibold"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</div>
      <nav className="space-y-0.5">
        {libraryItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            id={`sidebar-${label.replace(" ", "-").toLowerCase()}`}
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition",
              pathname === href && "bg-gray-800 text-white font-semibold"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">More</div>
      <nav>
        <Link href="/settings" id="sidebar-settings" className="flex items-center gap-4 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition">
          <Settings className="h-5 w-5" /> Settings
        </Link>
      </nav>
    </aside>
  );
}
