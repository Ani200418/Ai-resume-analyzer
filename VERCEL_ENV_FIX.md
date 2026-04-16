# 🔧 Vercel Environment Variables - CRITICAL FIX

## Current Issues
Your Vercel environment variables have two critical misconfigurations:

1. **`BACKEND_URL=http://localhost:5001`** ❌
   - This is a local development URL
   - Vercel servers cannot access `localhost`
   - **Needs to be your actual backend URL**

2. **`CLIENT_URL=http://localhost:3000`** ❌
   - This should be your production Vercel URL
   - **Should be: `https://ai-resume-analyzer-awer.vercel.app`**

## ✅ What Needs to be Fixed

### Step 1: Find Your Backend URL
Your backend must be deployed somewhere. Tell me:
- Is it deployed on Vercel?
- Is it deployed on Render/Railway/Heroku/other?
- What is the full URL? (e.g., `https://ai-resume-analyzer-api.render.com`)

### Step 2: Update Vercel Environment Variables

Go to: **Vercel Dashboard → ai-resume-analyzer-awer → Settings → Environment Variables**

Change these values:

| Variable | Current | Should Be |
|----------|---------|-----------|
| `BACKEND_URL` | `http://localhost:5001` | `https://YOUR-BACKEND-URL` |
| `CLIENT_URL` | `http://localhost:3000` | `https://ai-resume-analyzer-awer.vercel.app` |
| `NODE_ENV` | `development` | `production` |

### Step 3: Redeploy Frontend

After updating environment variables:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click the three dots on the latest deployment
4. Select "Redeploy"

Or run: `git push` to trigger a new deployment

### Step 4: Update Google Cloud Console

Add your production Vercel URL to Google OAuth:
- Go to: https://console.cloud.google.com/apis/credentials
- Click your OAuth 2.0 Client ID
- Add to **Authorized JavaScript Origins**:
  ```
  https://ai-resume-analyzer-awer.vercel.app
  ```
- Add to **Authorized Redirect URIs**:
  ```
  https://ai-resume-analyzer-awer.vercel.app/auth/login
  ```
- Save changes

---

## 🔍 How to Find Your Backend URL

### If backend is on Vercel:
- Go to Vercel Dashboard
- Find your backend project
- Copy the production URL (e.g., `https://project-name.vercel.app`)

### If backend is on Render:
- Go to Render Dashboard
- Find your backend service
- Copy the URL from "Onrender.com" link

### If backend is on Railway:
- Go to Railway Dashboard
- Find your backend service
- Copy the Public URL

### If backend is local (not deployed):
- **You MUST deploy it first!** See below.

---

## 🚀 If You Haven't Deployed Backend Yet

### Option A: Deploy to Render (Recommended - Free tier available)

1. Push code to GitHub (both frontend and backend)
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repo (backend folder)
5. Configuration:
   - **Name**: `ai-resume-analyzer-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Port**: `5001`
6. Add environment variables (from your `server/.env`)
7. Deploy

Your backend URL will be: `https://ai-resume-analyzer-api.onrender.com`

### Option B: Deploy to Railway (Also free tier)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Select the backend folder
5. Add environment variables
6. Deploy

Your backend URL will be something like: `https://railway-project.up.railway.app`

---

## 📋 Checklist

- [ ] Determined backend deployment platform and URL
- [ ] Updated Vercel `BACKEND_URL` to production URL
- [ ] Updated Vercel `CLIENT_URL` to `https://ai-resume-analyzer-awer.vercel.app`
- [ ] Updated Vercel `NODE_ENV` to `production`
- [ ] Redeployed frontend on Vercel
- [ ] Updated Google Cloud Console authorized URLs
- [ ] Tested `/health` endpoint on backend
- [ ] Tested Google login from production URL

---

## 🧪 Testing

### Test Backend Health
```bash
curl https://YOUR-BACKEND-URL/health
```

Should return:
```json
{
  "status": "OK",
  "message": "AI Resume Analyzer API is running",
  "environment": "production"
}
```

### Test Backend Config
```bash
curl https://YOUR-BACKEND-URL/api/debug/config
```

Should show your Google Client ID and that variables are set.

### Test Frontend
1. Go to `https://ai-resume-analyzer-awer.vercel.app/auth/login`
2. Click "Sign in with Google"
3. Check browser console for logs
4. Should successfully authenticate

---

**Let me know your backend URL and I'll help you complete the setup!**
