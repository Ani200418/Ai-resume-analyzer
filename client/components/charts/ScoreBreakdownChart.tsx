"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  format: number;
  content: number;
  readability: number;
}

const getBarColor = (value: number) => {
  if (value >= 80) return "#10b981";
  if (value >= 60) return "#0ea5e9";
  if (value >= 40) return "#f59e0b";
  return "#ef4444";
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-800 border border-white/[0.08] rounded-xl p-3 shadow-card">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white text-sm font-bold">{payload[0].value} / 100</p>
      </div>
    );
  }
  return null;
};

export default function ScoreBreakdownChart({ format, content, readability }: Props) {
  const data = [
    { name: "Format", value: format },
    { name: "Content", value: content },
    { name: "Readability", value: readability },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
