import { NextResponse } from "next/server";
import { deleteComment } from "@/server/comment.service";

export async function DELETE(_req: Request, { params }: { params: { commentId: string } }) {
  if (!deleteComment(params.commentId)) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
