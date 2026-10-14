import { NextResponse } from "next/server";
import { studioDb } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";

export async function GET() {
  const owner = await getOwnerId();
  const videos = [...studioDb.videos.values()]
    .filter((v) => v.ownerId === owner)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ videos });
}
