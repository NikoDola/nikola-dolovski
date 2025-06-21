import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0] ?? "is a null"
  const timeZone = new Date()
  const language = navigator.language
  const userAgent = req.headers.get("user-agent")
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  
  return NextResponse.json({ip, timeZone, language, userAgent, isMobile})
}