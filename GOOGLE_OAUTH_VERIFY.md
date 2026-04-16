# Google OAuth Verification Checklist

## Current Configuration

✅ **Server (.env)**
- GOOGLE_CLIENT_ID: `[your-client-id].apps.googleusercontent.com`
- GOOGLE_CLIENT_SECRET: `[your-client-secret]`

✅ **Client (.env.local)**
- NEXT_PUBLIC_GOOGLE_CLIENT_ID: `[your-client-id].apps.googleusercontent.com`

✅ **Backend URL**
- BACKEND_URL: `http://localhost:5001`

---

## ⚠️ Critical Steps to Verify in Google Cloud Console

Go to: https://console.cloud.google.com/

### 1. Select the Correct Project
- Find your project ID in the dropdown
- Make sure you're in the right project

### 2. OAuth 2.0 Client Credentials
- Navigate to: **APIs & Services → Credentials**
- Find the credential named "Web application"
- Copy the Client ID and Client Secret to your `.env` files

### 3. Authorized JavaScript Origins
Must include:
```
http://localhost:3000
http://localhost
http://127.0.0.1:3000
http://127.0.0.1
```

### 4. Authorized Redirect URIs
Must include:
```
http://localhost:3000/auth/login
http://localhost:3000/auth/callback
http://localhost:3000
http://127.0.0.1:3000/auth/login
```

### 5. Check OAuth Consent Screen
- Navigate to: **APIs & Services → OAuth consent screen**
- Status should be "In production" (for localhost) or "Testing"
- Scopes should include: `profile`, `email`, `openid`
- Test users should include your email

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid audience" error | Verify Client IDs match exactly between server and client |
| "Token verification failed" | Clear browser cache, verify Google Cloud credentials are active |
| "Cannot reach server" | Ensure backend is running on port 5001 |
| "No credential in request" | Check Google Sign-In button is loading properly |

---

## How to Fix

1. **Delete and Recreate Credentials** (if they're old):
   - Go to Credentials → Find the Web application credential
   - Delete it
   - Create a new OAuth 2.0 Client ID for Web application
   - Copy the new Client ID and Secret to both `.env` files
   - Make sure to add the authorized URLs above

2. **Test the OAuth Flow**:
   - Clear browser cache (Cmd+Shift+Delete on Mac)
   - Restart the dev server (`npm run dev`)
   - Try Google login again

---

## Debug Output to Watch

When attempting Google login, check **browser console** and **server terminal** for:

```
✅ Token verified for email: your-email@domain.com
```

If you see:
```
❌ Invalid audience
```
→ Client IDs don't match between server and client

If you see:
```
❌ Error fetching certificates
```
→ Network issue contacting Google's servers, or credentials are invalid

---

## Quick Test

Run this in browser console while on the login page:
```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

It should show your Google Client ID (from `.env.local`)

If it shows `undefined` → Check `.env.local` is saved and server restarted
