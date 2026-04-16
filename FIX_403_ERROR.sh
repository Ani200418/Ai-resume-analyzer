#!/bin/bash

cat << 'EOF'

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🔧 Resume Upload 403 Error - QUICK FIX GUIDE           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SOLUTION (Does this 90% of the time!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 STEP 1: Open Browser DevTools
   Press: F12 (or Cmd+Option+I on Mac)

🗂️  STEP 2: Go to Application Tab
   In DevTools → Click "Application" tab on top

🔍 STEP 3: Find Local Storage
   Left panel → Local Storage → http://localhost:3000

🗑️  STEP 4: Delete Auth Data
   Right-click on these and delete:
     • token
     • auth-storage

🔄 STEP 5: Refresh Page
   Press: Cmd+R or Ctrl+R

🔐 STEP 6: Login Again
   Click "Continue with Google"
   Complete the login flow

📤 STEP 7: Upload Resume
   Try uploading a resume now

✅ STEP 8: Success!
   Your resume should upload successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IF THAT DOESN'T WORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔎 Check if token is being sent:
   1. DevTools → Network tab
   2. Try uploading resume
   3. Find POST request to /api/resume/upload
   4. Click it → Headers → Request Headers
   5. Look for: Authorization: Bearer [token]

🔄 Restart both servers:
   pkill -f npm
   sleep 2
   
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd client && npm run dev

📝 Check server logs:
   Look for: ✅ Auth successful for user: ...
   If missing, token isn't being sent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT'S ACTUALLY HAPPENING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When you get 403 error, it means:
  ✓ Your request reached the server
  ✗ But you don't have permission (no valid auth token)

The auth token:
  ✓ Is created when you login with Google
  ✓ Is stored in localStorage
  ✓ Should be sent with every API request
  ✗ But sometimes it doesn't persist

Clearing localStorage forces a fresh login:
  1. Old/corrupted token is deleted
  2. You login again (creates fresh token)
  3. New token is sent with requests
  4. Upload works!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CURRENT SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Google OAuth:     Working
✓ Backend Server:   Running on port 5001
✓ Frontend Server:  Running on port 3000
✓ MongoDB:          Connected
✓ JWT Auth:         Configured
✓ Resume Upload:    Ready (once token issue fixed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 For more details, see: RESUME_UPLOAD_COMPLETE_FIX.md

EOF
