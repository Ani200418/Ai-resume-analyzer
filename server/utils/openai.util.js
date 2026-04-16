/**
 * Unified AI Integration Utility
 * Handles AI-powered resume analysis using OpenAI, Gemini, and OpenRouter in parallel.
 * This Domain Specialist architecture splits the task to drastically improve speed and utilize each model's strengths.
 */

const OpenAI = require("openai");

// ─── Client Initializations ───────────────────────────────────────────────────

// OpenAI Client (For ATS Score Evaluation)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

// OpenRouter Client (For Professional AI Feedback - compatible with OpenAI SDK)
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Resume Analyzer",
  }
});

// ─── Domain Specialist Functions ──────────────────────────────────────────────

const getAtsAnalysisFromOpenAI = async (resumeText, targetJobTitle) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. 
Analyze the resume for the target role: "${targetJobTitle}".
Provide your analysis as a valid JSON object with EXACTLY this structure:
{
  "atsAnalysis": {
    "score": <number 0-100, be realistic, not everyone gets 90>,
    "grade": <"A" | "B" | "C" | "D" | "F">,
    "formatScore": <number 0-100>,
    "contentScore": <number 0-100>,
    "readabilityScore": <number 0-100>,
    "strengths": [<3-5 specific strengths>],
    "weaknesses": [<3-5 specific weaknesses>],
    "keywordsFound": [<8-15 important keywords found>],
    "keywordsMissing": [<5-10 keywords missing>]
  }
}
Resume:
${resumeText.substring(0, 3500)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You output nothing except valid JSON." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });
  
  const content = JSON.parse(response.choices[0].message.content);
  return content.atsAnalysis || content; 
};

const getSkillGapFromGemini = async (resumeText, parsedSkills, targetJobTitle) => {
  const prompt = `You are an expert technical career coach. 
Analyze the resume and skills against the target role: "${targetJobTitle}".
Current Skills Detected: ${parsedSkills}
Provide your analysis as a valid JSON object with EXACTLY this structure:
{
  "skillGap": {
    "targetRole": "${targetJobTitle}",
    "presentSkills": [<skills present from resume>],
    "missingSkills": [<8-12 skills missing for the role>],
    "prioritySkills": [<top 5 skills to learn first>],
    "recommendations": [<4-6 specific actionable recommendations>]
  }
}
Resume:
${resumeText.substring(0, 3500)}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json", 
        temperature: 0.2 
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Gemini API failed: ${response.status} ${await response.text()}`);
  }
  
  const data = await response.json();
  const textContent = data.candidates[0].content.parts[0].text;
  const content = JSON.parse(textContent);
  return content.skillGap || content;
};

const getAiFeedbackFromOpenRouter = async (resumeText, targetJobTitle) => {
  const prompt = `You are an expert career advisor.
Analyze the resume for the target role: "${targetJobTitle}".
Provide your analysis as a valid JSON object with EXACTLY this structure:
{
  "aiFeedback": {
    "summary": <2-3 sentence executive summary>,
    "detailedFeedback": <3-4 sentence detailed feedback>,
    "improvementSuggestions": [<5-7 actionable suggestions>],
    "keywordOptimization": [<5-8 keyword suggestions>],
    "industryAlignment": <1-2 sentences about industry fit>,
    "careerLevel": <"entry" | "mid" | "senior" | "executive">
  }
}
Resume:
${resumeText.substring(0, 3500)}`;

  const response = await openrouter.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct", // Fast and reliable OpenRouter model
    messages: [
      { role: "system", content: "You output nothing except valid JSON. No markdown blocks." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }, 
  });
  
  let contentStr = response.choices[0].message.content;
  // Strip potential markdown wrappers just in case the model ignored response_format
  contentStr = contentStr.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  
  const content = JSON.parse(contentStr);
  return content.aiFeedback || content;
};

// ─── Parallel Orchestration ───────────────────────────────────────────────────

/**
 * Analyze resume content using OpenAI, Gemini, and OpenRouter in parallel
 */
const analyzeResumeWithAI = async ({ resumeText, parsedData, targetJobTitle }) => {
  const USE_MOCK_ANALYSIS = process.env.USE_MOCK_ANALYSIS === "true" || false;
  
  if (USE_MOCK_ANALYSIS) {
    console.log("⚠️  Using MOCK analysis (OpenAI quota or API disabled)");
    return generateMockAnalysis(parsedData, targetJobTitle);
  }

  const skillsList = parsedData?.skills?.map((s) => s.name).join(", ") || "Not detected";
  const target = targetJobTitle || "General Industry Professional";

  // Pre-generate fallback mock data in case a single API fails (so we don't crash the whole analysis)
  const mockFallback = generateMockAnalysis(parsedData, target);

  console.log("🚀 Firing Parallel AI Requests (OpenAI, Gemini, OpenRouter)...");

  // Fire all 3 APIs simultaneously!
  const [atsAnalysis, skillGap, aiFeedback] = await Promise.all([
    getAtsAnalysisFromOpenAI(resumeText, target).catch((e) => {
      console.error("❌ OpenAI ATS Analysis Failed:", e.message);
      return mockFallback.atsAnalysis;
    }),
    getSkillGapFromGemini(resumeText, skillsList, target).catch((e) => {
      console.error("❌ Gemini Skill Gap Failed:", e.message);
      return mockFallback.skillGap;
    }),
    getAiFeedbackFromOpenRouter(resumeText, target).catch((e) => {
      console.error("❌ OpenRouter AI Feedback Failed:", e.message);
      return mockFallback.aiFeedback;
    })
  ]);

  console.log("✅ Parallel AI Requests Completed!");

  return {
    atsAnalysis,
    skillGap,
    aiFeedback
  };
};

/**
 * Generate mock analysis for testing (when quotas are exceeded)
 */
const generateMockAnalysis = (parsedData, targetJobTitle) => {
  const hasSkills = parsedData?.skills?.length > 0;
  const hasExperience = parsedData?.experience?.length > 0;
  const skills = parsedData?.skills?.map((s) => s.name) || [];
  
  return {
    atsAnalysis: {
      score: hasExperience ? 72 : 58,
      grade: hasExperience ? "B" : "C",
      formatScore: 85,
      contentScore: hasExperience ? 78 : 62,
      readabilityScore: 88,
      strengths: [
        "Clear contact information and professional summary",
        hasSkills ? "Technical skills well organized and listed" : "Professional profile structure",
        hasExperience ? "Relevant work experience documented" : "Educational background provided",
      ],
      weaknesses: [
        !hasExperience ? "Limited work experience or experience not detailed" : "Could add more quantifiable achievements",
        !hasSkills ? "Technical skills section could be more detailed" : "Action verbs could be stronger in job descriptions",
      ],
      keywordsFound: skills.slice(0, 10),
      keywordsMissing: ["project management", "data analysis", "agile methodology"],
    },
    skillGap: {
      targetRole: targetJobTitle || "General Tech Professional",
      presentSkills: skills.slice(0, 8),
      missingSkills: [
        "Advanced system design patterns",
        "Cloud platform expertise (AWS/Azure/GCP)",
        "Container orchestration",
      ],
      prioritySkills: ["System Design", "Cloud Platforms", "Advanced SQL"],
      recommendations: [
        "Add quantifiable achievements to each role (increased efficiency by X%, reduced costs by Y%)",
        "Update resume with latest technology trends relevant to your field",
      ],
    },
    aiFeedback: {
      summary: `${hasExperience ? "Experienced professional" : "Promising candidate"} with ${skills.length > 0 ? "solid technical skills" : "foundational knowledge"}.`,
      detailedFeedback: "Your resume demonstrates a structured approach to presenting your background. Focus on adding more quantifiable results.",
      improvementSuggestions: [
        "Replace generic job descriptions with achievement-focused bullet points",
        "Add specific metrics: ROI improvements, efficiency gains, cost reductions",
      ],
      keywordOptimization: [
        "Include industry buzzwords: 'scalable', 'high-performance', 'full-stack'",
        "Mention methodologies: 'agile', 'scrum', 'CI/CD'",
      ],
      industryAlignment: `Your background aligns well with the tech industry.`,
      careerLevel: hasExperience ? "mid" : "entry",
    },
  };
};

module.exports = { analyzeResumeWithAI };
