import { NextResponse } from "next/server";
import { toggleCommentLike } from "@/server/comment.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const result = toggleCommentLike(commentId);
  if (!result) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  return NextResponse.json(result);
}
