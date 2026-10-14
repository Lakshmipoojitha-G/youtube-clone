"use client";
import { ArrowUp, ArrowDown } from "lucide-react";
import Sparkline from "./Sparkline";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  note?: string;
  compareLabel: string;
  spark: number[];
  color: string;
  tint: string; // css class suffix: blue | purple | green | orange
};

export default function StatCard({ icon, label, value, change, note, compareLabel, spark, color, tint }: Props) {
  const up = (change ?? 0) >= 0;
  return (
    <div className={`ys-stat ys-stat--${tint}`}>
      <div className="ys-stat-icon">{icon}</div>
      <div className="ys-stat-body">
        <p className="ys-stat-label">{label}</p>
        <p className="ys-stat-value">{value}</p>
        {note ? (
          <p className="ys-muted">{note}</p>
        ) : (
          <>
            <p className={`ys-stat-change ${up ? "up" : "down"}`}>
              {up ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {Math.abs(change ?? 0)}%
            </p>
            <p className="ys-muted">{compareLabel}</p>
          </>
        )}
      </div>
      <Sparkline values={spark} color={color} />
    </div>
  );
}