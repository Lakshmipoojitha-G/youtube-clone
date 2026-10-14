"use client";
import { useState } from "react";
import { useStudioData } from "@/components/studio/useStudioData";
import ViewsChart from "@/components/studio/ViewsChart";
import { formatCount } from "@/components/studio/format";

export default function AnalyticsPage() {
  const [days, setDays] = useState(28);
  const { videos, analytics } = useStudioData(days);
  const top = [...videos].sort((a, b) => b.views - a.views).slice(0, 8);
  const max = Math.max(1, ...top.map((v) => v.views));

  return (
    <div className="ys-page">
      <div className="ys-page-head">
        <h1 className="ys-h1">Channel analytics</h1>
        <div className="ys-range">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={28}>Last 28 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <section className="ys-card">
        <p className="ys-muted">Views</p>
        <p className="ys-stat-value">{formatCount(analytics?.views ?? 0)}</p>
        {analytics && <ViewsChart series={analytics.series} height={320} />}
      </section>

      <section className="ys-card">
        <h2 className="ys-h2">Top videos</h2>
        {top.length === 0 && <p className="ys-empty">No data yet.</p>}
        {top.map((v) => (
          <div key={v.id} className="ys-topvideo">
            <span className="ys-topvideo-title">{v.title}</span>
            <div className="ys-topvideo-bar"><div style={{ width: `${(v.views / max) * 100}%` }} /></div>
            <span>{v.views.toLocaleString()}</span>
          </div>
        ))}
      </section>
    </div>
  );
}