#!/bin/bash

# ================================
# Google OAuth Complete Diagnostic
# ================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🔍 Google OAuth Complete Diagnostic                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}1. ENVIRONMENT CONFIGURATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

CLIENT_ID=$(grep "NEXT_PUBLIC_GOOGLE_CLIENT_ID" client/.env.local 2>/dev/null | cut -d'=' -f2 | xargs)
SERVER_ID=$(grep "GOOGLE_CLIENT_ID=" server/.env 2>/dev/null | head -1 | cut -d'=' -f2 | xargs)
SERVER_SECRET=$(grep "GOOGLE_CLIENT_SECRET=" server/.env 2>/dev/null | cut -d'=' -f2 | xargs)

echo "Client ID:     $CLIENT_ID"
echo "Server ID:     $SERVER_ID"
echo "Server Secret: ${SERVER_SECRET:0:10}...${SERVER_SECRET: -10}"

if [ "$CLIENT_ID" = "$SERVER_ID" ]; then
  echo -e "${GREEN}✓${NC} IDs match"
else
  echo -e "${RED}✗${NC} IDs DO NOT MATCH - This will cause auth to fail!"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}2. SERVER STATUS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  PID=$(lsof -Pi :5000 -sTCP:LISTEN -t | head -1)
  PROCESS=$(ps -p $PID -o comm=)
  echo -e "${GREEN}✓${NC} Port 5000 is in use by: $PROCESS (PID: $PID)"
  
  # Check if it's our Node process
  if [[ "$PROCESS" == *"node"* ]] || [[ "$PROCESS" == *"npm"* ]]; then
    echo -e "${GREEN}✓${NC} Looks like backend is running"
    
    # Try to connect
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
      echo -e "${GREEN}✓${NC} Backend is responding to requests"
    else
      echo -e "${RED}✗${NC} Backend is listening but not responding - may be stuck"
    fi
  else
    echo -e "${RED}✗${NC} Port 5000 is in use by something else (not Node.js)"
    echo "   Try: lsof -i :5000 and kill the process"
  fi
else
  echo -e "${RED}✗${NC} Port 5000 is NOT in use - Backend is not running"
  echo "   Start with: cd server && npm start"
fi

echo ""

# Check port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  PID=$(lsof -Pi :3000 -sTCP:LISTEN -t | head -1)
  PROCESS=$(ps -p $PID -o comm=)
  echo -e "${GREEN}✓${NC} Port 3000 is in use by: $PROCESS (PID: $PID)"
  if [[ "$PROCESS" == *"node"* ]] || [[ "$PROCESS" == *"npm"* ]]; then
    echo -e "${GREEN}✓${NC} Frontend looks like it's running"
  fi
else
  echo -e "${RED}✗${NC} Port 3000 is NOT in use - Frontend is not running"
  echo "   Start with: cd client && npm run dev"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}3. NETWORK CONNECTIVITY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo "Testing connections..."

# Test backend health
HEALTH=$(curl -s -w "\n%{http_code}" http://localhost:5000/health)
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓${NC} Backend health check: OK (200)"
else
  echo -e "${RED}✗${NC} Backend health check: Failed (HTTP $HTTP_CODE)"
fi

# Test frontend
FRONTEND=$(curl -s -w "\n%{http_code}" http://localhost:3000)
HTTP_CODE=$(echo "$FRONTEND" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓${NC} Frontend is accessible: OK (200)"
else
  echo -e "${RED}✗${NC} Frontend not accessible: Failed (HTTP $HTTP_CODE)"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}4. DEPENDENCIES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check google-auth-library
cd server > /dev/null 2>&1
if npm list google-auth-library > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} google-auth-library is installed"
else
  echo -e "${RED}✗${NC} google-auth-library is NOT installed"
  echo "   Fix: npm install"
fi
cd .. > /dev/null 2>&1

# Check required files
echo ""
if [ -f "server/.env" ]; then
  echo -e "${GREEN}✓${NC} server/.env exists"
else
  echo -e "${RED}✗${NC} server/.env NOT found"
fi

if [ -f "client/.env.local" ]; then
  echo -e "${GREEN}✓${NC} client/.env.local exists"
else
  echo -e "${RED}✗${NC} client/.env.local NOT found"
fi

if [ -f "client/app/api/auth/google/route.ts" ]; then
  echo -e "${GREEN}✓${NC} Google auth API route exists"
else
  echo -e "${RED}✗${NC} Google auth API route NOT found"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}5. QUICK FIXES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo ""
echo "If backend is not running:"
echo "  1. cd server"
echo "  2. npm install  (if needed)"
echo "  3. npm start"
echo ""
echo "If you get 'port already in use':"
echo "  lsof -i :5000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
echo ""
echo "If Google auth still fails:"
echo "  1. Open browser DevTools (F12)"
echo "  2. Go to http://localhost:3000/auth/login"
echo "  3. Click 'Continue with Google'"
echo "  4. Check Console for errors"
echo "  5. Check server terminal for '🔐 Google Auth' logs"
echo ""
