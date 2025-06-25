// /pages/api/get-ip.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Try to get IP from x-forwarded-for header (if behind proxy)
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    null;

  res.status(200).json({ ip });
}
