/**
 * Resume Text Parser Utility
 * Extracts structured data from raw resume text using regex and heuristics
 */

/**
 * Parse raw resume text into structured data
 */
const parseResumeText = (text) => {
  if (!text) return {};

  const cleanText = text.replace(/\s+/g, " ").trim();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  return {
    name: extractName(lines),
    email: extractEmail(cleanText),
    phone: extractPhone(cleanText),
    location: extractLocation(cleanText),
    linkedIn: extractLinkedIn(cleanText),
    github: extractGitHub(cleanText),
    website: extractWebsite(cleanText),
    summary: extractSummary(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
    totalYearsExperience: estimateYearsOfExperience(text),
  };
};

// ─── Extractors ───────────────────────────────────────────────────────────────

const extractName = (lines) => {
  // Name is usually in the first 3 lines, not an email/phone
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line.length > 3 &&
      line.length < 60 &&
      !line.includes("@") &&
      !line.match(/^\+?[\d\s\-().]+$/) &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum") &&
      line.match(/^[A-Za-z\s.'-]+$/)
    ) {
      return line;
    }
  }
  return null;
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  const match = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.\-]?)?\d{3}[\s.\-]?\d{4}/);
  return match ? match[0].trim() : null;
};

const extractLocation = (text) => {
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\s*\d{5}?/,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z][a-z]+)/,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

const extractLinkedIn = (text) => {
  const match = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_]+/i);
  return match ? `https://${match[0]}` : null;
};

const extractGitHub = (text) => {
  const match = text.match(/github\.com\/[a-zA-Z0-9\-_]+/i);
  return match ? `https://${match[0]}` : null;
};

const extractWebsite = (text) => {
  const match = text.match(/https?:\/\/(?!linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  return match ? match[0] : null;
};

const extractSummary = (text) => {
  const summaryPatterns = [
    /(?:summary|profile|objective|about me?)[:\s]*\n([\s\S]{50,400}?)(?:\n\n|\n[A-Z])/i,
  ];
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/\s+/g, " ").trim();
  }
  return null;
};

const TECH_SKILLS = [
  // Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby",
  "swift", "kotlin", "scala", "r", "matlab", "perl", "bash", "shell",
  // Frontend
  "react", "next.js", "vue.js", "angular", "svelte", "html", "css", "tailwind",
  "sass", "bootstrap", "webpack", "vite", "jquery",
  // Backend
  "node.js", "express", "django", "flask", "fastapi", "spring boot", "laravel",
  "rails", "asp.net", "graphql", "rest api", "restful",
  // Database
  "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "sqlite",
  "firebase", "dynamodb", "cassandra", "oracle",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
  "github actions", "ci/cd", "linux", "nginx",
  // Data & AI
  "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
  "pandas", "numpy", "tableau", "power bi", "data analysis", "nlp",
  // Tools
  "git", "jira", "confluence", "figma", "postman", "vs code",
  // Soft Skills
  "leadership", "communication", "problem solving", "teamwork", "agile",
  "scrum", "project management",
];

const SKILL_CATEGORIES = {
  technical: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin"],
  framework: ["react", "next.js", "vue.js", "angular", "svelte", "express", "django", "flask", "spring boot"],
  tool: ["git", "docker", "kubernetes", "jira", "figma", "postman", "webpack", "vite", "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "firebase", "aws", "azure", "gcp", "terraform", "jenkins", "ci/cd"],
  soft: ["leadership", "communication", "problem solving", "teamwork", "agile", "scrum"],
};

const extractSkills = (text) => {
  const textLower = text.toLowerCase();
  const foundSkills = [];

  TECH_SKILLS.forEach((skill) => {
    if (textLower.includes(skill.toLowerCase())) {
      const category = getSkillCategory(skill);
      foundSkills.push({
        name: formatSkillName(skill),
        category,
        proficiencyLevel: inferProficiency(text, skill),
      });
    }
  });

  // Also extract from explicit skills sections
  const skillsSectionMatch = text.match(/(?:skills?|technologies|tech stack)[:\s]*\n([\s\S]{10,500}?)(?:\n\n|\n[A-Z][a-z])/i);
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];
    const additionalSkills = skillsText
      .split(/[,•|\n\/]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40)
      .filter((s) => !foundSkills.some((fs) => fs.name.toLowerCase() === s.toLowerCase()));

    additionalSkills.forEach((skill) => {
      if (skill && !skill.match(/^\d+$/)) {
        foundSkills.push({
          name: skill,
          category: getSkillCategory(skill.toLowerCase()),
          proficiencyLevel: "intermediate",
        });
      }
    });
  }

  // Remove duplicates
  const unique = foundSkills.filter(
    (skill, index, self) => index === self.findIndex((s) => s.name.toLowerCase() === skill.name.toLowerCase())
  );

  return unique.slice(0, 30); // Cap at 30 skills
};

const getSkillCategory = (skill) => {
  const skillLower = skill.toLowerCase();
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.some((s) => skillLower.includes(s))) return category;
  }
  return "technical";
};

const formatSkillName = (skill) => {
  const specialCases = {
    "javascript": "JavaScript", "typescript": "TypeScript", "python": "Python",
    "next.js": "Next.js", "node.js": "Node.js", "vue.js": "Vue.js",
    "mongodb": "MongoDB", "postgresql": "PostgreSQL", "graphql": "GraphQL",
    "aws": "AWS", "gcp": "GCP", "css": "CSS", "html": "HTML",
    "rest api": "REST API", "ci/cd": "CI/CD",
  };
  return specialCases[skill.toLowerCase()] || skill.charAt(0).toUpperCase() + skill.slice(1);
};

const inferProficiency = (text, skill) => {
  const textLower = text.toLowerCase();
  const idx = textLower.indexOf(skill.toLowerCase());
  if (idx === -1) return "intermediate";
  
  const context = textLower.substring(Math.max(0, idx - 50), idx + 50);
  if (context.includes("expert") || context.includes("advanced") || context.includes("5+ years") || context.includes("lead")) return "advanced";
  if (context.includes("beginner") || context.includes("basic") || context.includes("learning") || context.includes("familiar")) return "beginner";
  return "intermediate";
};

const extractExperience = (text) => {
  const experiences = [];
  const expSection = text.match(/(?:experience|work history|employment)[:\s]*\n([\s\S]*?)(?:\n(?:education|skills?|projects?|certifications?)\s*\n|$)/i);
  
  if (!expSection) return experiences;
  
  const expText = expSection[1];
  // Simple heuristic: look for lines that look like job titles
  const jobLines = expText.split("\n").filter((l) => l.trim().length > 0);
  
  let currentJob = null;
  jobLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.match(/^[A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Designer|Analyst|Lead|Director|Consultant)/)) {
      if (currentJob) experiences.push(currentJob);
      currentJob = { title: trimmed, company: "", duration: "", description: "" };
    } else if (currentJob && trimmed.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/)) {
      currentJob.duration = trimmed;
    } else if (currentJob && !currentJob.company && trimmed.length > 2) {
      currentJob.company = trimmed;
    } else if (currentJob) {
      currentJob.description += " " + trimmed;
    }
  });
  
  if (currentJob) experiences.push(currentJob);
  return experiences.slice(0, 10);
};

const extractEducation = (text) => {
  const education = [];
  const eduSection = text.match(/education[:\s]*\n([\s\S]*?)(?:\n(?:experience|skills?|projects?)\s*\n|$)/i);
  if (!eduSection) return education;
  
  const lines = eduSection[1].split("\n").filter((l) => l.trim().length > 0);
  let current = null;
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.match(/bachelor|master|phd|b\.s\.|m\.s\.|b\.e\.|m\.e\.|mba|associate/i)) {
      if (current) education.push(current);
      current = { degree: trimmed, institution: "", year: "" };
    } else if (current && trimmed.match(/university|college|institute|school/i)) {
      current.institution = trimmed;
    } else if (current && trimmed.match(/\d{4}/)) {
      current.year = trimmed.match(/\d{4}/)[0];
    }
  });
  
  if (current) education.push(current);
  return education;
};

const extractCertifications = (text) => {
  const certs = [];
  const certSection = text.match(/certifications?[:\s]*\n([\s\S]{0,500}?)(?:\n\n|\n[A-Z][a-z]|$)/i);
  if (!certSection) return certs;
  
  certSection[1].split("\n")
    .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
    .filter((l) => l.length > 5)
    .forEach((cert) => certs.push(cert));
  
  return certs.slice(0, 10);
};

const extractLanguages = (text) => {
  const langSection = text.match(/languages?[:\s]*\n?([\s\S]{0,200}?)(?:\n\n|\n[A-Z][a-z]|$)/i);
  if (!langSection) return [];
  
  return langSection[1]
    .split(/[,\n•]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 1 && l.length < 30)
    .slice(0, 8);
};

const estimateYearsOfExperience = (text) => {
  // Look for year patterns in experience section
  const years = text.match(/20\d{2}/g) || [];
  if (years.length < 2) return null;
  
  const yearNums = years.map(Number);
  const minYear = Math.min(...yearNums);
  const maxYear = Math.max(...yearNums, new Date().getFullYear());
  const total = maxYear - minYear;
  
  return total > 0 && total < 50 ? total : null;
};

module.exports = { parseResumeText, TECH_SKILLS, SKILL_CATEGORIES };
