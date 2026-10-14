"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Eye, Globe, Lightbulb, Lock, Link2, Users, DollarSign } from "lucide-react";
import { useStudio } from "@/components/studio/StudioContext";
import { useStudioData } from "@/components/studio/useStudioData";
import StatCard from "@/components/studio/StatCard";
import ViewsChart from "@/components/studio/ViewsChart";
import VideoTable from "@/components/studio/VideoTable";
import { formatCount, formatDuration, shortDate, timeAgo } from "@/components/studio/format";

export default function DashboardPage() {
  const [days, setDays] = useState(28);
  const { videos, analytics, reload } = useStudioData(days);
  const { openUpload } = useStudio();
  const latest = videos[0];
  const compare = `vs previous ${days} days`;
  const range = analytics
    ? `${shortDate(analytics.series[0].date)} – ${shortDate(analytics.series.at(-1)!.date)}, ${new Date().getFullYear()}`
    : "";
  const VisIcon = latest?.visibility === "public" ? Globe : latest?.visibility === "unlisted" ? Link2 : Lock;

  return (
    <div className="ys-page">
      <div className="ys-page-head">
        <div>
          <h1 className="ys-h1">Channel dashboard</h1>
          <p className="ys-muted">Here&apos;s what&apos;s happening with your channel</p>
        </div>
        <div className="ys-range">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={28}>Last 28 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <span className="ys-muted">{range}</span>
        </div>
      </div>

      <section className="ys-stats">
        <StatCard tint="blue" color="#3ea6ff" icon={<Eye size={22} />} label="Total views"
          value={formatCount(analytics?.views ?? 0)} change={analytics?.viewsChange} compareLabel={compare}
          spark={analytics?.series.map((s) => s.views) ?? []} />
        <StatCard tint="purple" color="#c026d3" icon={<Clock size={22} />} label="Watch time (hours)"
          value={(analytics?.watchHours ?? 0).toFixed(1)} change={analytics?.watchChange} compareLabel={compare}
          spark={analytics?.series.map((s) => s.watchHours) ?? []} />
        <StatCard tint="green" color="#22c55e" icon={<Users size={22} />} label="Subscribers"
          value={String(analytics?.subscribers ?? 0)} note="Coming soon" compareLabel={compare}
          spark={analytics?.series.map(() => 0) ?? []} />
        <StatCard tint="orange" color="#f59e0b" icon={<DollarSign size={22} />} label="Estimated revenue"
          value="—" note="Not monetized" compareLabel={compare}
          spark={analytics?.series.map(() => 0) ?? []} />
      </section>

      <div className="ys-grid">
        <div className="ys-left">
          <div className="ys-row2">
            <section className="ys-card">
              <h2 className="ys-h2">Latest video performance</h2>
              {latest ? (
                <div className="ys-latest">
                  <div className="ys-latest-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {latest.thumbnailUrl && <img src={latest.thumbnailUrl} alt="" />}
                    {latest.durationSec ? <span className="ys-dur">{formatDuration(latest.durationSec)}</span> : null}
                  </div>
                  <div className="ys-latest-info">
                    <h3 className="ys-latest-title">{latest.title}</h3>
                    <p className="ys-muted">Published {timeAgo(latest.createdAt)}</p>
                    <div className="ys-latest-metrics">
                      <div><Eye size={16} /> <b>{formatCount(latest.views)}</b><span className="ys-muted">Views</span></div>
                      <div><Clock size={16} /> <b>{formatDuration(latest.durationSec ?? 0)}</b><span className="ys-muted">Duration</span></div>
                      <div><VisIcon size={16} /> <b style={{ textTransform: "capitalize" }}>{latest.visibility}</b><span className="ys-muted">Visibility</span></div>
                    </div>
                    <Link href="/studio/analytics" className="ys-pill-btn">Go to video analytics <ArrowRight size={16} /></Link>
                  </div>
                </div>
              ) : (
                <p className="ys-empty">No videos yet.</p>
              )}
            </section>

            <section className="ys-card">
              <h2 className="ys-h2">Channel analytics</h2>
              {analytics && <ViewsChart series={analytics.series} height={220} />}
            </section>
          </div>

          <section className="ys-card">
            <div className="ys-card-head">
              <h2 className="ys-h2">Published videos</h2>
              <Link href="/studio/content" className="ys-pill-btn">View all</Link>
            </div>
            <VideoTable videos={videos} onChanged={reload} limit={5} />
          </section>
        </div>

        <aside className="ys-right">
          <section className="ys-promo">
            <h2>{videos.length ? "Upload a new video" : "Create and upload your first video"}</h2>
            <p>Share your story and grow your audience. Upload videos that you&apos;re proud of.</p>
            <button className="ys-white-btn" onClick={openUpload}>Upload videos <ArrowRight size={16} /></button>
          </section>

          <section className="ys-card">
            <div className="ys-card-head">
              <h2 className="ys-h2"><Lightbulb size={18} color="#f5c542" /> Channel ideas</h2>
            </div>
            <p className="ys-idea-title">Learn how to grow your channel</p>
            <p className="ys-muted">Great thumbnails, clear titles and useful tags help viewers find your videos.</p>
            <button className="ys-pill-btn" style={{ marginTop: 14 }} onClick={openUpload}>Get started <ArrowRight size={16} /></button>
          </section>
        </aside>
      </div>
    </div>
  );
}