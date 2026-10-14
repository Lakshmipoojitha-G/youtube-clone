"use client";

import { useState } from "react";

export default function ShareDialog({ videoId }: { videoId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "" : `${window.location.origin}/watch/${videoId}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition">
        ↗ Share
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[#212121] border border-white/10 p-6 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Share Video</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-neutral-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex gap-2">
              <input readOnly value={url} className="flex-1 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none" />
              <button onClick={copy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
