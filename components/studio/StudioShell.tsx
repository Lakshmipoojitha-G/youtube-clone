"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, Search, CircleHelp, Plus, Bell, Clapperboard, LayoutDashboard, PlaySquare, BarChart2,
  MessageSquare, Captions, Copyright, DollarSign, Wand2, Music, Settings, MessageSquarePlus, ArrowLeft,
} from "lucide-react";
import { useStudio } from "./StudioContext";

const NAV = [
  { label: "Dashboard", href: "/studio", icon: LayoutDashboard },
  { label: "Content", href: "/studio/content", icon: PlaySquare },
  { label: "Analytics", href: "/studio/analytics", icon: BarChart2 },
  { label: "Comments", icon: MessageSquare },
  { label: "Subtitles", icon: Captions },
  { label: "Copyright", icon: Copyright },
  { label: "Earn", icon: DollarSign },
  { label: "Customization", icon: Wand2 },
  { label: "Audio library", icon: Music },
];

export default function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { openUpload } = useStudio();
  const [collapsed, setCollapsed] = useState(false);

  // restore the last state
  useEffect(() => {
    try {
      if (localStorage.getItem("studio-sidebar-collapsed") === "1") setCollapsed(true);
    } catch {}
  }, []);

  function toggle() {
    setCollapsed((c) => {
      try { localStorage.setItem("studio-sidebar-collapsed", c ? "0" : "1"); } catch {}
      return !c;
    });
  }

  return (
    <div className="ys-shell">
      <header className="ys-header">
        <button className="ys-icon-btn" onClick={toggle} aria-label="Toggle sidebar" title="Toggle sidebar">
          <Menu size={22} />
        </button>
        <Link href="/studio" className="ys-logo">
          <span className="ys-logo-badge"><Clapperboard size={16} /></span>
          Studio
        </Link>
        <div className="ys-search">
          <Search size={18} color="#aaa" />
          <input placeholder="Search across your channel" />
        </div>
        <div className="ys-header-right">
          <button className="ys-icon-btn" title="Help"><CircleHelp size={22} /></button>
          <button className="ys-create" onClick={openUpload}><Plus size={20} /> Create</button>
          <button className="ys-icon-btn" title="Notifications"><Bell size={22} /></button>
          <div className="ys-avatar sm">Y</div>
        </div>
      </header>

      <div className="ys-body">
        <aside className={`ys-sidebar${collapsed ? " collapsed" : ""}`}>
          <div className="ys-profile">
            <div className="ys-avatar lg">Y</div>
            <p className="ys-profile-name">Your Channel</p>
            <p className="ys-muted">@yourchannel</p>
          </div>

          <nav className="ys-nav">
            {NAV.map((item) => {
              const Icon = item.icon;
              if (!item.href) {
                return (
                  <span key={item.label} className="ys-nav-item disabled" title={`${item.label} (coming soon)`}>
                    <Icon size={22} /> <span className="ys-nav-label">{item.label}</span>
                  </span>
                );
              }
              const active = item.href === "/studio" ? pathname === "/studio" : pathname.startsWith(item.href);
              return (
                <Link key={item.label} href={item.href} title={item.label}
                  className={`ys-nav-item${active ? " active" : ""}`}>
                  <Icon size={22} /> <span className="ys-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ys-nav ys-nav-bottom">
            <Link href="/" className="ys-nav-item" title="Back to YouTube">
              <ArrowLeft size={22} /> <span className="ys-nav-label">Back to YouTube</span>
            </Link>
            <span className="ys-nav-item disabled" title="Settings">
              <Settings size={22} /> <span className="ys-nav-label">Settings</span>
            </span>
            <span className="ys-nav-item disabled" title="Send feedback">
              <MessageSquarePlus size={22} /> <span className="ys-nav-label">Send feedback</span>
            </span>
          </div>
        </aside>

        <main className="ys-main">{children}</main>
      </div>
    </div>
  );
}