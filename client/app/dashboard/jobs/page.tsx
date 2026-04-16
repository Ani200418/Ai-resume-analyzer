"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Briefcase, MapPin, DollarSign, Clock, ChevronRight,
  Star, TrendingUp, Filter, CheckCircle2, XCircle, Loader2, ArrowLeft,
} from "lucide-react";
import { resumeAPI, jobsAPI } from "@/lib/api";
import { Resume, Job, JobRecommendationsResponse } from "@/types";
import { getMatchTierColor } from "@/lib/utils";
import MatchDistributionChart from "@/components/charts/MatchDistributionChart";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const preSelectedResumeId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(preSelectedResumeId || "");
  const [jobData, setJobData] = useState<JobRecommendationsResponse | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  // Load analyzed resumes
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await resumeAPI.getAll(1, 20);
        const analyzed = data.resumes.filter((r: Resume) => r.analysisStatus === "completed");
        setResumes(analyzed);
        if (!selectedResumeId && analyzed.length > 0) {
          setSelectedResumeId(analyzed[0]._id);
        }
      } catch {
        toast.error("Failed to load resumes");
      } finally {
        setIsLoadingResumes(false);
      }
    };
    load();
  }, []);

  // Load job recommendations when resume selected
  useEffect(() => {
    if (!selectedResumeId) return;
    const load = async () => {
      setIsLoadingJobs(true);
      try {
        const { data } = await jobsAPI.getRecommendations(selectedResumeId, { limit: 20 });
        setJobData(data.data);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to load job recommendations";
        toast.error(msg);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    load();
  }, [selectedResumeId]);

  const filteredJobs = jobData?.recommendations?.filter((job) => {
    const categoryMatch = selectedCategory === "all" || job.category === selectedCategory;
    const tierMatch = selectedTier === "all" || job.matchTier === selectedTier;
    return categoryMatch && tierMatch;
  }) || [];

  const tiers = ["excellent", "strong", "moderate", "partial", "low"];

  if (isLoadingResumes) return <LoadingSkeleton />;

  if (resumes.length === 0) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-8">Job Matches</h1>
        <div className="card p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No analyzed resumes yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            You need to upload and analyze a resume first to see personalized job recommendations.
          </p>
          <Link href="/dashboard/resume" className="btn-primary mx-auto">
            Upload a Resume
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Matches</h1>
        <p className="text-slate-400 mt-1 text-sm">Personalized job recommendations based on your skills.</p>
      </div>

      {/* Resume Selector */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-slate-400 flex-shrink-0">Matching for:</span>
          <div className="flex gap-2 flex-wrap">
            {resumes.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelectedResumeId(r._id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 truncate max-w-[200px] ${
                  selectedResumeId === r._id
                    ? "bg-brand-500/15 text-brand-300 border-brand-500/25"
                    : "text-slate-400 border-white/[0.08] hover:border-white/20 hover:text-white"
                }`}
              >
                {r.fileName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoadingJobs ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Matching your skills to jobs...</p>
          </div>
        </div>
      ) : jobData && (
        <>
          {/* Stats + Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold text-white mb-1">{jobData.totalJobs}</div>
              <div className="text-xs text-slate-500">Jobs Matched</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{jobData.summary.strongMatches}</div>
              <div className="text-xs text-slate-500">Strong Matches (70%+)</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold text-brand-400 mb-1">{jobData.userSkillCount}</div>
              <div className="text-xs text-slate-500">Skills Detected</div>
            </div>
          </div>

          {/* Distribution Chart */}
          {jobData.recommendations.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Match Distribution</h3>
              <MatchDistributionChart jobs={jobData.recommendations} />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Filter:</span>
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input py-1.5 px-3 text-xs w-auto min-w-[140px]"
            >
              <option value="all">All Categories</option>
              {jobData.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Tier filter */}
            <div className="flex gap-1.5">
              {["all", ...tiers].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                    selectedTier === tier
                      ? "bg-brand-500/15 text-brand-300 border-brand-500/25"
                      : "text-slate-500 border-white/[0.06] hover:border-white/15 hover:text-white"
                  }`}
                >
                  {tier === "all" ? "All tiers" : tier}
                </button>
              ))}
            </div>

            {(selectedCategory !== "all" || selectedTier !== "all") && (
              <button
                onClick={() => { setSelectedCategory("all"); setSelectedTier("all"); }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="card p-10 text-center">
              <p className="text-slate-500 text-sm">No jobs match the current filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-hover p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm">{job.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>
        </div>
        <div className={`badge text-xs flex-shrink-0 capitalize ${getMatchTierColor(job.matchTier)}`}>
          <Star className="w-2.5 h-2.5" />
          {job.matchTier}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {job.salary}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {job.type}
        </span>
      </div>

      {/* Match Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Skill Match</span>
          <span className={`font-semibold ${
            job.matchPercentage >= 70 ? "text-emerald-400" :
            job.matchPercentage >= 40 ? "text-brand-400" :
            "text-amber-400"
          }`}>{job.matchPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              job.matchPercentage >= 70 ? "bg-emerald-500" :
              job.matchPercentage >= 40 ? "bg-brand-500" :
              "bg-amber-500"
            }`}
            style={{ width: `${job.matchPercentage}%` }}
          />
        </div>
      </div>

      {/* Skill tags preview */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.matchedSkills.slice(0, 4).map((s) => (
          <span key={s} className="badge text-xs text-emerald-400 bg-emerald-500/8 border-emerald-500/15 py-0.5 px-2">
            <CheckCircle2 className="w-2.5 h-2.5" />
            {s}
          </span>
        ))}
        {job.missingSkills.slice(0, 2).map((s) => (
          <span key={s} className="badge text-xs text-red-400 bg-red-500/8 border-red-500/15 py-0.5 px-2">
            <XCircle className="w-2.5 h-2.5" />
            {s}
          </span>
        ))}
        {(job.matchedSkills.length + job.missingSkills.length) > 6 && (
          <span className="badge text-xs text-slate-500 bg-white/[0.03] border-white/[0.06] py-0.5 px-2">
            +{job.requiredSkills.length - 6} more
          </span>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-white/[0.06] pt-3 mt-3 space-y-3 animate-fade-in">
          <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-2">
              Matched ({job.matchedSkills.length}) / Required ({job.requiredSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.map((s) => (
                <span key={s} className="badge text-xs text-emerald-400 bg-emerald-500/8 border-emerald-500/15 py-0.5 px-2">{s}</span>
              ))}
              {job.missingSkills.map((s) => (
                <span key={s} className="badge text-xs text-slate-500 bg-white/[0.03] border-white/[0.06] py-0.5 px-2">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="btn-ghost text-xs py-1.5 px-3 flex-1"
        >
          {expanded ? "Show less" : "View details"}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-1.5 px-3"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Apply
        </a>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="card p-4"><div className="skeleton h-8 w-full rounded" /></div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="card p-5 h-20"><div className="skeleton h-full rounded" /></div>)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card p-5 h-48"><div className="skeleton h-full rounded" /></div>)}
      </div>
    </div>
  );
}
