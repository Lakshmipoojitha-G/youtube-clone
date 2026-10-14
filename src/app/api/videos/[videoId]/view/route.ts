import { NextResponse } from "next/server";
import { registerView } from "@/server/video-engagement.service";

export async function POST(req: Request, { params }: { params: { videoId: string } }) {
  const viewer = req.headers.get("x-forwarded-for") ?? "local";
  const result = registerView(params.videoId, viewer);
  if (!result) return NextResponse.json({ error: "Video not found" }, { status: 404 });
  return NextResponse.json(result);
}
