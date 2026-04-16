"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft, Target, Zap, BarChart2, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, Lightbulb, Key, Award, Briefcase,
  Loader2, AlertCircle, ChevronRight,
} from "lucide-react";
import { resumeAPI } from "@/lib/api";
import { Resume } from "@/types";
import { getScoreColor, getScoreBg, getGradeColor, getCareerLevelLabel } from "@/lib/utils";
import SkillsRadarChart from "@/components/charts/SkillsRadarChart";
import ScoreBreakdownChart from "@/components/charts/ScoreBreakdownChart";

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ats" | "skills" | "feedback" | "parsed">("ats");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await resumeAPI.getById(id);
        setResume(data.resume);
      } catch {
        toast.error("Failed to load resume");
        router.push("/dashboard/resume");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, router]);

  if (isLoading) return <LoadingSkeleton />;
  if (!resume) return null;

  const isCompleted = resume.analysisStatus === "completed";

  const TABS = [
    { key: "ats", label: "ATS Analysis", icon: Target },
    { key: "skills", label: "Skill Gap", icon: BarChart2 },
    { key: "feedback", label: "AI Feedback", icon: Zap },
    { key: "parsed", label: "Parsed Data", icon: Award },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/resume" className="btn-ghost p-2 mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{resume.fileName}</h1>
          <div className="flex items-center gap-3 mt-1">
            {resume.targetJobTitle && (
              <span className="flex items-center gap-1 text-xs text-brand-400">
                <Target className="w-3 h-3" />
                {resume.targetJobTitle}
              </span>
            )}
            {isCompleted && resume.atsAnalysis && (
              <>
                <span className={`text-xs font-semibold ${getScoreColor(resume.atsAnalysis.score)}`}>
                  ATS Score: {resume.atsAnalysis.score}/100
                </span>
                <span className={`badge text-xs ${getGradeColor(resume.atsAnalysis.grade)} bg-white/[0.04] border-white/[0.08]`}>
                  Grade {resume.atsAnalysis.grade}
                </span>
              </>
            )}
          </div>
        </div>
        {isCompleted && (
          <Link
            href={`/dashboard/jobs?resumeId=${resume._id}`}
            className="btn-primary text-sm py-2 px-4 flex-shrink-0"
          >
            <Briefcase className="w-4 h-4" />
            Find Jobs
          </Link>
        )}
      </div>

      {/* Not analyzed yet */}
      {!isCompleted && (
        <div className="card p-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Analysis not complete</h3>
          <p className="text-slate-400 text-sm mb-4">
            {resume.analysisStatus === "processing"
              ? "Your resume is currently being analyzed. Please wait..."
              : "This resume hasn't been analyzed yet."}
          </p>
          {resume.analysisStatus !== "processing" && (
            <Link href="/dashboard/resume" className="btn-primary mx-auto">
              Go back and analyze
            </Link>
          )}
        </div>
      )}

      {/* Score Overview */}
      {isCompleted && resume.atsAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-20 h-20 mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={resume.atsAnalysis.score >= 70 ? "#10b981" : resume.atsAnalysis.score >= 50 ? "#0ea5e9" : "#f59e0b"}
                  strokeWidth="10"
                  strokeDasharray={`${(resume.atsAnalysis.score / 100) * 251.3} 251.3`}
                  strokeLinecap="round"
                  className="score-ring"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${getScoreColor(resume.atsAnalysis.score)}`}>
                  {resume.atsAnalysis.score}
                </span>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ATS Score</div>
            <div className={`text-sm font-bold mt-0.5 ${getGradeColor(resume.atsAnalysis.grade)}`}>
              Grade {resume.atsAnalysis.grade}
            </div>
          </div>

          {[
            { label: "Format", value: resume.atsAnalysis.formatScore },
            { label: "Content", value: resume.atsAnalysis.contentScore },
            { label: "Readability", value: resume.atsAnalysis.readabilityScore },
          ].map((m) => (
            <div key={m.label} className="card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{m.label}</span>
                <span className={`text-xl font-bold ${getScoreColor(m.value)}`}>{m.value}</span>
              </div>
              <div>
                <div className="progress-bar mb-1">
                  <div className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(m.value)}`} style={{ width: `${m.value}%` }} />
                </div>
                <div className="text-xs text-slate-600">out of 100</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      {isCompleted && (
        <>
          <div className="flex gap-1 p-1 rounded-xl bg-surface-800/60 border border-white/[0.06] overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
                  activeTab === key
                    ? "bg-brand-500/20 text-brand-300 border border-brand-500/25"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "ats" && resume.atsAnalysis && (
              <ATSTab ats={resume.atsAnalysis} />
            )}
            {activeTab === "skills" && resume.skillGap && (
              <SkillGapTab skillGap={resume.skillGap} parsedSkills={resume.parsedData?.skills || []} />
            )}
            {activeTab === "feedback" && resume.aiFeedback && (
              <FeedbackTab feedback={resume.aiFeedback} />
            )}
            {activeTab === "parsed" && (
              <ParsedDataTab resume={resume} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ATS Tab ──────────────────────────────────────────────────────────────────
function ATSTab({ ats }: { ats: NonNullable<Resume["atsAnalysis"]> }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Score Breakdown</h3>
        <ScoreBreakdownChart
          format={ats.formatScore}
          content={ats.contentScore}
          readability={ats.readabilityScore}
        />
      </div>

      {/* Keywords */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Keyword Analysis</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Keywords Found ({ats.keywordsFound.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ats.keywordsFound.map((kw) => (
                <span key={kw} className="badge text-emerald-400 bg-emerald-500/8 border-emerald-500/20 text-xs py-1 px-2">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="divider" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Missing Keywords ({ats.keywordsMissing.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ats.keywordsMissing.map((kw) => (
                <span key={kw} className="badge text-red-400 bg-red-500/8 border-red-500/20 text-xs py-1 px-2">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-300">Strengths</h3>
        </div>
        <ul className="space-y-2.5">
          {ats.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-300">Areas to Improve</h3>
        </div>
        <ul className="space-y-2.5">
          {ats.weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Skill Gap Tab ────────────────────────────────────────────────────────────
function SkillGapTab({
  skillGap, parsedSkills,
}: {
  skillGap: NonNullable<Resume["skillGap"]>;
  parsedSkills: Resume["parsedData"]["skills"];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Skills Overview</h3>
        <SkillsRadarChart skills={parsedSkills} />
      </div>

      {/* Priority Skills */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Priority Skills to Learn</h3>
        <p className="text-xs text-slate-500 mb-4">Ordered by impact on your target role</p>
        <ol className="space-y-2.5">
          {skillGap.prioritySkills.map((skill, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{skill}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Present Skills */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-300">Present Skills ({skillGap.presentSkills.length})</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillGap.presentSkills.map((s) => (
            <span key={s} className="badge text-emerald-400 bg-emerald-500/8 border-emerald-500/20 text-xs py-1 px-2.5">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">Missing Skills ({skillGap.missingSkills.length})</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillGap.missingSkills.map((s) => (
            <span key={s} className="badge text-amber-400 bg-amber-500/8 border-amber-500/20 text-xs py-1 px-2.5">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-semibold text-slate-300">Recommendations for {skillGap.targetRole}</h3>
        </div>
        <ul className="space-y-2.5">
          {skillGap.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <ChevronRight className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Feedback Tab ─────────────────────────────────────────────────────────────
function FeedbackTab({ feedback }: { feedback: NonNullable<Resume["aiFeedback"]> }) {
  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="card p-6 border-brand-500/15">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-slate-300">Executive Summary</h3>
              <span className="badge text-xs text-brand-400 bg-brand-500/10 border-brand-500/20 capitalize">
                {getCareerLevelLabel(feedback.careerLevel)}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{feedback.summary}</p>
            <p className="text-slate-400 text-sm leading-relaxed mt-3">{feedback.detailedFeedback}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement Suggestions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-300">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {feedback.improvementSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Keyword Optimization */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-slate-300">Keyword Optimization</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.keywordOptimization.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <ChevronRight className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{k}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Industry Alignment */}
      <div className="card p-5 flex items-start gap-3">
        <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Industry Alignment</div>
          <p className="text-slate-300 text-sm leading-relaxed">{feedback.industryAlignment}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Parsed Data Tab ──────────────────────────────────────────────────────────
function ParsedDataTab({ resume }: { resume: Resume }) {
  const d = resume.parsedData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Info */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Contact Information</h3>
        <dl className="space-y-2.5">
          {[
            { label: "Name", value: d.name },
            { label: "Email", value: d.email },
            { label: "Phone", value: d.phone },
            { label: "Location", value: d.location },
            { label: "LinkedIn", value: d.linkedIn },
            { label: "GitHub", value: d.github },
            { label: "Experience", value: d.totalYearsExperience ? `${d.totalYearsExperience} years` : null },
          ].filter((i) => i.value).map(({ label, value }) => (
            <div key={label} className="flex gap-3 text-sm">
              <dt className="text-slate-500 w-20 flex-shrink-0">{label}</dt>
              <dd className="text-slate-300 truncate">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Skills */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Detected Skills ({d.skills?.length || 0})</h3>
        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
          {d.skills?.map((s) => (
            <span key={s.name} className="badge text-xs text-brand-300 bg-brand-500/8 border-brand-500/15 py-1 px-2.5">
              {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      {d.experience?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Work Experience</h3>
          <div className="space-y-4">
            {d.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-brand-500/30 pl-3">
                <div className="font-medium text-white text-sm">{exp.title}</div>
                {exp.company && <div className="text-xs text-slate-400">{exp.company}</div>}
                {exp.duration && <div className="text-xs text-slate-500">{exp.duration}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {d.education?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Education</h3>
          <div className="space-y-3">
            {d.education.map((edu, i) => (
              <div key={i}>
                <div className="font-medium text-white text-sm">{edu.degree}</div>
                <div className="text-xs text-slate-400">{edu.institution}</div>
                {edu.year && <div className="text-xs text-slate-500">{edu.year}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <div className="skeleton w-8 h-8 rounded-lg" />
        <div className="space-y-2">
          <div className="skeleton h-5 w-64 rounded" />
          <div className="skeleton h-3 w-40 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card p-5 h-28"><div className="skeleton h-full rounded-lg" /></div>)}
      </div>
      <div className="card p-6 h-64"><div className="skeleton h-full rounded-lg" /></div>
    </div>
  );
}
