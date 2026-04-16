# Resume Upload 403 Error - Debugging Guide

## 🔍 What's Happening

When you try to upload a resume, you're getting a **403 Forbidden** error. This means the server is receiving your request but denying access.

## ❌ Likely Causes

### 1. **Token Not Being Sent** (Most Common)
- The JWT token from Google login isn't being attached to the upload request
- The token might have expired
- The localStorage might not have the token

### 2. **Token Invalid**
- Token format is wrong
- Token is expired
- JWT_SECRET mismatch between client and server

### 3. **Authentication Header Not Received**
- Axios interceptor not working with multipart form data
- CORS issue preventing headers

## 🔧 How to Debug

### Step 1: Check Browser LocalStorage

Open DevTools (F12) → Application → Local Storage → http://localhost:3000

Look for:
- `token` - Should contain a long JWT string
- `auth-storage` - Should have user data and token

If these are missing, login again is required.

### Step 2: Check Network Request

In DevTools:
1. Go to **Network** tab
2. Try to upload a resume
3. Look for the POST request to `/api/resume/upload`
4. Click on it and check:
   - **Request Headers** → Look for `Authorization: Bearer ...`
   - If missing, the interceptor isn't working

### Step 3: Check Server Logs

The backend should show:
```
📄 Resume Upload Request:
   User ID: [userId]
   File: [filename.pdf]
```

If you see:
```
❌ No token provided for protected route: POST /api/resume/upload
   Authorization header: undefined
```

Then the token isn't being sent from the frontend.

## 🛠️ Quick Fixes

### Fix 1: Clear and Re-login

Sometimes the token gets corrupted:

1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Delete `token` and `auth-storage`
4. Refresh page and login again with Google
5. Try uploading again

### Fix 2: Check API Configuration

Make sure the client is using the correct backend URL:

```bash
grep "BACKEND_URL" client/.env.local
```

Should show:
```
BACKEND_URL=http://localhost:5001
```

### Fix 3: Restart Both Servers

Sometimes they get out of sync:

```bash
# Kill everything
pkill -f "npm start"
pkill -f "npm run dev"

# Restart backend
cd server && npm start

# In another terminal, restart frontend
cd client && npm run dev
```

## 📝 Token Flow Verification

Check each step:

```
1. Login with Google → Backend creates JWT → Returns to frontend ✓
2. Frontend stores JWT in localStorage ✓
3. Frontend includes JWT in API requests ✓
4. Backend receives and validates JWT ✓
5. Resume upload succeeds ✓
```

If any step fails, upload fails.

## 🧪 Manual API Test

You can test the endpoint manually:

```bash
# Get a token first (after logging in)
# Copy from browser DevTools → Application → Local Storage → token

# Then run:
curl -X POST http://localhost:5001/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "resume=@/path/to/file.pdf"
```

If this works, the backend is fine - issue is with the frontend sending the token.

## 🔒 Security Checklist

- ✓ Token is in localStorage after login
- ✓ Axios interceptor adds Authorization header
- ✓ Server receives and validates token
- ✓ User is found in database
- ✓ Resume route is protected

## 💡 Common Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| 403 Forbidden | No token or invalid token | Re-login, check localStorage |
| 401 Unauthorized | Token invalid or expired | Re-login |
| 400 Bad Request | No file uploaded | Make sure you selected a PDF |
| 413 Payload Too Large | File > 10MB | Compress or split your resume |

## 📞 If Still Not Working

1. **Screenshot the error** - Take DevTools screenshot showing the error
2. **Check server logs** - Show output from `npm start` terminal
3. **Verify token exists** - Show localStorage token value
4. **Test with curl** - Try the manual test above

---

**Most likely fix: Clear localStorage and login again!** 🎯
