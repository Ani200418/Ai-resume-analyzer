/**
 * Resume Routes
 */

const express = require("express");
const router = express.Router();
const {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  getFullAnalysis,
} = require("../controllers/resume.controller");
const { protect } = require("../middlewares/auth.middleware");
const { uploadSingle } = require("../middlewares/upload.middleware");

// All routes require authentication
router.use(protect);

router.get("/", getUserResumes);
router.post("/upload", uploadSingle, uploadResume);
router.post("/analyze/:id", analyzeResume);
router.get("/:id", getResumeById);
router.get("/:id/full", getFullAnalysis);
router.delete("/:id", deleteResume);

module.exports = router;
