"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Skill } from "@/types";

interface Props {
  skills: Skill[];
}

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  framework: "Frameworks",
  tool: "Tools",
  database: "Databases",
  cloud: "Cloud/DevOps",
  soft: "Soft Skills",
  other: "Other",
};

export default function SkillsRadarChart({ skills }: Props) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No skills data available
      </div>
    );
  }

  // Group skills by category and count
  const categoryCount: Record<string, number> = {};
  skills.forEach((s) => {
    const cat = s.category || "other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(categoryCount), 1);

  const data = Object.entries(CATEGORY_LABELS)
    .filter(([key]) => categoryCount[key] !== undefined)
    .map(([key, label]) => ({
      subject: label,
      value: Math.round(((categoryCount[key] || 0) / maxCount) * 100),
      count: categoryCount[key] || 0,
    }));

  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Not enough skill categories for radar chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#64748b", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1d27",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "12px",
          }}
          formatter={(value: number, name: string, props: { payload?: { count?: number } }) => [
            `${props.payload?.count || 0} skills`,
            props.payload ? name : "Skills",
          ]}
          labelFormatter={() => ""}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.12}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
