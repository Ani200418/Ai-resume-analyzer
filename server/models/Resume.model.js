/**
 * Resume Model
 * Stores uploaded resume data and AI analysis results
 */

const mongoose = require("mongoose");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["technical", "soft", "language", "tool", "framework", "other"],
    default: "other"
  },
  proficiencyLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "intermediate",
  },
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String,
  startDate: String,
  endDate: String,
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  gpa: String,
}, { _id: false });

const ATSAnalysisSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100 },
  grade: { type: String, enum: ["A", "B", "C", "D", "F"] },
  strengths: [String],
  weaknesses: [String],
  keywordsFound: [String],
  keywordsMissing: [String],
  formatScore: { type: Number, min: 0, max: 100 },
  contentScore: { type: Number, min: 0, max: 100 },
  readabilityScore: { type: Number, min: 0, max: 100 },
}, { _id: false });

const SkillGapSchema = new mongoose.Schema({
  targetRole: String,
  presentSkills: [String],
  missingSkills: [String],
  recommendations: [String],
  prioritySkills: [String],
}, { _id: false });

const AIFeedbackSchema = new mongoose.Schema({
  summary: String,
  detailedFeedback: String,
  improvementSuggestions: [String],
  keywordOptimization: [String],
  industryAlignment: String,
  careerLevel: {
    type: String,
    enum: ["entry", "mid", "senior", "executive"],
  },
}, { _id: false });

// ─── Main Resume Schema ───────────────────────────────────────────────────────

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: Number,
    mimeType: String,

    // Parsed Content
    rawText: {
      type: String,
      required: true,
    },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedIn: String,
      github: String,
      website: String,
      summary: String,
      skills: [SkillSchema],
      experience: [ExperienceSchema],
      education: [EducationSchema],
      certifications: [String],
      languages: [String],
      totalYearsExperience: Number,
    },

    // AI Analysis Results
    atsAnalysis: ATSAnalysisSchema,
    skillGap: SkillGapSchema,
    aiFeedback: AIFeedbackSchema,

    // Meta
    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    analysisError: String,
    targetJobTitle: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
resumeSchema.virtual("skillCount").get(function () {
  return this.parsedData?.skills?.length || 0;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model("Resume", resumeSchema);
