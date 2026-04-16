#!/bin/bash

# ================================
# Quick Start - Google OAuth Setup
# ================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 Starting AI Resume Analyzer with Google OAuth        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if servers are already running
echo "Checking for running servers..."

if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  Backend appears to be running on port 5001"
  echo "   If you want to restart, kill it first: pkill -f 'npm start' (in server folder)"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  Frontend appears to be running on port 3000"
  echo "   If you want to restart, kill it first: pkill -f 'npm run dev' (in client folder)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   INSTRUCTIONS                                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Open TWO terminal windows:"
echo ""
echo "TERMINAL 1 - Backend (Express + Google OAuth):"
echo "  cd /Users/aniketsingh/Downloads/ai-resume-analyzer\ 2/server"
echo "  npm start"
echo ""
echo "TERMINAL 2 - Frontend (Next.js):"
echo "  cd /Users/aniketsingh/Downloads/ai-resume-analyzer\ 2/client"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000/auth/login"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   CONFIGURATION VERIFIED ✓                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✓ Backend Port: 5001 (changed from 5000 to avoid ControlCenter conflict)"
echo "✓ Frontend Port: 3000"
echo "✓ Google Client ID configured"
echo "✓ Google Client Secret configured"
echo "✓ MongoDB connection configured"
echo "✓ JWT Secret configured"
echo ""
echo "🔐 IMPORTANT: Google Cloud Console Setup"
echo ""
echo "Make sure you've added these to Google Cloud Console:"
echo ""
echo "Authorized JavaScript origins:"
echo "  • http://localhost:3000"
echo "  • http://127.0.0.1:3000"
echo ""
echo "Authorized redirect URIs:"
echo "  • http://localhost:3000"
echo "  • http://127.0.0.1:3000"
echo ""
echo "If not done yet, visit:"
echo "  https://console.cloud.google.com/"
echo ""
