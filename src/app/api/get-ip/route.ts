import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the IP from headers (works on Vercel and many proxies)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.ip || // fallback, might be undefined
      "IP not found";

    return NextResponse.json({ ip });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get IP" }, { status: 500 });
  }
}
