# 🚀 UPDATED PRODUCTION SETUP - NEW VERCEL URL

## Your NEW URLs
- **Frontend (NEW)**: https://ai-resume-analyzer-jade-seven.vercel.app/
- **Backend**: https://ai-resume-analyzer-jbr2.onrender.com/

---

## ⚠️ CRITICAL: You Must Update 3 Things

### 1️⃣ UPDATE VERCEL ENVIRONMENT VARIABLES

Go to: **Vercel Dashboard → Settings → Environment Variables**

Update these variables to use your **NEW frontend URL**:

```
BACKEND_URL = https://ai-resume-analyzer-jbr2.onrender.com
CLIENT_URL = https://ai-resume-analyzer-jade-seven.vercel.app
NEXT_PUBLIC_APP_URL = https://ai-resume-analyzer-jade-seven.vercel.app
NODE_ENV = production
```

**Steps**:
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Edit `CLIENT_URL`: Change to `https://ai-resume-analyzer-jade-seven.vercel.app`
5. Edit `NEXT_PUBLIC_APP_URL`: Change to `https://ai-resume-analyzer-jade-seven.vercel.app`
6. Save changes
7. Redeploy: `git push origin main`

---

### 2️⃣ UPDATE GOOGLE CLOUD CONSOLE - CRITICAL!

Go to: https://console.cloud.google.com/apis/credentials

1. Click on your OAuth 2.0 Client ID
2. Click **Edit OAuth client**

**Replace (or add) in "Authorized JavaScript Origins"**:
```
https://ai-resume-analyzer-jade-seven.vercel.app
http://localhost:3000
http://127.0.0.1:3000
```

**Replace (or add) in "Authorized Redirect URIs"**:
```
https://ai-resume-analyzer-jade-seven.vercel.app
https://ai-resume-analyzer-jade-seven.vercel.app/auth/login
http://localhost:3000
http://localhost:3000/auth/login
http://127.0.0.1:3000
http://127.0.0.1:3000/auth/login
```

⚠️ **IMPORTANT**: 
- Remove/replace the old URL `https://ai-resume-analyzer-awer.vercel.app`
- Only add the NEW URL: `https://ai-resume-analyzer-jade-seven.vercel.app`
- Click **Save**
- Wait 5-10 minutes for Google to propagate the changes

---

### 3️⃣ UPDATE RENDER ENVIRONMENT VARIABLES (if needed)

Go to: **Render Dashboard → ai-resume-analyzer-jbr2 → Environment**

Make sure:
- `CLIENT_URL = https://ai-resume-analyzer-jade-seven.vercel.app` (NEW URL)
- `NODE_ENV = production`

If you changed `CLIENT_URL`, save and wait for redeploy.

---

## ✅ After These 3 Updates

After updating and waiting for redeployments:

1. Vercel should have the new environment variables
2. Google should recognize your new frontend URL
3. Render should know the correct frontend URL

---

## 🧪 Test Your Setup

Wait 5-10 minutes for all changes to propagate, then:

### Test 1: Check Backend Config
```bash
curl https://ai-resume-analyzer-jbr2.onrender.com/api/debug/config | jq .clientUrl
```

Should show: `https://ai-resume-analyzer-jade-seven.vercel.app`

### Test 2: Try Google Login
1. Go to: https://ai-resume-analyzer-jade-seven.vercel.app/auth/login
2. Click "Sign in with Google"
3. Check browser console (F12) for:
   ```
   GOOGLE_CLIENT_ID: 553107784810-no9dlpt...
   CREDENTIAL RECEIVED: eyJhbGciOi...
   CREDENTIAL LENGTH: 1201
   ```
4. Should redirect to dashboard (no 500 error)

### Test 3: Check Vercel Logs
1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to **Deployments** → Latest deployment
4. Click **Logs**
5. Look for successful `/api/auth/google` request

---

## 🔍 If You Still Get 500 Error

Check these in order:

1. **Verify Vercel env vars updated**:
   ```bash
   # Redeploy to pick up new vars
   git push origin main
   ```

2. **Check if Google allowed your new URL**:
   - Go to Google Console
   - Make sure `https://ai-resume-analyzer-jade-seven.vercel.app` is in both:
     - Authorized JavaScript Origins
     - Authorized Redirect URIs

3. **Check Render logs**:
   - Go to Render Dashboard → ai-resume-analyzer-jbr2
   - Click **Logs**
   - Look for errors from `/api/auth/google`

4. **Check backend is responding**:
   ```bash
   curl https://ai-resume-analyzer-jbr2.onrender.com/health
   ```

---

## 📋 Checklist

- [ ] Updated Vercel `CLIENT_URL` to `https://ai-resume-analyzer-jade-seven.vercel.app`
- [ ] Updated Vercel `NEXT_PUBLIC_APP_URL` to `https://ai-resume-analyzer-jade-seven.vercel.app`
- [ ] Updated Vercel `BACKEND_URL` to `https://ai-resume-analyzer-jbr2.onrender.com`
- [ ] Redeployed Vercel with `git push origin main`
- [ ] Updated Google Console Authorized JavaScript Origins (removed old URL, added new)
- [ ] Updated Google Console Authorized Redirect URIs (removed old URL, added new)
- [ ] Waited 5-10 minutes for Google changes to propagate
- [ ] Tested Google login from new URL
- [ ] Successfully authenticated without 500 error

---

**Important**: The 500 error likely happens because Google doesn't recognize your new frontend URL yet. Once you update Google Console and the changes propagate (5-10 minutes), it should work!

Let me know once you've made these changes!
