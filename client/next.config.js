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
      // Multipart requests shouldn't use rewrites, letting them hit Next.js API proxy route.
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
