import { NextResponse } from "next/server";
import { progressSchema } from "@/validators/comment";
import { getVideo, saveProgress } from "@/server/video-engagement.service";

export async function POST(req: Request, { params }: { params: { videoId: string } }) {
  const parsed = progressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (!getVideo(params.videoId)) return NextResponse.json({ error: "Video not found" }, { status: 404 });
  saveProgress(params.videoId, parsed.data.seconds);
  return NextResponse.json({ ok: true });
}
