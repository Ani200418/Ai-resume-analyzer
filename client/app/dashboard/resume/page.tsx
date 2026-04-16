"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  UploadCloud, FileText, Loader2, Trash2, BarChart2,
  CheckCircle2, AlertCircle, Clock, ChevronRight, X, Target,
} from "lucide-react";
import { resumeAPI } from "@/lib/api";
import { Resume } from "@/types";
import { formatDate, formatFileSize, getScoreColor, getScoreBg } from "@/lib/utils";

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [targetJobTitle, setTargetJobTitle] = useState("");

  const loadResumes = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(data.resumes);
    } catch (err: unknown) {
      const msg = (err as Error).message || "Failed to load resumes";
      toast.error(msg, { id: "load-resumes" }); // id prevents duplicate toasts
      console.error("[Resume Load Error]", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadResumes(); }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return;
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("resume", file);
    if (targetJobTitle) formData.append("targetJobTitle", targetJobTitle);

    try {
      const response: any = await resumeAPI.upload(formData, setUploadProgress);
const data = response.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = e?.response?.data?.error || e?.message || "Upload failed. Check the browser console for details.";
      toast.error(msg);
      console.error("[Upload Error]", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [targetJobTitle]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleAnalyze = async (resumeId: string) => {
    setAnalyzingId(resumeId);
    const toastId = toast.loading("Analyzing resume with AI...");
    try {
      await resumeAPI.analyze(resumeId);
      toast.success("Analysis complete!", { id: toastId });
      await loadResumes();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Analysis failed";
      toast.error(msg, { id: toastId });
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Delete this resume?")) return;
    try {
      await resumeAPI.delete(resumeId);
      setResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-white">My Resumes</h1>
        <p className="text-slate-400 mt-1 text-sm">Upload and analyze your resumes to get ATS scores and AI feedback.</p>
      </div>

      {/* Upload Area */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Upload New Resume</h2>

        {/* Target Job Input */}
        <div className="mb-4">
          <label className="block text-xs text-slate-500 mb-1.5">
            <Target className="w-3.5 h-3.5 inline mr-1" />
            Target job title (optional — improves analysis accuracy)
          </label>
          <input
            type="text"
            value={targetJobTitle}
            onChange={(e) => setTargetJobTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="input text-sm py-2.5"
            disabled={isUploading}
          />
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-brand-400 bg-brand-500/8 scale-[1.01]"
              : isUploading
              ? "border-white/10 bg-white/[0.02] cursor-not-allowed"
              : "border-white/10 hover:border-brand-500/40 hover:bg-brand-500/5"
          }`}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="w-10 h-10 mx-auto text-brand-400 animate-spin" />
              <div>
                <p className="text-sm text-slate-300 font-medium">Uploading & parsing...</p>
                <p className="text-xs text-slate-500 mt-1">{uploadProgress}%</p>
              </div>
              <div className="w-48 mx-auto progress-bar">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border transition-colors ${
                isDragActive ? "bg-brand-500/15 border-brand-500/30" : "bg-white/[0.03] border-white/[0.08]"
              }`}>
                <UploadCloud className={`w-7 h-7 ${isDragActive ? "text-brand-400" : "text-slate-500"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="text-xs text-slate-500 mt-1">or <span className="text-brand-400">click to browse</span></p>
              </div>
              <p className="text-xs text-slate-600">PDF only · Max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Resume List */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Uploaded Resumes ({resumes.length})
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="card p-10 text-center">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                isAnalyzing={analyzingId === resume._id}
                onAnalyze={() => handleAnalyze(resume._id)}
                onDelete={() => handleDelete(resume._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Resume Card ──────────────────────────────────────────────────────────────

function ResumeCard({
  resume, isAnalyzing, onAnalyze, onDelete,
}: {
  resume: Resume;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onDelete: () => void;
}) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-emerald-400", label: "Analyzed" },
    processing: { icon: Loader2, color: "text-brand-400", label: "Processing..." },
    pending: { icon: Clock, color: "text-amber-400", label: "Pending" },
    failed: { icon: AlertCircle, color: "text-red-400", label: "Failed" },
  };
  const status = statusConfig[resume.analysisStatus];
  const StatusIcon = status.icon;

  return (
    <div className="card p-5 hover:border-white/10 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* File icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-brand-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-white text-sm truncate">{resume.fileName}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-500">{formatDate(resume.createdAt)}</span>
                {resume.fileSize && (
                  <span className="text-xs text-slate-600">{formatFileSize(resume.fileSize)}</span>
                )}
                {resume.targetJobTitle && (
                  <span className="text-xs text-brand-400/80 flex items-center gap-1">
                    <Target className="w-2.5 h-2.5" />
                    {resume.targetJobTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Status badge */}
            <div className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ${status.color}`}>
              <StatusIcon className={`w-3.5 h-3.5 ${resume.analysisStatus === "processing" ? "animate-spin" : ""}`} />
              {status.label}
            </div>
          </div>

          {/* ATS Score bar (if analyzed) */}
          {resume.analysisStatus === "completed" && resume.atsAnalysis && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-slate-500 w-16 flex-shrink-0">ATS Score</span>
              <div className="flex-1 progress-bar">
                <div
                  className={`h-full rounded-full ${getScoreBg(resume.atsAnalysis.score)}`}
                  style={{ width: `${resume.atsAnalysis.score}%` }}
                />
              </div>
              <span className={`text-sm font-bold w-8 text-right flex-shrink-0 ${getScoreColor(resume.atsAnalysis.score)}`}>
                {resume.atsAnalysis.score}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {resume.analysisStatus === "completed" ? (
              <Link href={`/dashboard/resume/${resume._id}`} className="btn-secondary text-xs py-1.5 px-3">
                View analysis <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : resume.analysisStatus !== "processing" ? (
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
                ) : (
                  <><BarChart2 className="w-3.5 h-3.5" /> Analyze Now</>
                )}
              </button>
            ) : null}

            <button
              onClick={onDelete}
              className="btn-ghost text-xs py-1.5 px-2 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
