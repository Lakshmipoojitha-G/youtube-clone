import { NextResponse } from "next/server";
import { getProgress, getUserReaction, getVideo } from "@/server/video-engagement.service";

export async function GET(_req: Request, { params }: { params: { videoId: string } }) {
  const video = getVideo(params.videoId);
  if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
  return NextResponse.json({
    video,
    reaction: getUserReaction(video.id),
    progress: getProgress(video.id),
  });
}
