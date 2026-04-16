/**
 * Authentication Routes
 */

const express = require("express");
const router = express.Router();
const { signup, login, googleAuth, getMe, refreshToken } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");

// Public routes
router.post("/signup", validate("signup"), signup);
router.post("/login", validate("login"), login);
router.post("/google", validate("googleAuth"), googleAuth);

// Protected routes
router.get("/me", protect, getMe);
router.post("/refresh", protect, refreshToken);

module.exports = router;
