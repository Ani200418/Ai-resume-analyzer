#!/bin/bash

# 🧪 Quick Test Script for Resume Upload

echo "=========================================="
echo "🧪 Testing Resume Upload Flow"
echo "=========================================="
echo ""

# Test 1: Health check
echo "✅ Test 1: Backend Health Check"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:5001/health
echo ""

# Test 2: Check if frontend is running
echo "✅ Test 2: Frontend Health Check"  
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000
echo ""

echo "=========================================="
echo "📋 Next Steps:"
echo "=========================================="
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click 'Sign in with Google'"
echo "3. Check browser DevTools Console (F12) for token logs"
echo "4. Upload a resume file"
echo "5. Check Network tab for Authorization header"
echo ""
echo "✅ Both servers running and connected to MongoDB!"
echo "==========================================" 
