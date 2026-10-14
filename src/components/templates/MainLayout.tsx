// src/components/templates/MainLayout.tsx
"use client";
import { useState } from "react";
import Navbar from "@/src/components/organisms/Navbar";
import Sidebar from "@/src/components/organisms/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarCollapsed(v => !v)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
