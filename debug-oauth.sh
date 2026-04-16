#!/bin/bash

# ================================
# Google OAuth Debugging Script
# ================================

echo "🔍 Google OAuth Debugging Checklist"
echo "===================================="
echo ""

# 1. Check configuration
echo "1️⃣  CONFIGURATION CHECK"
echo "   Client ID (client):"
grep "NEXT_PUBLIC_GOOGLE_CLIENT_ID" client/.env.local | sed 's/=/ /'
echo "   Client ID (server):"
grep "GOOGLE_CLIENT_ID=" server/.env | head -1 | sed 's/=/ /'
echo "   Client Secret (server):"
if grep -q "GOOGLE_CLIENT_SECRET" server/.env; then
  echo "   ✅ GOOGLE_CLIENT_SECRET configured"
else
  echo "   ❌ GOOGLE_CLIENT_SECRET missing"
fi
echo ""

# 2. Check servers
echo "2️⃣  SERVER STATUS"
echo "   Checking if servers are running..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "   ✅ Backend (port 5000) is running"
else
  echo "   ❌ Backend (port 5000) is NOT running - Start with: cd server && npm start"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "   ✅ Frontend (port 3000) is running"
else
  echo "   ❌ Frontend (port 3000) is NOT running - Start with: cd client && npm run dev"
fi
echo ""

# 3. Test backend endpoint
echo "3️⃣  BACKEND CONNECTIVITY"
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
  echo "   ✅ Backend API is reachable"
else
  echo "   ❌ Backend API is not reachable - Make sure server is running on port 5000"
fi
echo ""

# 4. Dependencies check
echo "4️⃣  DEPENDENCIES"
echo "   Checking google-auth-library in server:"
cd server
if npm list google-auth-library > /dev/null 2>&1; then
  echo "   ✅ google-auth-library is installed"
else
  echo "   ❌ google-auth-library is missing - Run: npm install google-auth-library"
fi
cd ..
echo ""

echo "📋 DEBUGGING STEPS:"
echo "   1. Open browser DevTools (F12 or Cmd+Option+I)"
echo "   2. Go to http://localhost:3000/auth/login"
echo "   3. Click 'Continue with Google'"
echo "   4. Check Console tab for errors"
echo "   5. Check server terminal for logs starting with '🔐 Google Auth'"
echo ""

echo "🆘 COMMON ISSUES:"
echo "   ❌ 'credentials parameter is invalid'"
echo "      → Check NEXT_PUBLIC_GOOGLE_CLIENT_ID in client/.env.local"
echo ""
echo "   ❌ 'audience mismatch'"
echo "      → Client ID and Server ID must match exactly"
echo ""
echo "   ❌ 'Invalid value for: origin'"
echo "      → Add http://localhost:3000 to Google Cloud Console authorized origins"
echo ""
echo "   ❌ 'Cannot reach the server'"
echo "      → Make sure backend is running on port 5000"
