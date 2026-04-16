/**
 * Authentication Middleware
 * JWT verification and route protection
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { AppError } = require("./error.middleware");

/**
 * Protect routes — verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.error("❌ No token provided for protected route:", req.method, req.path);
      console.error("   Authorization header:", req.headers.authorization);
      throw new AppError("Access denied. No token provided.", 401);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        throw new AppError("Token expired. Please login again.", 401);
      }
      throw new AppError("Invalid token. Please login again.", 401);
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new AppError("User belonging to this token no longer exists.", 401);
    }

    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth — attach user if token exists, but don't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    // Silently fail — user is just not authenticated
  }
  next();
};

/**
 * Restrict to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
};

module.exports = { protect, optionalAuth, restrictTo };
