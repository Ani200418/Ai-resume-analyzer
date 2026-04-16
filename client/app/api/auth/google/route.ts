/**
 * Google OAuth API Route Handler
 * Proxies Google credentials to Express backend for verification
 */

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return Response.json(
        { error: "Google credential is required" },
        { status: 400 }
      );
    }

    // Proxy to backend for token verification
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    const response = await fetch(`${backendUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend auth error:", data);
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json(
      { error: "Google authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
