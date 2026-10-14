import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import path from "path";
import { studioDb } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";

type Ctx = { params: Promise<{ id: string }> };

const EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const v = studioDb.videos.get(id);
  if (!v || v.ownerId !== (await getOwnerId())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!req.body) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = EXT[req.headers.get("content-type") ?? ""] ?? "mp4";
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${id}.${ext}`;

  await pipeline(Readable.fromWeb(req.body as never), createWriteStream(path.join(dir, name)));

  studioDb.videos.set(id, {
    ...v,
    status: "ready",
    videoUrl: `/uploads/${name}`,
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}