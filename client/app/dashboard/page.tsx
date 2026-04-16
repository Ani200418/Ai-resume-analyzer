"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { resumeAPI } from "@/lib/api";
import { Resume } from "@/types";
import { UploadCloud, FileText, BarChart2, Briefcase, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { formatDate, getScoreColor, getScoreBg } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await resumeAPI.getAll(1, 5);
        setResumes(data.resumes);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const completedResumes = resumes.filter((r) => r.analysisStatus === "completed");
  const latestResume = completedResumes[0];
  const avgScore = completedResumes.length
    ? Math.round(completedResumes.reduce((a, r) => a + (r.atsAnalysis?.score || 0), 0) / completedResumes.length)
    : null;

  const QUICK_ACTIONS = [
    {
      href: "/dashboard/resume",
      icon: UploadCloud,
      color: "brand",
      title: "Upload Resume",
      desc: "Analyze a new PDF resume",
    },
    {
      href: "/dashboard/resume",
      icon: BarChart2,
      color: "accent",
      title: "View Analysis",
      desc: "Check ATS scores & feedback",
    },
    {
      href: "/dashboard/jobs",
      icon: Briefcase,
      color: "emerald",
      title: "Job Matches",
      desc: "Find matching opportunities",
    },
  ];

  const colorMap: Record<string, string> = {
    brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    accent: "text-accent-400 bg-accent-500/10 border-accent-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Here's an overview of your resume performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Resumes</span>
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
          {isLoading ? (
            <div className="skeleton h-8 w-16 rounded" />
          ) : (
            <div className="text-3xl font-bold text-white">{resumes.length}</div>
          )}
          <div className="text-xs text-slate-500 mt-1">uploaded total</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg ATS Score</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          {isLoading ? (
            <div className="skeleton h-8 w-16 rounded" />
          ) : (
            <div className={`text-3xl font-bold ${avgScore ? getScoreColor(avgScore) : "text-slate-600"}`}>
              {avgScore !== null ? avgScore : "–"}
            </div>
          )}
          <div className="text-xs text-slate-500 mt-1">
            {avgScore ? "across analyzed resumes" : "no analysis yet"}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Analyses Done</span>
            <BarChart2 className="w-4 h-4 text-slate-600" />
          </div>
          {isLoading ? (
            <div className="skeleton h-8 w-16 rounded" />
          ) : (
            <div className="text-3xl font-bold text-white">{completedResumes.length}</div>
          )}
          <div className="text-xs text-slate-500 mt-1">completed analyses</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href + a.title} href={a.href} className="card-hover p-5 group">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[a.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">{a.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Latest Resume */}
      {latestResume && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Latest Analysis</h2>
            <Link href="/dashboard/resume" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Score ring placeholder */}
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full border-4 border-surface-800 relative">
                <div className={`text-2xl font-bold ${getScoreColor(latestResume.atsAnalysis!.score)}`}>
                  {latestResume.atsAnalysis!.score}
                </div>
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="44" fill="none"
                      stroke={latestResume.atsAnalysis!.score >= 70 ? "#10b981" : latestResume.atsAnalysis!.score >= 50 ? "#0ea5e9" : "#f59e0b"}
                      strokeWidth="8"
                      strokeDasharray={`${(latestResume.atsAnalysis!.score / 100) * 276.5} 276.5`}
                      strokeLinecap="round"
                      className="score-ring"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-white truncate">{latestResume.fileName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(latestResume.createdAt)}
                    </div>
                  </div>
                  <span className={`badge text-xs px-2 py-0.5 ${
                    latestResume.atsAnalysis!.grade === "A" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    latestResume.atsAnalysis!.grade === "B" ? "text-brand-400 bg-brand-500/10 border-brand-500/20" :
                    "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}>
                    Grade {latestResume.atsAnalysis!.grade}
                  </span>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Format", value: latestResume.atsAnalysis!.formatScore },
                    { label: "Content", value: latestResume.atsAnalysis!.contentScore },
                    { label: "Readability", value: latestResume.atsAnalysis!.readabilityScore },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{metric.label}</span>
                        <span className={getScoreColor(metric.value)}>{metric.value}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`h-full rounded-full ${getScoreBg(metric.value)}`}
                          style={{ width: `${metric.value}%`, transition: "width 1s ease-out" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-end">
              <Link href={`/dashboard/resume/${latestResume._id}`} className="btn-secondary text-xs py-2 px-4">
                View full analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && resumes.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5">
            <UploadCloud className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No resumes yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Upload your first resume to get an ATS score, skill analysis, and job recommendations.
          </p>
          <Link href="/dashboard/resume" className="btn-primary">
            Upload your resume
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};
