import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Try to get the IP from common headers used by proxies and Vercel
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "IP not found";

    return NextResponse.json({ ip });
  } catch {
    return NextResponse.json({ error: "Failed to get IP" }, { status: 500 });
  }
}
