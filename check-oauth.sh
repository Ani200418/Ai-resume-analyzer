#!/bin/bash

# ================================
# Google OAuth Configuration Check
# ================================
# This script verifies your Google OAuth setup

echo "🔍 Google OAuth Configuration Checker"
echo "======================================"
echo ""

# Check client environment
echo "📱 CLIENT SETUP (.env.local):"
if [ -f "client/.env.local" ]; then
  CLIENT_ID=$(grep "NEXT_PUBLIC_GOOGLE_CLIENT_ID" client/.env.local | cut -d'=' -f2)
  if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" = "your_google_client_id.apps.googleusercontent.com" ]; then
    echo "❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured"
  else
    echo "✅ NEXT_PUBLIC_GOOGLE_CLIENT_ID configured"
  fi
else
  echo "❌ client/.env.local not found"
fi

APP_URL=$(grep "NEXT_PUBLIC_APP_URL" client/.env.local | cut -d'=' -f2)
echo "   NEXT_PUBLIC_APP_URL: $APP_URL"

echo ""

# Check server environment
echo "🖥️  SERVER SETUP (server/.env):"
if [ -f "server/.env" ]; then
  SERVER_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID" server/.env | head -1 | cut -d'=' -f2)
  SERVER_CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET" server/.env | cut -d'=' -f2)
  
  if [ -z "$SERVER_CLIENT_ID" ] || [ "$SERVER_CLIENT_ID" = "your_google_client_id.apps.googleusercontent.com" ]; then
    echo "❌ GOOGLE_CLIENT_ID not configured"
  else
    echo "✅ GOOGLE_CLIENT_ID configured"
  fi
  
  if [ -z "$SERVER_CLIENT_SECRET" ] || [ "$SERVER_CLIENT_SECRET" = "your_google_client_secret" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET not configured"
  else
    echo "✅ GOOGLE_CLIENT_SECRET configured"
  fi
else
  echo "❌ server/.env not found"
fi

echo ""
echo "📋 CHECKLIST:"
echo "   ☐ Both client and server have GOOGLE_CLIENT_ID"
echo "   ☐ Server has GOOGLE_CLIENT_SECRET"
echo "   ☐ BACKEND_URL in client/.env.local is correct"
echo "   ☐ Google Cloud Console allows http://localhost:3000"
echo "   ☐ Google Cloud Console allows http://localhost:5000"
echo "   ☐ Both servers are running (port 3000 and 5000)"
echo ""
echo "🔗 Next Steps:"
echo "   1. Ensure both servers are running"
echo "   2. Check browser console for errors (F12)"
echo "   3. Check server logs for auth errors"
echo "   4. Verify Google credentials in Google Cloud Console"
