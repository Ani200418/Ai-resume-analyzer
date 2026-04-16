/**
 * Axios API Client
 * Uses Next.js proxy rewrites — no CORS issues.
 * All /api/* calls are transparently forwarded to Express backend via next.config.js rewrites.
 */

import axios from "axios";

// Relative path — proxied by next.config.js rewrites to http://localhost:5001
// The backend URL comes from BACKEND_URL in .env.local
// This works in both dev and production without any CORS configuration.
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // 60s — AI analysis can take up to ~30s
});

// ─── Request Interceptor: Attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("📤 Request with auth:", config.method?.toUpperCase(), config.url, "Token:", token.substring(0, 20) + "...");
      } else {
        console.warn("⚠️  No token in localStorage for request:", config.url);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Unified Error Handling ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / server unreachable
    if (!error.response) {
      const networkError = new Error(
        error.code === "ECONNABORTED"
          ? "Request timed out. The AI analysis may still be running — please refresh in a moment."
          : "Cannot reach the server. Make sure the backend is running on port 5001."
      );
      return Promise.reject(networkError);
    }

    const { status } = error.response;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }

    // Surface the server's error message to callers
    const serverMessage = error.response?.data?.error;
    if (serverMessage) {
      error.message = serverMessage;
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  googleAuth: (credential: string) =>
    api.post("/auth/google", { credential }),
  getMe: () => api.get("/auth/me"),
  refresh: () => api.post("/auth/refresh"),
};

// ─── Resume API ───────────────────────────────────────────────────────────────
export const resumeAPI = {
  upload: (formData: FormData, onProgress?: (pct: number) => void) => {
    // ✅ SPECIAL HANDLING for multipart uploads:
    // We need to use the local /api/resume/upload route (next.js) instead of
    // the proxy route because Next.js rewrites don't preserve multipart encoding.
    // The local route forwards it to the Express backend properly.
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ data: response });
          } catch (e) {
            reject(new Error("Invalid response from server"));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || "Upload failed"));
          } catch (e) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      // Get token from localStorage and add it as Authorization header
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      xhr.open("POST", "/api/resume/upload");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      
      // ✅ Important: Do NOT set Content-Type header
      // Let the browser set it automatically with the correct boundary
      
      xhr.send(formData);
    });
  },
  analyze: (resumeId: string) =>
    api.post(`/resume/analyze/${resumeId}`),
  getAll: (page = 1, limit = 10) =>
    api.get(`/resume?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/resume/${id}`),
  getFullAnalysis: (id: string) => api.get(`/resume/${id}/full`),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

// ─── Jobs API ─────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getRecommendations: (resumeId: string, params?: { limit?: number; category?: string }) =>
    api.get(`/jobs/recommendations/${resumeId}`, { params }),
  getCategories: () => api.get("/jobs/categories"),
};

export default api;
