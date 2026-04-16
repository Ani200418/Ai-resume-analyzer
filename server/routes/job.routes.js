/**
 * Job Recommendation Routes
 */

const express = require("express");
const router = express.Router();
const { getJobRecommendations, getJobCategories } = require("../controllers/job.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/categories", getJobCategories);
router.get("/recommendations/:resumeId", getJobRecommendations);

module.exports = router;
