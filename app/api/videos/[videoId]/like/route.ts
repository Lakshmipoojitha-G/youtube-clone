import { NextResponse } from "next/server";
import { reactionSchema } from "@/validators/comment";
import { setReaction } from "@/server/video-engagement.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const parsed = reactionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const result = setReaction(videoId, parsed.data.reaction);
  if (!result) return NextResponse.json({ error: "Video not found" }, { status: 404 });
  return NextResponse.json(result);
}
