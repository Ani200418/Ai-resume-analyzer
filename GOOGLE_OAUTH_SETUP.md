# 🔐 Google OAuth Setup Guide

## ✅ Your Configuration Status
- ✅ Client ID configured in `.env.local`
- ✅ Server credentials configured in `.env`
- ✅ API routes set up correctly

## ❌ Common Causes of "Google sign-in failed" Error

### 1. **Google Cloud Console Authorized Origins Missing**
Add these to **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID:**

**Authorized JavaScript Origins:**
```
http://localhost:3000
http://localhost:5000
http://127.0.0.1:3000
```

**Authorized Redirect URIs:**
```
http://localhost:3000
http://localhost:3000/auth/login
http://localhost:5000
```

### 2. **Verify Your Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services → Credentials**
4. Click on your **OAuth 2.0 Client ID** (type: Web application)
5. Under "Authorized JavaScript origins", verify you see:
   - `http://localhost:3000` (development frontend)
   - `http://localhost:5000` (development backend - optional but recommended)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:3000`

### 3. **Check Your Servers Are Running**

```bash
# Terminal 1 - Start Backend
cd server
npm install  # if needed
npm start

# Terminal 2 - Start Frontend  
cd client
npm install  # if needed
npm run dev
```

### 4. **Debug in Browser**

1. Open http://localhost:3000/auth/login in your browser
2. Open **DevTools** (F12 or Cmd+Option+I)
3. Go to **Console** tab
4. Click the Google Sign-In button
5. Look for error messages

### 5. **Check Server Logs**

Watch the server terminal (port 5000) for errors when you try to sign in.

## 🚀 Quick Fix Steps

```bash
# 1. Clear browser cache
# Cmd+Shift+Delete or Cmd+Option+I → Application → Clear Storage

# 2. Restart both servers
# Stop both and run:
cd server && npm start  # Terminal 1
cd client && npm run dev  # Terminal 2

# 3. Try signing in again
# Go to http://localhost:3000/auth/login
```

## 📞 Still Not Working?

### Issue: "credentials parameter is invalid"
- ✅ Check Google Client ID is correct in `.env.local`
- ✅ Verify authorized origins in Google Cloud Console

### Issue: "audience mismatch"
- ✅ Check server's `GOOGLE_CLIENT_ID` matches client's `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Issue: "Invalid value for: origin"
- ✅ Add `http://localhost:3000` and `http://localhost:5000` to authorized origins

### Issue: Network Error / 500
- ✅ Check server is running on port 5000
- ✅ Check server logs for errors
- ✅ Verify `BACKEND_URL=http://localhost:5000` in client `.env.local`
