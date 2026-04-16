/**
 * Request Validation Middleware
 * Uses Joi for schema validation
 */

const Joi = require("joi");

// ─── Validation Schemas ───────────────────────────────────────────────────────

const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(100).required().trim()
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
      }),
    email: Joi.string().email().required().lowercase().trim()
      .messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .min(8)
      .max(72)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().lowercase().trim()
      .messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string().required()
      .messages({ "any.required": "Password is required" }),
  }),

  googleAuth: Joi.object({
    credential: Joi.string().required()
      .messages({ "any.required": "Google credential is required" }),
  }),

  resumeUpload: Joi.object({
    targetJobTitle: Joi.string().max(100).optional().allow(""),
  }),
};

// ─── Validation Middleware Factory ────────────────────────────────────────────
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) return next();

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors at once
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map((d) => d.message).join(". ");
      return res.status(400).json({
        success: false,
        error: errorMessages,
        details: error.details.map((d) => ({
          field: d.path[0],
          message: d.message,
        })),
      });
    }

    req.body = value; // Use validated/sanitized values
    next();
  };
};

module.exports = { validate };
