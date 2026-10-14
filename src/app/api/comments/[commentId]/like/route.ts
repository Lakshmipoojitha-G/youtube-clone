import { NextResponse } from "next/server";
import { toggleCommentLike } from "@/server/comment.service";

export async function POST(_req: Request, { params }: { params: { commentId: string } }) {
  const result = toggleCommentLike(params.commentId);
  if (!result) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  return NextResponse.json(result);
}
