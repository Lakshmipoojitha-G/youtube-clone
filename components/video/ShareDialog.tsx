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
      <button onClick={() => setOpen(true)} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
        ↗ Share
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-black" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Share</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="flex gap-2">
              <input readOnly value={url} className="flex-1 rounded border px-3 py-2 text-sm" />
              <button onClick={copy} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
