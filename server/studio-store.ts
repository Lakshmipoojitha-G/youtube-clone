import fs from "fs";
import path from "path";
import type { StudioVideo } from "@/types/studio";

const FILE = path.join(process.cwd(), "data", "studio-db.json");

type Db = {
  videos: Map<string, StudioVideo>;
  views: Map<string, Map<string, number>>; // videoId -> "YYYY-MM-DD" -> count
};

// Maps that save to disk whenever they change
class SavingMap<V> extends Map<string, V> {
  set(key: string, value: V) {
    super.set(key, value);
    save();
    return this;
  }
  delete(key: string) {
    const removed = super.delete(key);
    save();
    return removed;
  }
}

function save() {
  try {
    const g = globalThis as unknown as { __studioDb?: Db };
    const db = g.__studioDb;
    if (!db) return;
    const data = {
      videos: Object.fromEntries(db.videos),
      views: Object.fromEntries([...db.views].map(([id, days]) => [id, Object.fromEntries(days)])),
    };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[studio-store] save failed", err);
  }
}

function load(): Db {
  const videos = new SavingMap<StudioVideo>();
  const views = new SavingMap<Map<string, number>>();
  try {
    if (fs.existsSync(FILE)) {
      const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
      // Map.prototype.set skips saving while loading
      for (const [id, v] of Object.entries<StudioVideo>(raw.videos ?? {})) Map.prototype.set.call(videos, id, v);
      for (const [id, days] of Object.entries<Record<string, number>>(raw.views ?? {})) {
        Map.prototype.set.call(views, id, new Map(Object.entries(days)));
      }
    }
  } catch (err) {
    console.error("[studio-store] load failed", err);
  }
  return { videos, views };
}

const g = globalThis as unknown as { __studioDb?: Db };
export const studioDb: Db = (g.__studioDb ??= load());

export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export function recordStudioView(videoId: string) {
  const v = studioDb.videos.get(videoId);
  if (!v || v.visibility === "private") return;

  const days = studioDb.views.get(videoId) ?? new Map<string, number>();
  const k = dayKey();
  days.set(k, (days.get(k) ?? 0) + 1);
  studioDb.views.set(videoId, days);
  studioDb.videos.set(videoId, { ...v, views: v.views + 1 });
}