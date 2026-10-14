"use client";
import { shortDate } from "./format";

function niceStep(max: number) {
  if (max <= 3) return 1;
  const raw = max / 3;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

export default function ViewsChart({ series, height = 240 }: { series: { date: string; views: number }[]; height?: number }) {
  const W = 620, H = height, L = 44, B = 28, T = 10, R = 8;
  const step = niceStep(Math.max(0, ...series.map((s) => s.views)));
  const max = step * 3;
  const n = series.length;
  const slot = (W - L - R) / Math.max(1, n);
  const bw = Math.max(2, slot * 0.62);
  const y = (v: number) => H - B - (v / max) * (H - B - T);
  const labelIdx = [0, 1, 2, 3, 4].map((k) => Math.round((k * (n - 1)) / 4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ys-chart">
      {[0, 1, 2, 3].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(step * t)} y2={y(step * t)} stroke="rgba(255,255,255,0.08)" />
          <text x={L - 8} y={y(step * t) + 4} fontSize="11" fill="#aaa" textAnchor="end">{step * t}</text>
        </g>
      ))}
      {series.map((s, i) => {
        const h = (s.views / max) * (H - B - T);
        return (
          <rect key={s.date} x={L + i * slot + (slot - bw) / 2} y={H - B - h} width={bw} height={h} rx="1.5"
            style={{ fill: "var(--yt-red)" }}>
            <title>{`${shortDate(s.date)}: ${s.views} views`}</title>
          </rect>
        );
      })}
      {labelIdx.map((i, k) => (
        <text key={k} x={L + i * slot + slot / 2} y={H - 8} fontSize="11" fill="#aaa" textAnchor="middle">
          {series[i] ? shortDate(series[i].date) : ""}
        </text>
      ))}
    </svg>
  );
}