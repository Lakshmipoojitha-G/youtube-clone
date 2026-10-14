import Link from "next/link";
import { getHistory } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const items = getHistory();
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Watch history</h1>
      {items.length === 0 && <p className="text-gray-500">Nothing watched yet.</p>}
      <div className="flex flex-col gap-4">
        {items.map(({ video, seconds }) => (
          <Link key={video.id} href={`/watch/${video.id}`} className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-48 rounded-lg object-cover" />
            <div>
              <p className="font-medium">{video.title}</p>
              <p className="text-sm text-gray-500">{video.channelName}</p>
              <p className="text-sm text-gray-500">
                Resume from {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
