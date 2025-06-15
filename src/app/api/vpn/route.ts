import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "Unknown";

  const language = req.headers.get("accept-language")?.split(",")[0] || "unknown";
  const clientTime = req.nextUrl.searchParams.get("time");
  const clientOS = req.nextUrl.searchParams.get("os") || "unknown";

  const now = new Date();
  const serverHour = now.getUTCHours();
  const clientHour = clientTime ? new Date(clientTime).getUTCHours() : null;

  let riskScore = 0;

  // Full Chrome common language codes mapped to countries
  const languageToCountryMap: Record<string, string> = {
    af: "ZA",
    am: "ET",
    ar: "SA",
    az: "AZ",
    be: "BY",
    bg: "BG",
    bn: "BD",
    bs: "BA",
    ca: "ES",
    cs: "CZ",
    da: "DK",
    de: "DE",
    el: "GR",
    en: "US",
    es: "ES",
    et: "EE",
    fa: "IR",
    fi: "FI",
    fil: "PH",
    fr: "FR",
    he: "IL",
    hi: "IN",
    hr: "HR",
    hu: "HU",
    id: "ID",
    is: "IS",
    it: "IT",
    ja: "JP",
    ka: "GE",
    kk: "KZ",
    km: "KH",
    ko: "KR",
    ky: "KG",
    lo: "LA",
    lt: "LT",
    lv: "LV",
    mk: "MK",
    ml: "IN",
    mn: "MN",
    mr: "IN",
    ms: "MY",
    nb: "NO",
    ne: "NP",
    nl: "NL",
    no: "NO",
    pa: "IN",
    pl: "PL",
    ps: "AF",
    pt: "BR",
    ro: "RO",
    ru: "RU",
    si: "LK",
    sk: "SK",
    sl: "SI",
    sq: "AL",
    sr: "RS",
    sv: "SE",
    sw: "TZ",
    ta: "IN",
    te: "IN",
    th: "TH",
    tl: "PH",
    tr: "TR",
    uk: "UA",
    ur: "PK",
    uz: "UZ",
    vi: "VN",
    zh: "CN",
    zu: "ZA"
  };

  const langCode = language.split("-")[0];
  const expectedCountry = languageToCountryMap[langCode];

  if (expectedCountry && ip !== "Unknown" && !ip.startsWith(expectedCountry)) {
    riskScore += 1;
  }

  if (!clientTime) {
    riskScore += 4;
  } else if (clientHour !== null) {
    const diff = Math.abs(serverHour - clientHour);
    if (diff >= 6) riskScore += 3;
    else if (diff >= 2) riskScore += 2;
  }

  const isBlocked = riskScore >= 4;

  return NextResponse.json({
    ip,
    language,
    clientTime,
    serverTime: now.toISOString(),
    clientOS,
    riskScore,
    blocked: isBlocked,
  });
}
