/**
 * Authentication Controller
 * Handles signup, login, Google OAuth, and token refresh
 */

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User.model");
const { AppError } = require("../middlewares/error.middleware");

// Validate Google OAuth configuration
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("❌ GOOGLE_CLIENT_ID is not set in environment variables!");
} else {
  console.log("✅ Google OAuth configured with Client ID:", process.env.GOOGLE_CLIENT_ID.substring(0, 15) + "...");
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ─── Helper: Token Response ───────────────────────────────────────────────────
const sendTokenResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  
  res.status(statusCode).json({
    success: true,
    token,
    user: user.getPublicProfile(),
  });
};

// ─── POST /auth/signup ────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      authProvider: "local",
      isVerified: true, // Skip email verification for MVP
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Include password for comparison
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      authProvider: "local",
    }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(res, user);
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/google ────────────────────────────────────────────────────────
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      console.error("❌ Google Auth - No credential provided in request body");
      throw new AppError("Google credential is required", 400);
    }

    // Verify Google ID token
    console.log("🔐 Google Auth - Verifying token...");
    console.log("   Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("   Token length:", credential.length);
    console.log("   Token preview:", credential.substring(0, 50) + "...");
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    console.log("✅ Token verified for email:", email);

    // Find or create user
    let user = await User.findOne({ 
      $or: [{ googleId }, { email: email.toLowerCase() }] 
    });

    if (user) {
      // Update Google ID if user signed up with email before
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.avatar = picture;
      }
    } else {
      // Create new Google user
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        authProvider: "google",
        isVerified: true,
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(res, user);
  } catch (error) {
    console.error("❌ Google Auth Error:");
    console.error("   Message:", error.message);
    console.error("   Type:", error.constructor.name);
    console.error("   Stack:", error.stack);
    
    if (error.message?.includes("Token used too late")) {
      return next(new AppError("Google token expired, please try again", 401));
    }
    if (error.message?.includes("Invalid audience")) {
      console.error("   ⚠️  MISMATCH: Server GOOGLE_CLIENT_ID doesn't match the credential's audience");
      console.error("   FIX: Ensure GOOGLE_CLIENT_ID in server/.env matches NEXT_PUBLIC_GOOGLE_CLIENT_ID in client/.env.local");
      return next(new AppError("Invalid Google credentials configuration", 400));
    }
    if (error.message?.includes("JwtRuntimeError") || error.message?.includes("Unable to find a signing certificate") || error.message?.includes("Error fetching")) {
      console.error("   ⚠️  Certificate or network error verifying token");
      console.error("   FIX: Check your Google credentials in Google Cloud Console or try clearing browser cache");
      return next(new AppError("Google token verification failed. Please try again.", 401));
    }
    if (error.message?.includes("Invalid client")) {
      console.error("   ⚠️  Invalid client configuration");
      console.error("   FIX: Check GOOGLE_CLIENT_ID is correct in server/.env");
      return next(new AppError("Invalid Google client configuration", 400));
    }
    
    next(error);
  }
};

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/refresh ───────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    sendTokenResponse(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, googleAuth, getMe, refreshToken };
