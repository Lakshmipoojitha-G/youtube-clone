import { NextResponse } from "next/server";
import { studioDb } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";
import { updateVideoSchema } from "@/validators/studio";

type Ctx = { params: Promise<{ id: string }> };

async function owned(id: string) {
  const v = studioDb.videos.get(id);
  return v && v.ownerId === (await getOwnerId()) ? v : null;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const v = await owned(id);
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = updateVideoSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = { ...v, ...parsed.data, updatedAt: new Date().toISOString() };
  studioDb.videos.set(id, updated);
  return NextResponse.json({ video: updated });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params;
  if (!(await owned(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  studioDb.videos.delete(id);
  studioDb.views.delete(id);
  return NextResponse.json({ ok: true });
}
