"use client";
import { useCallback, useEffect, useState } from "react";
import type { StudioVideo } from "@/types/studio";
import { useStudio } from "./StudioContext";

export type Analytics = {
  days: number;
  series: { date: string; views: number; watchHours: number }[];
  views: number; viewsChange: number;
  watchHours: number; watchChange: number;
  subscribers: number;
  totalViews: number; totalVideos: number;
};

export function useStudioData(days = 28) {
  const { refreshKey } = useStudio();
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const load = useCallback(async () => {
    const [v, a] = await Promise.all([
      fetch("/api/studio/videos").then((r) => r.json()),
      fetch(`/api/studio/analytics?days=${days}`).then((r) => r.json()),
    ]);
    setVideos(v.videos);
    setAnalytics(a);
  }, [days]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const pending = videos.some((v) => v.status === "uploading" || v.status === "processing");
  useEffect(() => {
    if (!pending) return;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [pending, load]);

  return { videos, analytics, reload: load };
}