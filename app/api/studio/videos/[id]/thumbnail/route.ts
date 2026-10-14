import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { studioDb } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const v = studioDb.videos.get(id);
  if (!v || v.ownerId !== (await getOwnerId()))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return NextResponse.json({ error: "Use JPG, PNG or WebP" }, { status: 400 });
  if (file.size > 2 * 1024 * 1024)
    return NextResponse.json({ error: "Max 2MB" }, { status: 400 });

  const ext = file.type.split("/")[1];
  const dir = path.join(process.cwd(), "public", "thumbnails");
  await mkdir(dir, { recursive: true });
  const name = `${id}-${Date.now()}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  const updated = { ...v, thumbnailUrl: `/thumbnails/${name}`, updatedAt: new Date().toISOString() };
  studioDb.videos.set(id, updated);
  return NextResponse.json({ video: updated });
}
