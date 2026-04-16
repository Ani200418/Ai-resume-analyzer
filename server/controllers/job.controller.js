/**
 * Job Recommendations Controller
 * Matches user skills to JSearch RapidAPI job openings
 */

const Resume = require("../models/Resume.model");
const { AppError } = require("../middlewares/error.middleware");
const { calculateMatchScore, extractSkillsFromDescription } = require("../utils/jobMatcher.util");

const COMMON_CATEGORIES = ["Frontend", "Backend", "Full Stack", "Data Science", "Mobile", "DevOps", "AI/ML", "Cloud"];

// Use a simple in-memory cache to avoid hitting rate limits while developing/testing
const searchCache = new Map();

// ─── Native fetch to RapidAPI ────────────────────────────────────────────────
const fetchJobsFromJSearch = async (query) => {
  const cacheKey = query.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`JSearch API Error: ${response.status} ${await response.text()}`);
  }
  
  const result = await response.json();
  const data = result.data || [];
  
  // Cache for 10 minutes
  searchCache.set(cacheKey, data);
  setTimeout(() => searchCache.delete(cacheKey), 10 * 60 * 1000);

  return data;
};

// ─── GET /jobs/recommendations/:resumeId ──────────────────────────────────────
const getJobRecommendations = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { limit = 20, category } = req.query;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id,
      analysisStatus: "completed",
    });

    if (!resume) {
      throw new AppError("Analyzed resume not found. Please complete analysis first.", 404);
    }

    const userSkills = resume.parsedData?.skills?.map((s) => s.name.toLowerCase()) || [];
    const targetRole = resume.targetJobTitle || resume.skillGap?.targetRole || "Software Engineer";
    const userLocation = resume.parsedData?.location || "";

    // Build query for JSearch
    let searchQuery = `${targetRole}`;
    if (category && category !== "all") {
        searchQuery += ` ${category}`;
    }
    if (userLocation) {
        searchQuery += ` in ${userLocation}`;
    }

    let apiJobs = [];
    try {
      apiJobs = await fetchJobsFromJSearch(searchQuery);
    } catch (apiError) {
      console.error("RapidAPI Error:", apiError);
      throw new AppError("Failed to fetch jobs from provider. Ensure RAPIDAPI_KEY is correct.", 502);
    }

    // Map JSearch schema to our internal schema
    const mappedJobs = apiJobs.map((j) => {
      let salary = "Not specified";
      if (j.job_min_salary && j.job_max_salary && j.job_salary_currency) {
         salary = `${j.job_salary_currency} ${j.job_min_salary} - ${j.job_max_salary}`;
      } else if (j.job_salary) {
         salary = j.job_salary;
      }
      
      const desc = j.job_description || "";
      const requiredSkills = extractSkillsFromDescription(desc);

      // Guess category
      const jTitle = (j.job_title || "").toLowerCase();
      let jobCategory = "Engineering";
      for (const cat of COMMON_CATEGORIES) {
          if (jTitle.includes(cat.toLowerCase())) {
              jobCategory = cat;
              break;
          }
      }

      return {
        id: j.job_id || Math.random().toString(),
        title: j.job_title || "Unknown Title",
        company: j.employer_name || "Unknown Company",
        location: j.job_city ? `${j.job_city}, ${j.job_country}` : (j.job_country || "Remote"),
        salary: salary,
        type: j.job_employment_type ? j.job_employment_type.replace(/_/g, " ") : "Full-time",
        category: jobCategory,
        experience: "Not specified",
        requiredSkills: requiredSkills,
        niceToHave: [],
        description: desc.substring(0, 500) + (desc.length > 500 ? "..." : ""),
        postedDate: j.job_posted_at_datetime_utc ? j.job_posted_at_datetime_utc.split("T")[0] : new Date().toISOString().split("T")[0],
        applyUrl: j.job_apply_link || j.employer_website || "#",
      };
    });

    // Calculate match scores
    const jobsWithScores = mappedJobs.map((job) => {
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

    const strong = recommendations.filter((j) => j.matchPercentage >= 70);
    const moderate = recommendations.filter((j) => j.matchPercentage >= 40 && j.matchPercentage < 70);
    const stretch = recommendations.filter((j) => j.matchPercentage < 40);

    const extractedCategories = [...new Set(mappedJobs.map((j) => j.category))];

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
        categories: extractedCategories.length > 0 ? extractedCategories : COMMON_CATEGORIES,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /jobs/categories ─────────────────────────────────────────────────────
const getJobCategories = async (req, res, next) => {
  try {
    const categoryStats = COMMON_CATEGORIES.map((cat) => ({
      name: cat,
      count: Math.floor(Math.random() * 50) + 10,
    }));

    res.json({ success: true, categories: categoryStats });
  } catch (error) {
    next(error);
  }
};

const getMatchTier = (score) => {
  if (score >= 80) return "excellent";
  if (score >= 65) return "strong";
  if (score >= 45) return "moderate";
  if (score >= 25) return "partial";
  return "low";
};

module.exports = { getJobRecommendations, getJobCategories };
