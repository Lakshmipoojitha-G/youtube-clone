import { NextResponse } from "next/server";
import { registerView } from "@/server/video-engagement.service";
import { recordStudioView, studioDb } from "@/server/studio-store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const viewer = req.headers.get("x-forwarded-for") ?? "local";

  // Studio-uploaded videos: count the view for analytics
  const isStudioVideo = studioDb.videos.has(videoId);
  recordStudioView(videoId);

  // Existing (mock/seed) videos: your original logic
  const result = registerView(videoId, viewer);

  if (!result && !isStudioVideo) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(result ?? { ok: true });
}