/**
 * Resume Controller
 * Handles resume upload, parsing, and AI analysis
 */

const path = require("path");
const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume.model");
const User = require("../models/User.model");
const { AppError } = require("../middlewares/error.middleware");
const { analyzeResumeWithAI } = require("../utils/openai.util");
const { parseResumeText } = require("../utils/resumeParser.util");

// ─── POST /resume/upload ──────────────────────────────────────────────────────
const uploadResume = async (req, res, next) => {
  try {
    console.log("📄 Resume Upload Request:");
    console.log("   User ID:", req.user?.id);
    console.log("   File:", req.file?.originalname);
    console.log("   Body:", req.body);
    
    if (!req.file) {
      console.error("❌ No file uploaded");
      throw new AppError("No file uploaded. Please upload a PDF file.", 400);
    }

    const { targetJobTitle } = req.body;

    // Read and parse PDF
    let rawText;
    try {
      const fileBuffer = await fs.readFile(req.file.path);
      const pdfData = await pdfParse(fileBuffer);
      rawText = pdfData.text;
    } catch (parseError) {
      // Clean up uploaded file on parse error
      await fs.unlink(req.file.path).catch(() => {});
      throw new AppError("Failed to parse PDF. Please ensure it's a valid PDF file.", 422);
    }

    if (!rawText || rawText.trim().length < 50) {
      await fs.unlink(req.file.path).catch(() => {});
      throw new AppError("PDF appears to be empty or scanned. Please upload a text-based PDF.", 422);
    }

    // Parse structured data from raw text
    const parsedData = parseResumeText(rawText);

    // Create resume record
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      rawText: rawText.trim(),
      parsedData,
      targetJobTitle: targetJobTitle || null,
      analysisStatus: "pending",
    });

    // Increment user's analysis count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { analysisCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        analysisStatus: resume.analysisStatus,
        parsedData: resume.parsedData,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    // Clean up file if it was uploaded
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// ─── POST /resume/analyze/:id ─────────────────────────────────────────────────
const analyzeResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, userId: req.user.id });
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.analysisStatus === "processing") {
      throw new AppError("Analysis already in progress", 409);
    }

    // Mark as processing
    resume.analysisStatus = "processing";
    await resume.save();

    try {
      // Perform AI analysis
      const analysisResult = await analyzeResumeWithAI({
        resumeText: resume.rawText,
        parsedData: resume.parsedData,
        targetJobTitle: resume.targetJobTitle,
      });

      // Update resume with analysis results
      resume.atsAnalysis = analysisResult.atsAnalysis;
      resume.skillGap = analysisResult.skillGap;
      resume.aiFeedback = analysisResult.aiFeedback;
      resume.analysisStatus = "completed";
      resume.analysisError = null;
      await resume.save();

    } catch (aiError) {
      resume.analysisStatus = "failed";
      resume.analysisError = aiError.message;
      await resume.save();
      throw new AppError(`AI analysis failed: ${aiError.message}`, 500);
    }

    res.json({
      success: true,
      message: "Resume analyzed successfully",
      analysis: {
        atsAnalysis: resume.atsAnalysis,
        skillGap: resume.skillGap,
        aiFeedback: resume.aiFeedback,
        analysisStatus: resume.analysisStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /resume ──────────────────────────────────────────────────────────────
const getUserResumes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [resumes, total] = await Promise.all([
      Resume.find({ userId: req.user.id, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-rawText") // Exclude raw text for performance
        .lean(),
      Resume.countDocuments({ userId: req.user.id, isActive: true }),
    ]);

    res.json({
      success: true,
      resumes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /resume/:id ──────────────────────────────────────────────────────────
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /resume/:id ───────────────────────────────────────────────────────
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Soft delete
    resume.isActive = false;
    await resume.save();

    // Optionally delete file
    const filePath = path.join(__dirname, "..", resume.fileUrl);
    await fs.unlink(filePath).catch(() => {}); // Non-critical

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ─── GET /resume/:id/full ─────────────────────────────────────────────────────
const getFullAnalysis = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) throw new AppError("Resume not found", 404);

    if (resume.analysisStatus !== "completed") {
      throw new AppError(`Analysis is ${resume.analysisStatus}. Please wait or retry.`, 400);
    }

    res.json({
      success: true,
      data: {
        resume: {
          id: resume._id,
          fileName: resume.fileName,
          createdAt: resume.createdAt,
          targetJobTitle: resume.targetJobTitle,
        },
        parsedData: resume.parsedData,
        atsAnalysis: resume.atsAnalysis,
        skillGap: resume.skillGap,
        aiFeedback: resume.aiFeedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  getFullAnalysis,
};
