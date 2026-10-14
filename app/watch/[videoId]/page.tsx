import { notFound } from "next/navigation";
import VideoPlayer from "@/components/video/VideoPlayer";
import LikeButtons from "@/components/video/LikeButtons";
import ShareDialog from "@/components/video/ShareDialog";
import RelatedVideos from "@/components/video/RelatedVideos";
import CommentSection from "@/components/comments/CommentSection";
import { getProgress, getRelatedVideos, getUserReaction, getVideo } from "@/server/video-engagement.service";

export const dynamic = "force-dynamic";

interface WatchPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { videoId } = await params;
  const video = getVideo(videoId);
  if (!video) notFound();

  return (
    <main className="watch-page-container" style={{ color: '#fff' }}>
      <div>
        <VideoPlayer videoId={video.id} src={video.videoUrl} poster={video.thumbnailUrl} startAt={getProgress(video.id)} />
        <h1 className="mt-4 text-xl font-bold tracking-tight text-white">{video.title}</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-orange-600 font-bold text-white shadow">
              {video.channelName[0]}
            </div>
            <div>
              <p className="font-semibold text-white leading-tight">{video.channelName}</p>
              <p className="text-xs text-neutral-400">@{video.channelHandle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LikeButtons videoId={video.id} likes={video.likes} dislikes={video.dislikes} initial={getUserReaction(video.id)} />
            <ShareDialog videoId={video.id} />
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-neutral-900 border border-white/10 p-4 text-sm text-neutral-200">
          <p className="font-semibold text-white">{video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}</p>
          <p className="mt-2 whitespace-pre-line text-neutral-300 leading-relaxed">{video.description}</p>
        </div>
        <CommentSection videoId={video.id} />
      </div>
      <RelatedVideos videos={getRelatedVideos(video.id)} />
    </main>
  );
}
