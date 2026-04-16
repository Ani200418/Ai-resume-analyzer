# 🔐 Google OAuth Not Working - Troubleshooting Guide

## ✅ What's Already Verified

Your configuration is **100% correct**:
- ✅ Client ID in `.env.local`: `553107784810-no9dlptmjlfvfb9dmj6spioo27d6199s.apps.googleusercontent.com`
- ✅ Server ID in `.env`: Matches client ID exactly
- ✅ Server secret is configured
- ✅ Both servers running (3000 and 5000)
- ✅ Backend API reachable
- ✅ Dependencies installed

## ⚠️ The Issue

The error "**Google authentication failed**" is 99% of the time caused by **Google Cloud Console permissions**.

## 🔧 How to Fix

### Step 1: Open Google Cloud Console

Go to: https://console.cloud.google.com/

### Step 2: Select Your Project

Look for your project in the dropdown (top left).

### Step 3: Open Credentials

Navigate to: **APIs & Services → Credentials**

### Step 4: Edit Your OAuth 2.0 Client ID

1. Click on your **OAuth 2.0 Client ID** (it will say "Web application")
2. You should see your Client ID: `553107784810-no9dlptmjlfvfb9dmj6spioo27d6199s`

### Step 5: Add Authorized JavaScript Origins

Under **"Authorized JavaScript origins"**, make sure these are added:
```
http://localhost:3000
http://127.0.0.1:3000
```

### Step 6: Add Authorized Redirect URIs

Under **"Authorized redirect URIs"**, make sure these are added:
```
http://localhost:3000
http://localhost:3000/auth/login
http://127.0.0.1:3000
http://127.0.0.1:3000/auth/login
```

### Step 7: Save

Click **"SAVE"** button at the bottom.

### Step 8: Test

1. Clear browser cache: `Cmd+Shift+Delete`
2. Go to: http://localhost:3000/auth/login
3. Click "Continue with Google"
4. You should see the Google login popup

## 🐛 Debugging Checklist

If it **still doesn't work**, follow this:

### In Your Browser (F12):

1. Open DevTools: **F12** or **Cmd+Option+I**
2. Go to **Console** tab
3. Click "Continue with Google"
4. Look for any red error messages
5. Take a screenshot of the error

### In Your Server Terminal:

Watch for logs starting with:
```
🔐 Google Auth - Verifying token...
```

If you see errors, they'll be logged with suggested fixes.

## 📝 Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid OAuth scope" | Google domain not verified | Verify your domain in Google Cloud Console |
| "Invalid client" | Client ID doesn't exist | Check Client ID is correct in Google Cloud Console |
| "origin_mismatch" | localhost not in authorized origins | Add `http://localhost:3000` to authorized origins |
| "access_denied" | User permissions issue | Try in an incognito/private window |
| "popup_blocked_by_browser" | Browser blocked popup | Check browser popup settings |

## 🔍 Quick Test

Run this command to verify the endpoint is working:

```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential": "test"}'
```

You should get an error about invalid token, but the endpoint should be reachable.

## 💡 Pro Tips

1. **Use Incognito Mode** - Sometimes cache causes issues
   - Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)

2. **Clear Google Auth Cache** - In browser DevTools:
   - Application → Cookies → Delete all Google cookies

3. **Check OAuth Consent Screen** - Google sometimes needs consent setup:
   - Go to: APIs & Services → OAuth consent screen
   - Make sure app is in "Testing" or "Production" mode
   - Add your email as a test user if in "Testing" mode

4. **Watch Server Logs** - Always check terminal running `npm start` in server folder

## 🆘 Still Not Working?

If you've completed all steps and it's still failing:

1. **Get the exact error:**
   - Screenshot the browser console error (F12)
   - Copy the server terminal logs (🔐 Google Auth section)

2. **Verify credentials are real:**
   - Double-check your Google Client ID in Google Cloud Console matches what's in `.env` files

3. **Try a fresh OAuth app:**
   - Create a new OAuth 2.0 Client ID
   - Delete the old one
   - Use the new credentials

## 📚 Reference Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Auth Setup](https://nextjs.org/docs/authentication)
- [Express Google Auth](https://www.npmjs.com/package/google-auth-library)
