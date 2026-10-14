import Link from "next/link";
import type { Video } from "@/types/video";

export default function RelatedVideos({ videos }: { videos: Video[] }) {
  return (
    <aside className="flex flex-col gap-3">
      {videos.map((v) => (
        <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.thumbnailUrl} alt={v.title} className="aspect-video w-40 rounded-lg bg-gray-200 object-cover" />
          <div className="text-sm">
            <p className="line-clamp-2 font-medium">{v.title}</p>
            <p className="text-gray-500">{v.channelName}</p>
            <p className="text-gray-500">{v.views.toLocaleString()} views</p>
          </div>
        </Link>
      ))}
    </aside>
  );
}
