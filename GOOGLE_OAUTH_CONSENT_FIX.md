# 🔧 Fix: Google OAuth Consent Screen Configuration

## The Error
```
Parameter approval_state is not set correctly.
[GSI_LOGGER]: Parameter approval_state is not set correctly.
```

This means your Google OAuth app is missing proper consent screen configuration.

---

## ✅ Fix: Configure Google OAuth Consent Screen

Go to: https://console.cloud.google.com/apis/

### Step 1: Go to OAuth Consent Screen
1. In the left sidebar, find **"OAuth consent screen"**
2. Click it
3. Make sure **"User Type"** is set to **"External"**

### Step 2: Configure the Consent Screen

Fill in these required fields:

**App information:**
- **App name**: `AI Resume Analyzer`
- **User support email**: Your email (e.g., `aniketsingh886909@gmail.com`)
- **Developer contact information**: Your email

### Step 3: Add Scopes

1. Click **"Add or Remove Scopes"**
2. Search for and add these scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `openid`

These allow Google to share user email and profile info with your app.

### Step 4: Add Test Users (if in development)

1. Click **"Test Users"**
2. Click **"Add Users"**
3. Add your Gmail address (e.g., `aniketsingh886909@gmail.com`)
4. Click **"Add"**

This lets you test without publishing the app.

### Step 5: Save and Continue

1. Click **"Save and Continue"**
2. Review the summary
3. If everything looks good, you can leave it as "Testing" (no need to publish)

---

## 📋 Verify Your Credentials Configuration

Also go to: https://console.cloud.google.com/apis/credentials

Click your **OAuth 2.0 Client ID** and verify:

**Authorized JavaScript Origins:**
```
https://ai-resume-analyzer-jade-seven.vercel.app
http://localhost:3000
http://127.0.0.1:3000
```

**Authorized Redirect URIs:**
```
https://ai-resume-analyzer-jade-seven.vercel.app
https://ai-resume-analyzer-jade-seven.vercel.app/auth/login
http://localhost:3000
http://localhost:3000/auth/login
http://127.0.0.1:3000
http://127.0.0.1:3000/auth/login
```

---

## 🧪 After Configuring

1. Wait 2-3 minutes for changes to propagate
2. Go to: https://ai-resume-analyzer-jade-seven.vercel.app/auth/login
3. Click "Sign in with Google"
4. Should work now! (no more `approval_state` error)

---

## ⚠️ Important Notes

- Your app is in **"Testing"** mode (OK for development)
- When you have test users added, only those users can sign in
- If you want anyone to sign in, you need to **"Publish"** the app (requires verification)
- For now, just add yourself as a test user and it should work

---

## 🔍 Common Issues

**Still getting `approval_state` error?**
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Try incognito/private browser window
- Make sure you waited 2-3 minutes after saving

**Getting "This app is not yet authorized" message?**
- You need to add yourself as a test user
- Or publish the app (requires Google verification)

**Getting "Redirect URI mismatch"?**
- Make sure your Authorized Redirect URIs matches exactly
- No trailing slashes or extra characters

---

**Let me know once you've configured the consent screen and tested again!**
