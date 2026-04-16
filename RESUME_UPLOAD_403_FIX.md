# Resume Upload 403 Error - Quick Fix

## 🔍 Problem
When uploading a resume, you get: **Request failed with status code 403 (Forbidden)**

## ✅ Most Likely Cause
The JWT token from Google login isn't being sent with the upload request.

## 🔧 Quick Fix - Try These Steps in Order

### Step 1: Clear Browser Storage & Re-login (90% works)
```
1. Open your browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete the "token" entry
4. Delete the "auth-storage" entry
5. Refresh the page
6. Login with Google again
7. Try uploading a resume
```

### Step 2: Check if Token is Being Sent
```
1. Open DevTools (F12)
2. Go to Network tab
3. Try uploading a resume
4. Look for POST request to `/api/resume/upload`
5. Click it → Headers → Request Headers
6. Verify you see: Authorization: Bearer [long-token-string]
   - If missing → token not being sent
   - If present → server auth issue
```

### Step 3: Restart Both Servers
```bash
# Kill all node processes
pkill -f npm

# Terminal 1: Start Backend
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/server"
npm start

# Terminal 2: Start Frontend  
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/client"
npm run dev
```

### Step 4: Test Directly
Open browser console (F12 → Console) and run:
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');

// Check auth storage
const auth = localStorage.getItem('auth-storage');
console.log('Auth:', auth ? JSON.parse(auth).state.user : 'NO AUTH');
```

If these are empty, you need to login again.

## 🚀 If Step 1 Fixes It
Your issue is solved! The token wasn't persisting across page refreshes.

## 🆘 If Still Getting 403

Check these in order:

1. **Is token in localStorage?**
   - DevTools → Application → Local Storage → check "token" exists
   - If no → login again

2. **Is Authorization header being sent?**
   - DevTools → Network → Upload request → Headers
   - Look for `Authorization: Bearer ...`
   - If missing → axios interceptor issue

3. **Is backend receiving token?**
   - Check server terminal logs
   - Should show: `✅ Auth successful for user: your-email@gmail.com`
   - If not → token not being sent

4. **Is token valid?**
   - Token might be expired
   - Try login again

## 📝 What's Happening Behind the Scenes

```
1. You login with Google → JWT token created ✓
2. Token stored in localStorage ✓
3. Upload request made to /api/resume/upload ✓
4. Axios interceptor adds Authorization header ✓
5. Backend auth middleware checks token ✓
6. If token missing or invalid → 403 error
```

## 🎯 99% of the Time

**The fix is Step 1: Clear localStorage and login again!**

---

**Try these steps and let me know if it works!**
