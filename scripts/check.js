#!/usr/bin/env node
/**
 * Pre-flight check — run this before starting the app to diagnose issues.
 * Usage: node scripts/check.js
 */

const fs = require("fs");
const path = require("path");

const RED    = "\x1b[31m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";

let hasError = false;

function ok(msg)   { console.log(`  ${GREEN}✓${RESET}  ${msg}`); }
function warn(msg) { console.log(`  ${YELLOW}⚠${RESET}  ${msg}`); }
function fail(msg) { console.log(`  ${RED}✗${RESET}  ${msg}`); hasError = true; }
function info(msg) { console.log(`  ${CYAN}i${RESET}  ${msg}`); }

console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
console.log(`${CYAN}  AI Resume Analyzer — Pre-flight Check   ${RESET}`);
console.log(`${CYAN}══════════════════════════════════════════${RESET}\n`);

// ─── Check server/.env ────────────────────────────────────────────────────────
console.log("📋 Server environment (server/.env):");

const serverEnvPath = path.join(__dirname, "..", "server", ".env");
if (!fs.existsSync(serverEnvPath)) {
  fail("server/.env not found!");
  info("Run: cp server/.env.example server/.env  then fill in the values.");
} else {
  ok("server/.env exists");

  // Parse env file
  const envContent = fs.readFileSync(serverEnvPath, "utf8");
  const envVars = {};
  envContent.split("\n").forEach(line => {
    const [key, ...vals] = line.split("=");
    if (key && !key.startsWith("#")) envVars[key.trim()] = vals.join("=").trim();
  });

  // Check MONGODB_URI
  if (!envVars.MONGODB_URI || envVars.MONGODB_URI.includes("<") || envVars.MONGODB_URI.includes("username:password")) {
    fail("MONGODB_URI is not configured. Get a free URI at https://cloud.mongodb.com");
  } else {
    ok(`MONGODB_URI is set (${envVars.MONGODB_URI.substring(0, 30)}...)`);
  }

  // Check JWT_SECRET
  if (!envVars.JWT_SECRET || envVars.JWT_SECRET.includes("CHANGE_THIS") || envVars.JWT_SECRET.length < 32) {
    fail("JWT_SECRET is not set or too short (needs 32+ random chars).");
    info("Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
  } else {
    ok("JWT_SECRET is set");
  }

  // Check OPENAI_API_KEY
  if (!envVars.OPENAI_API_KEY || envVars.OPENAI_API_KEY.includes("your_openai")) {
    warn("OPENAI_API_KEY not set — AI analysis will fail. Get one at https://platform.openai.com/api-keys");
  } else if (!envVars.OPENAI_API_KEY.startsWith("sk-")) {
    warn("OPENAI_API_KEY looks invalid (should start with 'sk-')");
  } else {
    ok("OPENAI_API_KEY is set");
  }

  // Check Google OAuth (optional)
  if (!envVars.GOOGLE_CLIENT_ID || envVars.GOOGLE_CLIENT_ID.includes("your_google")) {
    warn("GOOGLE_CLIENT_ID not set — Google login will be unavailable (optional).");
  } else {
    ok("GOOGLE_CLIENT_ID is set");
  }
}

// ─── Check client/.env.local ──────────────────────────────────────────────────
console.log("\n📋 Client environment (client/.env.local):");

const clientEnvPath = path.join(__dirname, "..", "client", ".env.local");
if (!fs.existsSync(clientEnvPath)) {
  warn("client/.env.local not found — using defaults.");
  info("Run: cp client/.env.example client/.env.local");
  info("BACKEND_URL defaults to http://localhost:5000 — that's fine for local dev.");
} else {
  ok("client/.env.local exists");
}

// ─── Check uploads directory ──────────────────────────────────────────────────
console.log("\n📁 Uploads directory:");
const uploadsPath = path.join(__dirname, "..", "server", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fail("server/uploads/ directory missing!");
  info("Run: mkdir -p server/uploads");
} else {
  ok("server/uploads/ exists");
  // Check write permissions
  try {
    const testFile = path.join(uploadsPath, ".write_test");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    ok("server/uploads/ is writable");
  } catch {
    fail("server/uploads/ is NOT writable — file uploads will fail!");
    info("Run: chmod 755 server/uploads");
  }
}

// ─── Check node_modules ───────────────────────────────────────────────────────
console.log("\n📦 Dependencies:");
const serverModules = path.join(__dirname, "..", "server", "node_modules");
const clientModules = path.join(__dirname, "..", "client", "node_modules");

if (!fs.existsSync(serverModules)) {
  fail("server/node_modules missing — run: cd server && npm install");
} else {
  ok("server dependencies installed");
}

if (!fs.existsSync(clientModules)) {
  fail("client/node_modules missing — run: cd client && npm install");
} else {
  ok("client dependencies installed");
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
if (hasError) {
  console.log(`${RED}  ✗ Issues found — fix the errors above before starting.${RESET}`);
} else {
  console.log(`${GREEN}  ✓ All checks passed! Start the app with: npm run dev${RESET}`);
}
console.log(`${CYAN}══════════════════════════════════════════${RESET}\n`);

process.exit(hasError ? 1 : 0);
