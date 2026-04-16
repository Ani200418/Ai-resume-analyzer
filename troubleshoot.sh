#!/bin/bash

# Interactive Google OAuth Troubleshooter

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🔐 Google OAuth Troubleshooter                         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="${GREEN}✓${NC}"
cross_mark="${RED}✗${NC}"

# 1. Configuration
echo "${YELLOW}1. Configuration Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CLIENT_ID=$(grep "NEXT_PUBLIC_GOOGLE_CLIENT_ID" client/.env.local | cut -d'=' -f2)
SERVER_ID=$(grep "GOOGLE_CLIENT_ID=" server/.env | head -1 | cut -d'=' -f2)

if [ "$CLIENT_ID" = "$SERVER_ID" ]; then
  echo -e "${check_mark} Client ID matches Server ID"
else
  echo -e "${cross_mark} Client ID does NOT match Server ID"
fi

if [ ! -z "$CLIENT_ID" ] && [ "$CLIENT_ID" != "your_google_client_id.apps.googleusercontent.com" ]; then
  echo -e "${check_mark} Client ID is configured: $CLIENT_ID"
else
  echo -e "${cross_mark} Client ID is NOT configured"
fi

echo ""

# 2. Servers
echo "${YELLOW}2. Server Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${check_mark} Backend running on port 5000"
else
  echo -e "${cross_mark} Backend NOT running on port 5000"
  echo "         Fix: cd server && npm start"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${check_mark} Frontend running on port 3000"
else
  echo -e "${cross_mark} Frontend NOT running on port 3000"
  echo "         Fix: cd client && npm run dev"
fi

echo ""

# 3. Backend Health
echo "${YELLOW}3. Backend Health${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEALTH=$(curl -s http://localhost:5000/health 2>/dev/null)
if echo "$HEALTH" | grep -q "OK"; then
  echo -e "${check_mark} Backend API is healthy"
else
  echo -e "${cross_mark} Backend API is not responding"
  echo "         Make sure server is running"
fi

echo ""

# 4. Next Steps
echo "${YELLOW}4. Next Steps${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "❶ Go to Google Cloud Console:"
echo "   https://console.cloud.google.com/"
echo ""
echo "❷ Click on OAuth 2.0 Client ID (Web application)"
echo ""
echo "❸ Add BOTH of these to 'Authorized JavaScript origins':"
echo "   • http://localhost:3000"
echo "   • http://127.0.0.1:3000"
echo ""
echo "❹ Add BOTH of these to 'Authorized redirect URIs':"
echo "   • http://localhost:3000"
echo "   • http://127.0.0.1:3000"
echo ""
echo "❺ Click SAVE"
echo ""
echo "❻ Clear browser cache (Cmd+Shift+Delete)"
echo ""
echo "❼ Test: Open http://localhost:3000/auth/login"
echo ""
echo "❾ Click 'Continue with Google'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📞 Need help? Check: GOOGLE_AUTH_TROUBLESHOOTING.md"
echo ""
