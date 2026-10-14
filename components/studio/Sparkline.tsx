"use client";
import { useId } from "react";

export default function Sparkline({ values, color }: { values: number[]; color: string }) {
  const id = useId();
  const W = 120, H = 48;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${(i * W) / Math.max(1, values.length - 1)},${H - 4 - (v / max) * (H - 8)}`);
  const line = pts.join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="ys-spark">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${line} ${W},${H}`} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}