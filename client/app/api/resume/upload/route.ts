/**
 * Next.js API Route: Multipart Upload Proxy
 * 
 * This route handles multipart/form-data uploads and forwards them to the Express backend.
 * We need this because Next.js rewrites don't preserve multipart form data encoding.
 * 
 * GET /api/resume/upload → Express backend /api/resume/upload
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value || 
                  request.headers.get("Authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    
    const contentType = request.headers.get("content-type");

    // ✅ Forward the entire request body (FormData) as-is
    // This preserves the multipart/form-data encoding
    const response = await fetch(`${backendUrl}/api/resume/upload`, {
      method: "POST",
      headers: {
        "Authorization": token,
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: request.body,
      // @ts-ignore
      duplex: "half", // Needed in Node.js 18+ fetch when body is a stream
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Upload Route Error]", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
