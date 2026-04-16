/**
 * Job Recommendations Controller
 * Matches user skills to job openings and returns recommendations
 */

const Resume = require("../models/Resume.model");
const { AppError } = require("../middlewares/error.middleware");
const { JOB_DATABASE, calculateMatchScore } = require("../utils/jobMatcher.util");

// ─── GET /jobs/recommendations/:resumeId ──────────────────────────────────────
const getJobRecommendations = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { limit = 10, category } = req.query;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id,
      analysisStatus: "completed",
    });

    if (!resume) {
      throw new AppError("Analyzed resume not found. Please complete analysis first.", 404);
    }

    // Extract user skills
    const userSkills = resume.parsedData?.skills?.map((s) => s.name.toLowerCase()) || [];
    const targetRole = resume.targetJobTitle || resume.skillGap?.targetRole;

    // Filter jobs by category if provided
    let jobs = JOB_DATABASE;
    if (category) {
      jobs = jobs.filter((j) => j.category.toLowerCase() === category.toLowerCase());
    }

    // Calculate match scores for each job
    const jobsWithScores = jobs.map((job) => {
      const matchResult = calculateMatchScore(userSkills, job.requiredSkills, targetRole, job.title);
      return {
        ...job,
        matchPercentage: matchResult.score,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        matchTier: getMatchTier(matchResult.score),
      };
    });

    // Sort by match score and slice
    const recommendations = jobsWithScores
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, parseInt(limit));

    // Categorize recommendations
    const strong = recommendations.filter((j) => j.matchPercentage >= 70);
    const moderate = recommendations.filter((j) => j.matchPercentage >= 40 && j.matchPercentage < 70);
    const stretch = recommendations.filter((j) => j.matchPercentage < 40);

    res.json({
      success: true,
      data: {
        totalJobs: recommendations.length,
        userSkillCount: userSkills.length,
        summary: {
          strongMatches: strong.length,
          moderateMatches: moderate.length,
          stretchMatches: stretch.length,
        },
        recommendations,
        categories: [...new Set(JOB_DATABASE.map((j) => j.category))],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /jobs/categories ─────────────────────────────────────────────────────
const getJobCategories = async (req, res, next) => {
  try {
    const categories = [...new Set(JOB_DATABASE.map((j) => j.category))];
    const categoryStats = categories.map((cat) => ({
      name: cat,
      count: JOB_DATABASE.filter((j) => j.category === cat).length,
    }));

    res.json({ success: true, categories: categoryStats });
  } catch (error) {
    next(error);
  }
};

// ─── Helper: Match Tier ───────────────────────────────────────────────────────
const getMatchTier = (score) => {
  if (score >= 80) return "excellent";
  if (score >= 65) return "strong";
  if (score >= 45) return "moderate";
  if (score >= 25) return "partial";
  return "low";
};

module.exports = { getJobRecommendations, getJobCategories };
