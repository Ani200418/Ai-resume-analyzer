"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid,
} from "recharts";
import { Job } from "@/types";

interface Props {
  jobs: Job[];
}

const TIER_CONFIG = {
  excellent: { label: "Excellent (80-100%)", color: "#10b981", range: [80, 100] },
  strong:    { label: "Strong (65-79%)",     color: "#0ea5e9", range: [65, 80] },
  moderate:  { label: "Moderate (45-64%)",   color: "#f59e0b", range: [45, 65] },
  partial:   { label: "Partial (25-44%)",    color: "#f97316", range: [25, 45] },
  low:       { label: "Low (0-24%)",         color: "#ef4444", range: [0,  25] },
};

export default function MatchDistributionChart({ jobs }: Props) {
  const data = Object.entries(TIER_CONFIG).map(([key, config]) => ({
    name: config.label,
    count: jobs.filter((j) => j.matchTier === key).length,
    color: config.color,
    tier: key,
  })).filter((d) => d.count > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        No match data available
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1d27",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value} jobs`, "Matches"]}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
