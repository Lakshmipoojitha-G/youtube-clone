import { notFound } from "next/navigation";
import VideoPlayer from "@/components/video/VideoPlayer";
import LikeButtons from "@/components/video/LikeButtons";
import ShareDialog from "@/components/video/ShareDialog";
import RelatedVideos from "@/components/video/RelatedVideos";
import CommentSection from "@/components/comments/CommentSection";
import { getProgress, getRelatedVideos, getUserReaction, getVideo } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

export default function WatchPage({ params }: { params: { videoId: string } }) {
  const video = getVideo(params.videoId);
  if (!video) notFound();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_24rem]">
      <div>
        <VideoPlayer videoId={video.id} src={video.videoUrl} poster={video.thumbnailUrl} startAt={getProgress(video.id)} />
        <h1 className="mt-3 text-xl font-semibold">{video.title}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">{video.channelName}</p>
            <p className="text-sm text-gray-500">@{video.channelHandle}</p>
          </div>
          <div className="flex items-center gap-2">
            <LikeButtons videoId={video.id} likes={video.likes} dislikes={video.dislikes} initial={getUserReaction(video.id)} />
            <ShareDialog videoId={video.id} />
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-gray-100 p-3 text-sm text-black">
          <p className="font-medium">{video.views.toLocaleString()} views</p>
          <p className="mt-1">{video.description}</p>
        </div>
        <CommentSection videoId={video.id} />
      </div>
      <RelatedVideos videos={getRelatedVideos(video.id)} />
    </main>
  );
}
