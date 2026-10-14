import { NextResponse } from "next/server";
import { mux, muxThumb } from "@/lib/mux";
import { studioDb } from "@/server/studio-store";

export async function POST(req: Request) {
  const body = await req.text(); // raw body is required for signature check
  let event;
  try {
    event = mux.webhooks.unwrap(body, req.headers);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const touch = (id: string, patch: object) => {
    const v = studioDb.videos.get(id);
    if (v) studioDb.videos.set(id, { ...v, ...patch, updatedAt: new Date().toISOString() });
  };

  switch (event.type) {
    case "video.upload.asset_created": {
      const v = [...studioDb.videos.values()].find((x) => x.muxUploadId === event.data.id);
      if (v) touch(v.id, { status: "processing", muxAssetId: event.data.asset_id });
      break;
    }
    case "video.asset.ready": {
      const id = event.data.passthrough as string;
      const playbackId = event.data.playback_ids?.[0]?.id;
      const v = studioDb.videos.get(id);
      if (v && playbackId) {
        touch(id, {
          status: "ready",
          playbackId,
          durationSec: Math.round(event.data.duration ?? 0),
          thumbnailUrl: v.thumbnailUrl ?? muxThumb(playbackId), // keep custom thumbnail if set
        });
      }
      break;
    }
    case "video.asset.errored": {
      const id = event.data.passthrough as string;
      if (id) touch(id, { status: "errored" });
      break;
    }
  }
  return NextResponse.json({ ok: true });
}