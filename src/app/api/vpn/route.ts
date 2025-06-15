import { NextRequest, NextResponse } from "next/server";

// Simulated IP-to-country logic for demo or local testing
function detectCountryFromIP(ip: string): string {
  if (ip === "::1" || ip.startsWith("127.")) return "LOCAL";
  if (ip.startsWith("78.")) return "MK"; // Example: Macedonian IP
  if (ip.startsWith("172.") || ip.startsWith("192.") || ip.startsWith("10.")) return "PRIVATE";
  return "US"; // Fallback for unknown/public IPs
}

// Full list of Chrome-accepted languages → associated country code
const languageToCountryMap: Record<string, string> = {
  af: "ZA", am: "ET", ar: "SA", az: "AZ", be: "BY", bg: "BG", bn: "BD", bs: "BA", ca: "ES",
  cs: "CZ", da: "DK", de: "DE", el: "GR", en: "US", es: "ES", et: "EE", fa: "IR", fi: "FI",
  fil: "PH", fr: "FR", he: "IL", hi: "IN", hr: "HR", hu: "HU", id: "ID", is: "IS", it: "IT",
  ja: "JP", ka: "GE", kk: "KZ", km: "KH", ko: "KR", ky: "KG", lo: "LA", lt: "LT", lv: "LV",
  mk: "MK", ml: "IN", mn: "MN", mr: "IN", ms: "MY", nb: "NO", ne: "NP", nl: "NL", no: "NO",
  pa: "IN", pl: "PL", ps: "AF", pt: "BR", ro: "RO", ru: "RU", si: "LK", sk: "SK", sl: "SI",
  sq: "AL", sr: "RS", sv: "SE", sw: "TZ", ta: "IN", te: "IN", th: "TH", tl: "PH", tr: "TR",
  uk: "UA", ur: "PK", uz: "UZ", vi: "VN", zh: "CN", zu: "ZA"
};

// Expected timezone offsets in minutes by country (normal/local times)
const expectedTzOffsets: Record<string, number> = {
  US: -240, MK: -120, DE: -120, FR: -120, IT: -120, CN: -480, RU: -180,
  IN: -330, JP: -540, SA: -180, PH: -480, ZA: -120, NL: -120, SE: -120,
  NO: -120, ES: -120, GR: -120, UA: -120, PK: -300, BD: +360, ID: +420,
  TH: +420, VN: +420, etc: 0 // 'etc' placeholder for unspecified
};

export async function GET(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for");
  const ip = xf ? xf.split(",")[0].trim() : "::1";

  const language = req.headers.get("accept-language")?.split(",")[0] || "unknown";
  const clientTime = req.nextUrl.searchParams.get("time");
  const clientOS = req.nextUrl.searchParams.get("os") || "unknown";
  const tzOffset = parseInt(req.nextUrl.searchParams.get("tzOffset") || "0", 10);

  const now = new Date();
  const serverHour = now.getUTCHours();
  const clientHour = clientTime ? new Date(clientTime).getUTCHours() : null;

  const langCode = language.split("-")[0];
  const expectedCountryByLang = languageToCountryMap[langCode] ?? "unknown";
  const ipCountry = detectCountryFromIP(ip);
  const expectedOffset = expectedTzOffsets[ipCountry] ?? 0;
  const offsetDiff = Math.abs(tzOffset - expectedOffset);

  let riskScore = 0;

  // 📍 Language vs. IP country mismatch
  if (expectedCountryByLang !== "unknown" && ipCountry !== "LOCAL" && ipCountry !== "PRIVATE") {
    if (expectedCountryByLang !== ipCountry) riskScore += 1;
  }

  // ⏰ Time presence and difference
  if (!clientTime) {
    riskScore += 4;
  } else if (clientHour !== null) {
    const hourDiff = Math.abs(serverHour - clientHour);
    if (hourDiff >= 6) riskScore += 3;
    else if (hourDiff >= 2) riskScore += 2;
  }

  // 🌍 Timezone offset mismatch
  if (offsetDiff >= 180) riskScore += 3;
  else if (offsetDiff >= 60) riskScore += 2;

  const isBlocked = riskScore >= 4;

  return NextResponse.json({
    ip,
    ipCountry,
    language,
    expectedCountryByLang,
    clientTime,
    serverTime: now.toISOString(),
    clientOS,
    tzOffset,
    expectedOffset,
    offsetDiff,
    riskScore,
    blocked: isBlocked
  });
}
