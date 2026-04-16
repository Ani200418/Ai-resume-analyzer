/**
 * OpenAI Integration Utility
 * Handles AI-powered resume analysis using GPT-4
 */

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze resume content using OpenAI GPT
 * Returns structured analysis: ATS score, skill gaps, and detailed feedback
 */
const analyzeResumeWithAI = async ({ resumeText, parsedData, targetJobTitle }) => {
  // ⚠️ FALLBACK: If OpenAI API quota is exceeded, return mock analysis
  // This allows testing without consuming API quota
  const USE_MOCK_ANALYSIS = process.env.USE_MOCK_ANALYSIS === "true" || false;
  
  if (USE_MOCK_ANALYSIS) {
    console.log("⚠️  Using MOCK analysis (OpenAI quota or API disabled)");
    return generateMockAnalysis(parsedData, targetJobTitle);
  }

  const skillsList = parsedData?.skills?.map((s) => s.name).join(", ") || "Not detected";
  const experienceList = parsedData?.experience
    ?.map((e) => `${e.title} at ${e.company} (${e.duration})`)
    .join("; ") || "Not detected";

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach with 15+ years of experience in HR and recruitment. Analyze the following resume and provide a detailed, structured assessment.

## Resume Content:
\`\`\`
${resumeText.substring(0, 4000)}
\`\`\`

## Parsed Data Summary:
- Skills: ${skillsList}
- Experience: ${experienceList}
- Target Job Title: ${targetJobTitle || "Not specified (analyze for general industry fit)"}

## Required Analysis:

Provide your analysis as a valid JSON object with EXACTLY this structure:

{
  "atsAnalysis": {
    "score": <number 0-100, be realistic and precise>,
    "grade": <"A" | "B" | "C" | "D" | "F">,
    "formatScore": <number 0-100>,
    "contentScore": <number 0-100>,
    "readabilityScore": <number 0-100>,
    "strengths": [<3-5 specific strengths as strings>],
    "weaknesses": [<3-5 specific weaknesses as strings>],
    "keywordsFound": [<8-15 important keywords found in resume>],
    "keywordsMissing": [<5-10 important keywords missing that ATS systems look for>]
  },
  "skillGap": {
    "targetRole": <"${targetJobTitle || "determined from resume context"}"},
    "presentSkills": [<list of skills clearly present>],
    "missingSkills": [<8-12 skills missing for the target role>],
    "prioritySkills": [<top 5 skills to learn first, ordered by importance>],
    "recommendations": [<4-6 specific actionable recommendations>]
  },
  "aiFeedback": {
    "summary": <2-3 sentence executive summary of the resume>,
    "detailedFeedback": <3-4 sentence detailed professional feedback>,
    "improvementSuggestions": [<5-7 specific, actionable improvement suggestions>],
    "keywordOptimization": [<5-8 specific keyword optimization suggestions>],
    "industryAlignment": <1-2 sentences about industry fit>,
    "careerLevel": <"entry" | "mid" | "senior" | "executive">
  }
}

IMPORTANT: 
- Be specific and realistic. Don't give everyone a 90+ score.
- Base suggestions on what's actually in the resume.
- Return ONLY valid JSON, no markdown, no explanations outside the JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyzer. Always respond with valid JSON only, no markdown code blocks, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent, structured output
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch {
      // Try to extract JSON from response if it's wrapped
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON response from OpenAI");
      }
    }

    // Validate required fields
    if (!analysisResult.atsAnalysis || !analysisResult.skillGap || !analysisResult.aiFeedback) {
      throw new Error("Incomplete analysis response from OpenAI");
    }

    // Ensure score is within bounds
    analysisResult.atsAnalysis.score = Math.min(100, Math.max(0, analysisResult.atsAnalysis.score));

    return analysisResult;

  } catch (error) {
    // ⚠️ If OpenAI quota exceeded, use mock analysis instead
    if (error.code === "insufficient_quota" || error.message?.includes("quota")) {
      console.log("⚠️  OpenAI quota exceeded, falling back to mock analysis...");
      return generateMockAnalysis(parsedData, targetJobTitle);
    }
    if (error.code === "invalid_api_key") {
      throw new Error("Invalid OpenAI API key. Please check configuration.");
    }
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

/**
 * Generate mock analysis for testing (when OpenAI quota is exceeded)
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
        "Clean formatting and readability",
        "Good use of industry keywords",
      ],
      weaknesses: [
        !hasExperience ? "Limited work experience or experience not detailed" : "Could add more quantifiable achievements",
        !hasSkills ? "Technical skills section could be more detailed" : "Missing some trending technologies",
        "Action verbs could be stronger in job descriptions",
        "Could include more metrics and results",
        "Missing certifications or additional qualifications",
      ],
      keywordsFound: skills.slice(0, 10),
      keywordsMissing: [
        "project management",
        "cloud infrastructure",
        "data analysis",
        "agile methodology",
        "system design",
        "code review",
        "documentation",
        "cross-functional collaboration",
      ],
    },
    skillGap: {
      targetRole: targetJobTitle || "General Tech Professional",
      presentSkills: skills.slice(0, 8),
      missingSkills: [
        "Advanced system design patterns",
        "Cloud platform expertise (AWS/Azure/GCP)",
        "Container orchestration",
        "Advanced SQL optimization",
        "Machine learning fundamentals",
        "DevOps practices",
        "Microservices architecture",
        "Performance optimization",
      ],
      prioritySkills: [
        "System Design",
        "Cloud Platforms",
        "Advanced SQL",
        "DevOps",
        "Architecture Patterns",
      ],
      recommendations: [
        "Add quantifiable achievements to each role (increased efficiency by X%, reduced costs by Y%)",
        "Include more technical projects or side projects with tangible results",
        "Update resume with latest technology trends relevant to your field",
        "Add a 'Certifications' section if you have any relevant credentials",
        "Consider adding a 'Languages' section if multilingual",
        "Highlight any leadership or mentoring experience",
      ],
    },
    aiFeedback: {
      summary: `${hasExperience ? "Experienced professional" : "Promising candidate"} with ${skills.length > 0 ? "solid technical skills" : "foundational knowledge"} and clear career progression. ${targetJobTitle ? `Well-suited for ${targetJobTitle} roles.` : "Good general profile."}`,
      detailedFeedback:
        "Your resume demonstrates a structured approach to presenting your background. The formatting is clean and professional. To strengthen your candidacy, focus on adding more quantifiable results and achievements in your role descriptions. Incorporate industry-specific keywords and technologies relevant to your target positions.",
      improvementSuggestions: [
        "Replace generic job descriptions with achievement-focused bullet points (use 'increased', 'reduced', 'improved', 'optimized')",
        "Add specific metrics: ROI improvements, efficiency gains, cost reductions, or performance improvements",
        "Include a 'Projects' section highlighting significant technical accomplishments",
        "Update technology stack to include recent tools and frameworks you've learned",
        "Add certifications or continuous learning achievements",
        "Include quantifiable impact of your contributions to previous roles",
        "Tailor each resume submission to highlight relevant experience for the target role",
      ],
      keywordOptimization: [
        "Add specific frameworks and tools you've used (React, Node.js, etc.)",
        "Include industry buzzwords: 'scalable', 'high-performance', 'full-stack', 'modern development'",
        "Mention methodologies: 'agile', 'scrum', 'CI/CD', 'automated testing'",
        "Add cloud platform references: 'AWS', 'Azure', 'GCP' if applicable",
        "Include metrics-focused language: 'increased', 'optimized', 'improved', 'reduced'",
        "Mention leadership/collaboration: 'cross-functional teams', 'mentoring', 'code reviews'",
        "Include 'API design', 'microservices', 'system architecture' if relevant to your role",
      ],
      industryAlignment: `Your background aligns well with the tech industry. Focus on highlighting modern development practices and technologies to improve alignment with current job market demands. ${targetJobTitle ? `Your profile matches well with ${targetJobTitle} requirements.` : ""}`,
      careerLevel: hasExperience ? (parsedData?.totalYearsExperience > 5 ? "senior" : "mid") : "entry",
    },
  };
};

module.exports = { analyzeResumeWithAI };
