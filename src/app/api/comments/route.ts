import { NextResponse } from "next/server";
import { createCommentSchema } from "@/validators/comment";
import { createComment, listComments } from "@/server/comment.service";

export async function GET(req: Request) {
  const videoId = new URL(req.url).searchParams.get("videoId");
  if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 });
  return NextResponse.json({ comments: listComments(videoId) });
}

export async function POST(req: Request) {
  const parsed = createCommentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  return NextResponse.json({ comment: createComment(parsed.data) }, { status: 201 });
}
