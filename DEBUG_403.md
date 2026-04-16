# 🔍 Resume Upload 403 Error - Complete Debugging Guide

## Step 1: Verify Token is in localStorage

Open your browser's **Developer Tools** (F12) and run this in the **Console**:

```javascript
const token = localStorage.getItem("token");
console.log("Token exists:", !!token);
console.log("Token preview:", token ? token.substring(0, 50) + "..." : "NO TOKEN");
console.log("Auth storage:", JSON.parse(localStorage.getItem("auth-storage") || "{}"));
```

**Expected Output:**
- `Token exists: true`
- `Token preview: eyJhbGci...` (JWT starts with "eyJ")

**If token is missing:**
- ❌ Logout and login again with Google
- Check if localStorage is being cleared by browser privacy settings

---

## Step 2: Check Request Headers

1. Open **Developer Tools** → **Network tab**
2. **Clear all requests** (trash icon)
3. Try uploading a resume
4. Look for the `resume` POST request
5. Click on it, then go to **Request Headers** section
6. **Copy and share these values:**

```
Authorization: Bearer ...
Content-Type: ...
Content-Length: ...
```

**Expected:**
- `Authorization: Bearer eyJhbGci...` ✅
- Content-Type should show boundary like: `multipart/form-data; boundary=...` ✅

**If Authorization header is MISSING:**
- The interceptor isn't working
- Need to check if token is in localStorage (Step 1)

---

## Step 3: Check Browser Console Logs

1. Open **Developer Tools** → **Console tab**
2. Look for logs starting with `📤 Request with auth:`

**Expected to see:**
```
📤 Request with auth: POST /api/resume/upload Token: eyJhbGci...
```

**If you see:**
```
⚠️  No token in localStorage for request: /api/resume/upload
```
- Token is not persisting in localStorage
- May be cleared on page refresh or localStorage is disabled

---

## Step 4: Check Backend Logs

Look at the terminal where you ran `npm start` in the `/server` folder.

**Expected to see (successful auth):**
```
✅ Auth successful for user: aniketsingh886909@gmail.com Route: POST /api/resume/upload
```

**If you see:**
```
❌ No token provided for protected route: POST /api/resume/upload
   Authorization header: undefined
```
- Token is NOT being sent by the client
- This confirms a frontend issue (Steps 1-3 above)

**If you see:**
```
❌ No token provided for protected route: POST /api/resume/upload
   Authorization header: Bearer [some-token]
```
- Token IS being sent but JWT verification failed
- Token may be malformed or expired

---

## Step 5: Check Response Body

In the Network tab, click on the **Response** tab of the failed request.

**Expected (if 403 error):**
```json
{
  "error": "Access denied. No token provided.",
  "status": 401
}
```

Or:
```json
{
  "error": "Invalid token. Please login again.",
  "status": 401
}
```

**Share the exact error message** - this tells us if it's:
- ❌ Missing token (client side issue)
- ❌ Invalid token (server can't verify JWT)
- ❌ User not found (database issue)

---

## Quick Checklist

- [ ] Step 1: Token is in localStorage? 
- [ ] Step 2: Authorization header in request?
- [ ] Step 3: Browser console shows token in logs?
- [ ] Step 4: Backend shows token verification message?
- [ ] Step 5: Response error message is clear?

---

## Common Fixes

### If token is missing:
```javascript
// Force re-login
localStorage.clear();
window.location.href = "/auth/login";
```

### If Authorization header is missing:
- Check `/client/lib/api.ts` has the interceptor
- Verify token is readable from localStorage

### If token verification fails on backend:
- Check JWT_SECRET matches in `/server/.env`
- Verify token isn't expired (created more than 7 days ago)
- Check MongoDB connection (user lookup might fail)

---

## Please provide:

1. **localStorage check result** (from Step 1)
2. **Request Headers** (from Step 2)
3. **Browser console logs** (from Step 3)
4. **Backend terminal output** (from Step 4)
5. **Response error message** (from Step 5)

This will tell us exactly where the 403 is coming from.
