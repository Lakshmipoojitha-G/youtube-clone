import Link from "next/link";
import { getLikedVideos } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

export default function LikedPage() {
  const videos = getLikedVideos();
  return (
    <main className="mx-auto max-w-4xl p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">Liked Videos</h1>
      {videos.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-8 text-center text-neutral-400">
          <p>No liked videos yet. Tap 👍 on any video to add it to your Liked videos!</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {videos.map((v) => (
          <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-4 group rounded-xl p-2 hover:bg-white/5 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.thumbnailUrl} alt={v.title} className="aspect-video w-56 rounded-xl object-cover shrink-0 bg-neutral-800 group-hover:scale-[1.02] transition-transform" />
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-white group-hover:text-blue-400 text-base">{v.title}</p>
              <p className="text-sm text-neutral-400 mt-1">
                {v.channelName} • {v.views.toLocaleString()} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
