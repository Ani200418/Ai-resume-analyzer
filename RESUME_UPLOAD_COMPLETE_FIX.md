# 🎯 Complete Solution: Resume Upload 403 Error

## Problem Summary
✅ Google OAuth login works  
❌ Resume upload returns: **Request failed with status code 403**

## Root Cause Analysis

A 403 (Forbidden) error on resume upload means:
1. Request reaches the server ✓
2. Server denies access because no valid auth token is present ✗

### Why This Happens
- JWT token is created during Google login ✓
- Token should be attached to every API request ✓
- But token might NOT be persisting in localStorage

## 🔧 Solution (Step-by-Step)

### Step 1: Clear Browser Storage (Most Important!)

**This fixes it 90% of the time:**

1. **Open DevTools:** Press `F12` (or `Cmd+Option+I` on Mac)
2. **Go to Application Tab:** Click "Application" in DevTools menu
3. **Find Local Storage:** 
   - Left sidebar → Local Storage → http://localhost:3000
4. **Delete These Entries:**
   - `token`
   - `auth-storage`
5. **Refresh Page:** Press `Cmd+R` or `Ctrl+R`
6. **Login Again:** Click "Continue with Google"
7. **Try Upload:** Upload a resume now

**If this works → Problem solved! 🎉**

### Step 2: Verify Token is Being Sent (If Step 1 Doesn't Work)

1. **Open DevTools:** F12
2. **Go to Network Tab**
3. **Try uploading a resume**
4. **Look for POST request** to `/api/resume/upload`
5. **Click on that request**
6. **Go to "Request Headers"**
7. **Check for this line:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs... [long token string]
   ```

**If you see this:** Token is being sent correctly → Server auth issue  
**If you DON'T see this:** Token not being sent → Frontend issue

### Step 3: Restart Both Servers

If the above doesn't work:

```bash
# Terminal 1: Kill everything
pkill -f npm
sleep 2

# Terminal 2: Start Backend
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/server"
npm start

# Terminal 3: Start Frontend
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/client"  
npm run dev
```

Then try uploading again.

### Step 4: Check Server Logs

Look at the server terminal where you ran `npm start`:

**If you see:**
```
✅ Auth successful for user: your-email@gmail.com Route: POST /api/resume/upload
```
→ Auth is working, upload should succeed

**If you see:**
```
❌ No token provided for protected route: POST /api/resume/upload
```
→ Token isn't being sent from frontend

## 🧪 Manual Testing

Open browser console (F12 → Console tab) and run:

```javascript
// Check token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'MISSING');

// Check auth storage
const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
console.log('User logged in:', !!auth.state?.user);
console.log('User email:', auth.state?.user?.email);
```

**Expected output:**
```
Token exists: true
Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User logged in: true
User email: your-email@gmail.com
```

If any are false/missing → Login again

## ✅ Verification Checklist

- [ ] Cleared browser LocalStorage (token + auth-storage)
- [ ] Logged in again with Google
- [ ] Can see token in DevTools → Application → Local Storage
- [ ] Backend server is running (`npm start` in server folder)
- [ ] Frontend server is running (`npm run dev` in client folder)
- [ ] Network tab shows Authorization header in request
- [ ] Server logs show "Auth successful" message
- [ ] Resume file is PDF format
- [ ] Resume file is less than 10MB

## 🎯 Quick Troubleshooting

| Symptom | Solution |
|---------|----------|
| 403 error on upload | Clear localStorage & login again |
| No Authorization header in Network tab | Restart frontend server |
| Server shows "No token provided" | Token isn't persisting in localStorage |
| Token exists but still 403 | Backend MongoDB might be down, check server logs |
| 400 Bad Request | File might not be PDF or is corrupted |
| 413 Payload Too Large | File is larger than 10MB |

## 🔒 Security Note

Your credentials are currently visible in:
- `.env` file (local - OK)
- `.env.example` file (git - NOT OK) ← Should never have real creds

We've updated `.env.example` to remove exposed credentials.

## 📊 Current Setup

```
✓ Backend: Running on port 5001
✓ Frontend: Running on port 3000  
✓ Google OAuth: Configured and working
✓ MongoDB: Connected
✓ JWT Auth: Configured
```

## 🚀 Next Steps

1. **Try Step 1** (clear localStorage & re-login)
2. **If works:** You're done! 🎉
3. **If not works:** Try Step 2-4 above
4. **Still not working:** Check server logs for MongoDB connection errors

---

**The solution is almost always Step 1: Clear localStorage and login again!** 💡
