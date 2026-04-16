// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  authProvider: "local" | "google";
  analysisCount: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── Resume ────────────────────────────────────────────────────────────────────
export interface Skill {
  name: string;
  category: "technical" | "soft" | "language" | "tool" | "framework" | "database" | "cloud" | "other";
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  summary?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  languages: string[];
  totalYearsExperience?: number;
}

// ─── Analysis ─────────────────────────────────────────────────────────────────
export interface ATSAnalysis {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  formatScore: number;
  contentScore: number;
  readabilityScore: number;
  strengths: string[];
  weaknesses: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
}

export interface SkillGap {
  targetRole: string;
  presentSkills: string[];
  missingSkills: string[];
  prioritySkills: string[];
  recommendations: string[];
}

export interface AIFeedback {
  summary: string;
  detailedFeedback: string;
  improvementSuggestions: string[];
  keywordOptimization: string[];
  industryAlignment: string;
  careerLevel: "entry" | "mid" | "senior" | "executive";
}

export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  parsedData: ParsedResumeData;
  atsAnalysis?: ATSAnalysis;
  skillGap?: SkillGap;
  aiFeedback?: AIFeedback;
  analysisStatus: "pending" | "processing" | "completed" | "failed";
  analysisError?: string;
  targetJobTitle?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  experience: string;
  requiredSkills: string[];
  niceToHave: string[];
  description: string;
  postedDate: string;
  applyUrl: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchTier: "excellent" | "strong" | "moderate" | "partial" | "low";
}

export interface JobRecommendationsResponse {
  totalJobs: number;
  userSkillCount: number;
  summary: {
    strongMatches: number;
    moderateMatches: number;
    stretchMatches: number;
  };
  recommendations: Job[];
  categories: string[];
}

// ─── API ───────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
