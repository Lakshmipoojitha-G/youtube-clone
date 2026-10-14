import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { studioDb } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";
import { createVideoSchema } from "@/validators/studio";

const hasMux = Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);

export async function POST(req: Request) {
  try {
    const parsed = createVideoSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the title, tags and other fields" }, { status: 400 });
    }

    const id = randomUUID();
    let uploadUrl: string;
    let muxUploadId: string | undefined;

    if (hasMux) {
      const { mux } = await import("@/lib/mux"); // loaded only when keys exist
      const upload = await mux.video.uploads.create({
        cors_origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        new_asset_settings: { playback_policy: ["public"], passthrough: id },
      });
      uploadUrl = upload.url;
      muxUploadId = upload.id;
    } else {
      uploadUrl = `/api/studio/videos/${id}/file`; // dev mode: save locally
    }

    const now = new Date().toISOString();
    studioDb.videos.set(id, {
      id,
      ownerId: await getOwnerId(),
      ...parsed.data,
      status: "uploading",
      muxUploadId,
      views: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ videoId: id, uploadUrl, mode: hasMux ? "mux" : "local" });
  } catch (err) {
    console.error("[studio/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}