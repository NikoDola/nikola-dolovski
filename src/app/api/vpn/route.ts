import { NextApiRequest, NextApiResponse } from "next";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

// Known VPN/proxy identifiers
const VPN_HOSTNAMES = ['vpn', 'proxy', 'tor-exit', 'anonymous'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Rate limiting
    const identifier = req.headers["x-real-ip"] || req.socket.remoteAddress;
    const { success } = await ratelimit.limit(identifier as string);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests",
      });
    }

    // Get client info from query params
    const { time, os, tzOffset, userAgent, hostname } = req.query;

    // Validate time
    if (typeof time !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(time)) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    // Calculate time difference
    const clientTime = new Date(time as string);
    const serverTime = new Date();
    const timeDiff = Math.abs(serverTime.getTime() - clientTime.getTime());

    // Risk factors
    const risks = {
      timeRisk: timeDiff > 60000 ? 3 : 0,
      osRisk: /(vpn|proxy|tor|anonymous)/i.test(os as string) ? 3 : 0,
      userAgentRisk: /(vpn|proxy|tor|anonymous)/i.test(userAgent as string) ? 2 : 0,
      tzRisk: Math.abs(Number(tzOffset)) > 360 ? 2 : 0,
      hostnameRisk: VPN_HOSTNAMES.some(vpn => (hostname as string)?.toLowerCase().includes(vpn)) ? 2 : 0
    };

    const riskScore = Object.values(risks).reduce((a, b) => a + b, 0);

    return res.status(200).json({
      riskScore,
      timeDiff: timeDiff / 1000,
      risks,
      isSuspicious: riskScore >= 4,
      message: riskScore >= 4 
        ? "High probability of VPN/Proxy detected" 
        : "Low risk - no VPN detected",
    });
  } catch (error) {
    console.error("VPN check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}