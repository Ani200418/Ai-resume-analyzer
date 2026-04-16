/**
 * Job Matcher Utility
 * Contains job database and matching algorithm
 */

/**
 * Comprehensive mock job database
 * In production, replace with real job board API (LinkedIn, Indeed, etc.)
 */
const JOB_DATABASE = [
  // ─── Software Engineering ────────────────────────────────────────────────────
  {
    id: "fe-001",
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA (Remote)",
    salary: "$130,000 - $170,000",
    type: "Full-time",
    category: "Frontend",
    experience: "5+ years",
    requiredSkills: ["react", "typescript", "next.js", "css", "html", "git", "rest api", "tailwind"],
    niceToHave: ["graphql", "testing", "webpack", "figma"],
    description: "Build scalable, performant frontend applications for millions of users.",
    postedDate: "2024-01-15",
    applyUrl: "#",
  },
  {
    id: "be-001",
    title: "Backend Engineer (Node.js)",
    company: "DataStream Labs",
    location: "New York, NY (Hybrid)",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    category: "Backend",
    experience: "3-5 years",
    requiredSkills: ["node.js", "javascript", "mongodb", "postgresql", "rest api", "docker", "git"],
    niceToHave: ["kubernetes", "aws", "redis", "graphql"],
    description: "Design and build robust APIs and backend services.",
    postedDate: "2024-01-20",
    applyUrl: "#",
  },
  {
    id: "fs-001",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Austin, TX (Remote)",
    salary: "$110,000 - $150,000",
    type: "Full-time",
    category: "Full Stack",
    experience: "3+ years",
    requiredSkills: ["react", "node.js", "javascript", "mongodb", "css", "html", "git", "rest api"],
    niceToHave: ["typescript", "docker", "aws", "redis"],
    description: "Own the full product lifecycle from database to UI.",
    postedDate: "2024-01-18",
    applyUrl: "#",
  },
  {
    id: "ml-001",
    title: "Machine Learning Engineer",
    company: "AI Ventures",
    location: "Seattle, WA (Remote)",
    salary: "$150,000 - $200,000",
    type: "Full-time",
    category: "AI/ML",
    experience: "3+ years",
    requiredSkills: ["python", "machine learning", "tensorflow", "pytorch", "numpy", "pandas", "git"],
    niceToHave: ["deep learning", "nlp", "aws", "docker", "scala"],
    description: "Build and deploy ML models at scale.",
    postedDate: "2024-01-22",
    applyUrl: "#",
  },
  {
    id: "devops-001",
    title: "DevOps Engineer",
    company: "CloudSystems Inc.",
    location: "Remote",
    salary: "$125,000 - $165,000",
    type: "Full-time",
    category: "DevOps",
    experience: "4+ years",
    requiredSkills: ["docker", "kubernetes", "aws", "linux", "bash", "ci/cd", "terraform", "git"],
    niceToHave: ["azure", "gcp", "python", "monitoring"],
    description: "Build and maintain cloud infrastructure for high-availability systems.",
    postedDate: "2024-01-10",
    applyUrl: "#",
  },
  {
    id: "data-001",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Chicago, IL (Hybrid)",
    salary: "$115,000 - $155,000",
    type: "Full-time",
    category: "Data Science",
    experience: "2-4 years",
    requiredSkills: ["python", "pandas", "numpy", "machine learning", "sql", "data analysis", "tableau"],
    niceToHave: ["r", "spark", "tensorflow", "power bi", "scikit-learn"],
    description: "Turn data into actionable business insights.",
    postedDate: "2024-01-25",
    applyUrl: "#",
  },
  {
    id: "ios-001",
    title: "iOS Developer",
    company: "MobileFirst Co.",
    location: "Los Angeles, CA",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    category: "Mobile",
    experience: "3+ years",
    requiredSkills: ["swift", "ios", "xcode", "git", "rest api"],
    niceToHave: ["kotlin", "react native", "objective-c", "swiftui", "firebase"],
    description: "Build world-class mobile experiences for iOS.",
    postedDate: "2024-01-12",
    applyUrl: "#",
  },
  {
    id: "java-001",
    title: "Java Backend Developer",
    company: "Enterprise Solutions",
    location: "Boston, MA (Hybrid)",
    salary: "$115,000 - $155,000",
    type: "Full-time",
    category: "Backend",
    experience: "4+ years",
    requiredSkills: ["java", "spring boot", "postgresql", "rest api", "git", "docker"],
    niceToHave: ["kubernetes", "kafka", "redis", "microservices"],
    description: "Build enterprise-grade Java applications.",
    postedDate: "2024-01-08",
    applyUrl: "#",
  },
  {
    id: "react-native-001",
    title: "React Native Developer",
    company: "AppWorks Studio",
    location: "Remote",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    category: "Mobile",
    experience: "2+ years",
    requiredSkills: ["react", "javascript", "react native", "rest api", "git"],
    niceToHave: ["typescript", "redux", "ios", "android", "firebase"],
    description: "Build cross-platform mobile apps with React Native.",
    postedDate: "2024-01-14",
    applyUrl: "#",
  },
  {
    id: "cloud-001",
    title: "AWS Solutions Architect",
    company: "Cloud Consultants",
    location: "Remote",
    salary: "$140,000 - $185,000",
    type: "Full-time",
    category: "Cloud",
    experience: "5+ years",
    requiredSkills: ["aws", "cloud", "terraform", "docker", "linux", "networking", "security"],
    niceToHave: ["kubernetes", "azure", "python", "serverless"],
    description: "Design and implement AWS cloud architectures.",
    postedDate: "2024-01-16",
    applyUrl: "#",
  },
  {
    id: "vue-001",
    title: "Vue.js Developer",
    company: "WebCraft Agency",
    location: "Denver, CO (Remote)",
    salary: "$95,000 - $130,000",
    type: "Full-time",
    category: "Frontend",
    experience: "2+ years",
    requiredSkills: ["vue.js", "javascript", "css", "html", "git", "rest api"],
    niceToHave: ["typescript", "nuxt.js", "tailwind", "testing"],
    description: "Build beautiful, interactive web applications.",
    postedDate: "2024-01-19",
    applyUrl: "#",
  },
  {
    id: "python-001",
    title: "Python Developer",
    company: "PyTech Labs",
    location: "Miami, FL (Hybrid)",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    category: "Backend",
    experience: "2+ years",
    requiredSkills: ["python", "django", "postgresql", "rest api", "git"],
    niceToHave: ["flask", "fastapi", "docker", "celery", "redis"],
    description: "Build scalable Python applications and APIs.",
    postedDate: "2024-01-21",
    applyUrl: "#",
  },
  {
    id: "product-001",
    title: "Product Manager",
    company: "ProductFirst",
    location: "San Francisco, CA",
    salary: "$130,000 - $175,000",
    type: "Full-time",
    category: "Product",
    experience: "4+ years",
    requiredSkills: ["project management", "agile", "scrum", "communication", "leadership", "data analysis"],
    niceToHave: ["sql", "figma", "jira", "tableau"],
    description: "Define and execute product vision.",
    postedDate: "2024-01-23",
    applyUrl: "#",
  },
  {
    id: "ux-001",
    title: "UX/UI Designer",
    company: "DesignLab Co.",
    location: "Portland, OR (Remote)",
    salary: "$90,000 - $130,000",
    type: "Full-time",
    category: "Design",
    experience: "3+ years",
    requiredSkills: ["figma", "css", "html", "communication", "problem solving"],
    niceToHave: ["javascript", "react", "sketch", "user research", "motion design"],
    description: "Create intuitive, beautiful user experiences.",
    postedDate: "2024-01-17",
    applyUrl: "#",
  },
  {
    id: "security-001",
    title: "Security Engineer",
    company: "SecureNet Inc.",
    location: "Washington, DC",
    salary: "$130,000 - $170,000",
    type: "Full-time",
    category: "Security",
    experience: "4+ years",
    requiredSkills: ["security", "linux", "python", "networking", "git"],
    niceToHave: ["aws", "docker", "kubernetes", "penetration testing"],
    description: "Build and maintain security infrastructure.",
    postedDate: "2024-01-11",
    applyUrl: "#",
  },
];

/**
 * Calculate match score between user skills and job requirements
 */
const calculateMatchScore = (userSkills, requiredSkills, targetRole, jobTitle) => {
  if (!userSkills.length || !requiredSkills.length) {
    return { score: 0, matchedSkills: [], missingSkills: requiredSkills };
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

module.exports = { JOB_DATABASE, calculateMatchScore };
