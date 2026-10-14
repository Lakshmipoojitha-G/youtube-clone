// src/components/molecules/NotificationBell.tsx
"use client";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => (r.ok ? r.json() : []))
      .then(setNotifications)
      .catch(() => {});
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  }

  return (
    <div className="relative">
      <button
        id="notifications-bell"
        onClick={() => { setOpen(v => !v); if (!open && unread) markAllRead(); }}
        className="relative p-2 rounded-full hover:bg-gray-800 transition"
      >
        <Bell className="h-5 w-5 text-gray-300" />
        {unread > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700 font-semibold text-white text-sm">Notifications</div>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">No notifications</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-800">
              {notifications.map(n => (
                <li key={n.id} className={`px-4 py-3 text-sm ${n.read ? "text-gray-400" : "text-white font-medium"}`}>
                  <p>{n.title}</p>
                  {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
