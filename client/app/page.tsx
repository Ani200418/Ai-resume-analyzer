"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  Zap, FileText, BarChart2, Briefcase, ChevronRight,
  CheckCircle2, Star, ArrowRight, Shield, Clock, Target,
} from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    color: "brand",
    title: "ATS Score Analysis",
    description: "Get a precise 0–100 ATS compatibility score with grade breakdown across format, content, and readability.",
  },
  {
    icon: Zap,
    color: "accent",
    title: "AI-Powered Feedback",
    description: "GPT-4 analyzes your resume and delivers specific, actionable improvement suggestions in seconds.",
  },
  {
    icon: BarChart2,
    color: "emerald",
    title: "Skill Gap Analysis",
    description: "Identify exactly which skills you're missing for your target role and which to learn first.",
  },
  {
    icon: Briefcase,
    color: "amber",
    title: "Job Matching",
    description: "Get matched to real job openings based on your skill set with a precise match percentage.",
  },
];

const STATS = [
  { value: "10K+", label: "Resumes Analyzed" },
  { value: "94%", label: "ATS Pass Rate" },
  { value: "3.2x", label: "More Interviews" },
  { value: "< 30s", label: "Analysis Time" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Software Engineer @ Google",
    text: "My ATS score went from 42 to 87 in one session. Got 3 interviews within a week of applying.",
    stars: 5,
  },
  {
    name: "Marcus Williams",
    role: "Product Manager @ Stripe",
    text: "The skill gap analysis was eye-opening. It told me exactly what to add to land PM roles.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist @ Netflix",
    text: "The job matcher saved me hours of searching. Every recommendation was a perfect fit.",
    stars: 5,
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface-950 noise-overlay">
      {/* ─── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] backdrop-blur-xl bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">ResumeAI</span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary text-sm py-2 px-5">
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-ghost text-sm">Sign in</Link>
                  <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/25 bg-brand-500/8 text-brand-300 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            Powered by GPT-4 · Free to start
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 animate-slide-up">
            Beat the ATS.{" "}
            <span className="gradient-text">Land your</span>
            <br />
            dream job.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Upload your resume and get an instant ATS score, skill gap analysis, 
            AI feedback, and personalized job recommendations — all in under 30 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-scale-in">
            <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"} className="btn-primary text-base px-8 py-4 shadow-glow">
              Analyze my resume free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="btn-secondary text-base px-8 py-4">
              See how it works
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-400" />
              Your data is private
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent-400" />
              Results in 30 seconds
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text-blue mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-title mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to get hired
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Our AI analyzes every aspect of your resume and tells you exactly what to improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const colorMap: Record<string, string> = {
                brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
                accent: "text-accent-400 bg-accent-500/10 border-accent-500/20",
                emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              };
              return (
                <div key={i} className="card-hover p-6 group cursor-default">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-5 ${colorMap[feature.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-title mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Real results, real careers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Ready to get more<br />
            <span className="gradient-text">interviews?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join thousands of job seekers who improved their resumes with AI.
          </p>
          <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"} className="btn-primary text-base px-10 py-4 shadow-glow-lg">
            Start analyzing for free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-400 text-sm">ResumeAI © {new Date().getFullYear()}</span>
          </div>
          <p className="text-slate-600 text-xs">Built with Next.js, Express & GPT-4</p>
        </div>
      </footer>
    </div>
  );
}
