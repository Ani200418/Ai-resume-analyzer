import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-brand-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
};

export const getScoreBg = (score: number): string => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-brand-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
};

export const getGradeColor = (grade: string): string => {
  const map: Record<string, string> = { A: "text-emerald-400", B: "text-brand-400", C: "text-amber-400", D: "text-orange-400", F: "text-red-400" };
  return map[grade] || "text-gray-400";
};

export const getMatchTierColor = (tier: string): string => {
  const map: Record<string, string> = {
    excellent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    strong: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    moderate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    partial: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    low: "text-red-400 bg-red-500/10 border-red-500/20",
  };
  return map[tier] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const truncate = (str: string, n: number): string =>
  str.length > n ? `${str.substring(0, n)}...` : str;

export const getInitials = (name: string): string =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const getCareerLevelLabel = (level: string): string => {
  const map: Record<string, string> = { entry: "Entry Level", mid: "Mid Level", senior: "Senior Level", executive: "Executive" };
  return map[level] || level;
};
