
# 🎯 RESUME UPLOAD 403 ERROR - VISUAL FIX GUIDE

## THE FIX (Do this first!)

```
┌─────────────────────────────────────────────┐
│  1️⃣  Press F12 to open DevTools            │
│      (Or Cmd+Option+I on Mac)               │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  2️⃣  Click "Application" tab at top         │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  3️⃣  Find "Local Storage" in left panel     │
│      • Expand it                            │
│      • Click "http://localhost:3000"        │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  4️⃣  Delete these two entries:              │
│      ✓ Right-click "token" → Delete         │
│      ✓ Right-click "auth-storage" → Delete  │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  5️⃣  Refresh page (Cmd+R or Ctrl+R)        │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  6️⃣  Login with Google again                │
│      Click "Continue with Google"           │
└─────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────┐
│  7️⃣  Try uploading a resume                 │
│      ✅ Should work now!                    │
└─────────────────────────────────────────────┘
```

---

## IF STEP 1 DOESN'T WORK

### Check: Is Token Being Sent?

```
DevTools → Network Tab → Upload Resume
                           ⬇️
Find: POST /api/resume/upload request
                           ⬇️
Click on it → Headers → Request Headers
                           ⬇️
Look for: Authorization: Bearer [token string]

✅ If you see it    → Token is being sent (server issue)
❌ If you DON'T see it → Token not sent (client issue)
```

### Check: Restart Servers

```
Terminal:
$ pkill -f npm
$ sleep 2

Terminal 1:
$ cd server && npm start

Terminal 2:
$ cd client && npm run dev
```

### Check: Server Logs

Look in the server terminal for:

```
✅ Good:
   ✅ Auth successful for user: your-email@gmail.com
   📄 Resume Upload Request:

❌ Bad:
   ❌ No token provided for protected route: POST /api/resume/upload
```

---

## WHAT'S IN YOUR LOCALSTORAGE?

Run this in browser console (F12 → Console):

```javascript
// Check token
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);

// Check auth
const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
console.log('User email:', auth.state?.user?.email);
console.log('Is authenticated:', auth.state?.isAuthenticated);
```

**Expected output:**
```
Token exists: true
Token length: 487
User email: your-email@gmail.com
Is authenticated: true
```

**If any are false/missing → Login again!**

---

## SYSTEM OVERVIEW

```
┌────────────────────────────────────────────────────────┐
│                 YOUR AI RESUME ANALYZER                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  FRONTEND (Port 3000)      BACKEND (Port 5001)        │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │ Next.js App      │      │ Express Server   │       │
│  │ ✓ Google OAuth   │──────│ ✓ JWT Verify     │       │
│  │ ✓ Resume Upload  │      │ ✓ File Upload    │       │
│  │ ✓ Auth Storage   │      │ ✓ PDF Parse      │       │
│  └──────────────────┘      └──────────────────┘       │
│         ⬇️                         ⬇️                  │
│    localStorage        MongoDB Database               │
│   (stores token)       (stores resumes)               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**The 403 error flow:**
```
Upload button clicked
         ⬇️
FormData created with resume
         ⬇️
Request sent to /api/resume/upload
         ⬇️
[Axios Interceptor: Add Authorization header]
         ⬇️
Authorization header added with token ✓ or ✗
         ⬇️
Server receives request
         ⬇️
Auth middleware checks header
         ⬇️
Token valid? → ✅ Upload proceeds
Token missing? → ❌ 403 Forbidden error
```

---

## SECURITY

Your `.env` file contains:
- `MONGODB_URI` - Database connection (exposed! ⚠️)
- `JWT_SECRET` - Auth signing key (exposed! ⚠️)
- `GOOGLE_CLIENT_SECRET` - OAuth secret (exposed! ⚠️)
- `OPENAI_API_KEY` - API key (exposed! ⚠️)

⚠️ **IMPORTANT:** Never commit `.env` files to git!
- These should only be in `.gitignore`
- Use secrets management in production

---

## QUICK CHECKLIST

```
Before uploading resume:

□ Logged in with Google?
  └─ If no → Login
□ Can see user profile after login?
  └─ If no → Login again
□ Browser DevTools shows token in localStorage?
  └─ If no → Clear storage & login again
□ Resume is a PDF file?
  └─ If not → Convert to PDF
□ Resume file is under 10MB?
  └─ If not → Compress or split
□ Backend server running (port 5001)?
  └─ If no → Run: npm start
□ Frontend server running (port 3000)?
  └─ If no → Run: npm run dev

All checked? ✅ Try uploading!
```

---

## SUMMARY

| What | Status | Fix |
|------|--------|-----|
| Google Login | ✅ Works | - |
| Resume Upload | ❌ 403 | Clear localStorage & login |
| Backend | ✅ Running | - |
| Frontend | ✅ Running | - |
| Database | ✅ Connected | - |

**Next step:** Follow the fix at the top! 🚀
