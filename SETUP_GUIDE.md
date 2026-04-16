# 🚀 Google OAuth Setup - Complete Guide

## ⚠️ Current Status

- ✅ Configuration: Perfect (all env vars correct)
- ✅ Port 3000: Frontend running
- ❌ Port 5000: Backend NOT running (blocked by ControlCenter)
- ❌ Google Auth: Cannot work without backend

## 🔧 Step 1: Fix Port 5000 Issue

Port 5000 is blocked by ControlCenter. You have 3 options:

### Option A: Kill ControlCenter Process (Recommended)

```bash
# Find and kill the process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or specifically:
kill -9 43256
```

### Option B: Change Server Port

Edit `server/.env`:
```
PORT=5001  # Change from 5000 to 5001
```

Then update `client/.env.local`:
```
BACKEND_URL=http://localhost:5001
```

### Option C: Restart Your Mac

Sometimes ControlCenter locks ports. Restart to free up port 5000.

## 🚀 Step 2: Start Both Servers

Open **TWO separate terminal windows:**

### Terminal 1 - Backend

```bash
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/server"
npm start
```

You should see:
```
🚀 Server running on port 5000
📍 Environment: development
🌐 API Base: http://localhost:5000/api
❤️  Health: http://localhost:5000/health
```

### Terminal 2 - Frontend

```bash
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2/client"
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- ready started server on 0.0.0.0:3000
```

## ✅ Step 3: Verify Setup

Run the troubleshooter:

```bash
cd "/Users/aniketsingh/Downloads/ai-resume-analyzer 2"
bash troubleshoot.sh
```

All checks should show ✓

## 🔐 Step 4: Configure Google Cloud Console

Go to: https://console.cloud.google.com/

1. **Select your project**
2. **APIs & Services → Credentials**
3. **Click your OAuth 2.0 Client ID** (Web application)
4. **Add to "Authorized JavaScript origins":**
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
5. **Add to "Authorized redirect URIs":**
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
6. **Click SAVE**

## 🧪 Step 5: Test Google Sign-In

1. **Clear browser cache:** `Cmd+Shift+Delete`
2. **Open:** http://localhost:3000/auth/login
3. **Click:** "Continue with Google"
4. **You should see:** Google login popup

## 🐛 Troubleshooting

If it still fails:

### Check Server Logs

Terminal where you ran `npm start` should show:
```
🔐 Google Auth - Verifying token...
   Client ID: 553107784810-no9dlptmjlfvfb9dmj6spioo27d6199s.apps.googleusercontent.com
✅ Token verified for email: your-email@gmail.com
```

### Check Browser Console

Open DevTools (F12) and look for errors in Console tab.

### Common Errors

| Error | Fix |
|-------|-----|
| "Cannot reach the server" | Make sure port 5000 backend is running |
| "origin_mismatch" | Add `http://localhost:3000` to Google Cloud Console authorized origins |
| "audience mismatch" | Restart both servers (they might have cached wrong Client ID) |
| "Invalid client" | Check Client ID in Google Cloud Console matches `.env` files |

## 📝 Quick Checklist

- [ ] Terminal 1: Backend running on port 5000
- [ ] Terminal 2: Frontend running on port 3000
- [ ] Troubleshooter script shows all ✓
- [ ] Google Cloud Console has `http://localhost:3000` authorized
- [ ] Browser cache cleared
- [ ] Can see Google sign-in button on login page
- [ ] Clicking button shows Google popup

## 🆘 Still Having Issues?

1. **Restart everything:**
   - Stop both servers (Ctrl+C)
   - Kill any stuck processes: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
   - Start fresh: `npm start` (backend), then `npm run dev` (frontend)

2. **Try incognito mode:** Open http://localhost:3000/auth/login in a private/incognito window

3. **Check file permissions:** Make sure `.env` files exist and are readable

4. **Verify Node version:** Make sure you're using Node.js 16+
   ```bash
   node --version
   ```

---

**You're almost there!** 🎉 The configuration is perfect, just need to ensure both servers are running!
