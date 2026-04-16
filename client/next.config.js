/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  // ─── API Proxy Rewrites ───────────────────────────────────────────────────
  // All /api/* requests are proxied to the Express backend.
  // This completely eliminates CORS issues in development AND production.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    return {
      beforeFiles: [
        // ✅ Multipart/form-data requests must NOT go through rewrites
        // They must be proxied directly via API routes instead
        {
          source: "/api/resume/upload",
          destination: `${backendUrl}/api/resume/upload`,
          // Rewrites don't properly handle multipart - use API route instead
        },
      ],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${backendUrl}/uploads/:path*`,
        },
        {
          source: "/health",
          destination: `${backendUrl}/health`,
        },
      ],
    };
  },

  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

module.exports = nextConfig;
