/**
 * Job Matcher Utility
 * Contains matching algorithm and skill extraction helpers
 */

const { TECH_SKILLS } = require("./resumeParser.util");

/**
 * Extract an array of skills from a job description text using our TECH_SKILLS dictionary
 */
const extractSkillsFromDescription = (description) => {
  if (!description) return [];
  const textLower = description.toLowerCase();
  const foundSkills = [];

  TECH_SKILLS.forEach((skill) => {
    // Basic word boundary or direct include check
    // Using string includes is fine but could be noisy. Regex is better for boundaries.
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
};

/**
 * Calculate match score between user skills and job requirements
 */
const calculateMatchScore = (userSkills, requiredSkills, targetRole, jobTitle) => {
  if (!userSkills.length) {
    return { score: 0, matchedSkills: [], missingSkills: requiredSkills };
  }

  // If requiredSkills is zero (couldn't extract any), we provide a neutral base score
  if (!requiredSkills.length) {
      let score = 40;
      if (targetRole && jobTitle) {
        const targetLower = targetRole.toLowerCase();
        const jobTitleLower = jobTitle.toLowerCase();
        if (jobTitleLower.includes(targetLower) || targetLower.includes(jobTitleLower)) {
          score += 40;
        }
      }
      return { score, matchedSkills: [], missingSkills: [] };
  }

  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const requiredLower = requiredSkills.map((s) => s.toLowerCase());

  // Calculate skill overlap
  const matchedSkills = requiredLower.filter((skill) =>
    userSkillsLower.some(
      (userSkill) =>
        userSkill === skill ||
        userSkill.includes(skill) ||
        skill.includes(userSkill)
    )
  );

  const missingSkills = requiredLower.filter((skill) => !matchedSkills.includes(skill));

  // Base score from skill overlap
  let score = (matchedSkills.length / requiredLower.length) * 85;

  // Bonus for title match
  if (targetRole && jobTitle) {
    const targetLower = targetRole.toLowerCase();
    const jobTitleLower = jobTitle.toLowerCase();
    if (jobTitleLower.includes(targetLower) || targetLower.includes(jobTitleLower)) {
      score = Math.min(100, score + 15);
    } else {
      // Partial title match
      const targetWords = targetLower.split(/\s+/);
      const titleWords = jobTitleLower.split(/\s+/);
      const titleOverlap = targetWords.filter((w) => titleWords.includes(w)).length;
      if (titleOverlap > 0) {
        score = Math.min(100, score + (titleOverlap / targetWords.length) * 10);
      }
    }
  }

  return {
    score: Math.round(score),
    matchedSkills: matchedSkills.map((s) => formatSkillLabel(s)),
    missingSkills: missingSkills.map((s) => formatSkillLabel(s)),
  };
};

const formatSkillLabel = (skill) => {
  const labels = {
    "javascript": "JavaScript", "typescript": "TypeScript", "node.js": "Node.js",
    "react": "React", "vue.js": "Vue.js", "next.js": "Next.js",
    "css": "CSS", "html": "HTML", "mongodb": "MongoDB", "postgresql": "PostgreSQL",
    "rest api": "REST API", "ci/cd": "CI/CD", "aws": "AWS", "gcp": "GCP",
  };
  return labels[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
};

module.exports = { extractSkillsFromDescription, calculateMatchScore };
