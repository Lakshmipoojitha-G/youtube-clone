import Link from "next/link";
import type { Video } from "@/types/video";

export default function RelatedVideos({ videos }: { videos: Video[] }) {
  return (
    <aside className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-white/90 mb-1">Related Videos</h2>
      {videos.map((v) => (
        <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-2 group transition p-1.5 rounded-lg hover:bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.thumbnailUrl} alt={v.title} className="aspect-video w-40 rounded-lg bg-neutral-800 object-cover shrink-0 group-hover:scale-[1.02] transition-transform" />
          <div className="text-sm min-w-0">
            <p className="line-clamp-2 font-medium text-white/90 group-hover:text-white">{v.title}</p>
            <p className="text-xs text-neutral-400 mt-1 truncate">{v.channelName}</p>
            <p className="text-xs text-neutral-400">{v.views.toLocaleString()} views</p>
          </div>
        </Link>
      ))}
    </aside>
  );
}
