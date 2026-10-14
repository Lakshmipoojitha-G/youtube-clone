import { NextResponse } from "next/server";
import { studioDb, dayKey } from "@/server/studio-store";
import { getOwnerId } from "@/lib/studio-auth";

export async function GET(req: Request) {
  const owner = await getOwnerId();
  const days = Math.min(90, Math.max(7, Number(new URL(req.url).searchParams.get("days") ?? 28)));
  const mine = [...studioDb.videos.values()].filter((v) => v.ownerId === owner);

  // daily views + watch hours for the previous period and the current period
  const all = Array.from({ length: days * 2 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days * 2 - 1 - i));
    const k = dayKey(d);
    let views = 0, watchSec = 0;
    for (const v of mine) {
      const c = studioDb.views.get(v.id)?.get(k) ?? 0;
      views += c;
      watchSec += c * (v.durationSec ?? 0);
    }
    return { date: k, views, watchHours: watchSec / 3600 };
  });

  const prev = all.slice(0, days);
  const series = all.slice(days);
  const sum = (a: typeof all, f: (x: (typeof all)[number]) => number) => a.reduce((s, x) => s + f(x), 0);
  const pct = (cur: number, prv: number) => (prv > 0 ? Math.round(((cur - prv) / prv) * 100) : cur > 0 ? 100 : 0);

  const views = sum(series, (x) => x.views);
  const watchHours = sum(series, (x) => x.watchHours);

  return NextResponse.json({
    days,
    series,
    views,
    viewsChange: pct(views, sum(prev, (x) => x.views)),
    watchHours,
    watchChange: pct(watchHours, sum(prev, (x) => x.watchHours)),
    subscribers: 0, // placeholder until you connect real subscriber counts
    totalViews: mine.reduce((s, v) => s + v.views, 0),
    totalVideos: mine.length,
  });
}