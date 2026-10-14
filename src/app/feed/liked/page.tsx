import Link from "next/link";
import { getLikedVideos } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

export default function LikedPage() {
  const videos = getLikedVideos();
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Liked videos</h1>
      {videos.length === 0 && <p className="text-gray-500">No liked videos yet.</p>}
      <div className="flex flex-col gap-4">
        {videos.map((v) => (
          <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.thumbnailUrl} alt={v.title} className="aspect-video w-48 rounded-lg object-cover" />
            <div>
              <p className="font-medium">{v.title}</p>
              <p className="text-sm text-gray-500">
                {v.channelName} • {v.views.toLocaleString()} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
