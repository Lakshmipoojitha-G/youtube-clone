import Link from "next/link";
import { getHistory } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const items = getHistory();
  return (
    <main className="mx-auto max-w-4xl p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">Watch History</h1>
      {items.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-8 text-center text-neutral-400">
          <p>No watch history yet. Start watching videos to see them appear here!</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {items.map(({ video, seconds }) => (
          <Link key={video.id} href={`/watch/${video.id}`} className="flex gap-4 group rounded-xl p-2 hover:bg-white/5 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-56 rounded-xl object-cover shrink-0 bg-neutral-800 group-hover:scale-[1.02] transition-transform" />
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-white group-hover:text-blue-400 text-base">{video.title}</p>
              <p className="text-sm text-neutral-400 mt-1">{video.channelName}</p>
              <p className="text-xs text-blue-400 mt-2 font-medium">
                Resume from {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
