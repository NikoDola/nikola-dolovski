import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"
import { pushTextFile } from "@/lib/github"

export const dynamic = "force-dynamic"

const FILE = "src/data/pricing.json"

export interface PricingData {
  hourlyRate: number
  logoBaseHours: number
  items: Record<string, number>  // pathId → hours
}

function readPricing(): PricingData {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), FILE), "utf-8"))
  } catch {
    return { hourlyRate: 25, logoBaseHours: 10, items: {} }
  }
}

export function GET() {
  return NextResponse.json(readPricing())
}

export async function POST(req: NextRequest) {
  const body = await req.json() as PricingData
  const json = JSON.stringify(body, null, 2)
  const abs = path.join(process.cwd(), FILE)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, json, "utf-8")
  try {
    await pushTextFile(FILE, json, "chore: update custom service pricing")
  } catch {
    // local save succeeded
  }
  return NextResponse.json({ success: true })
}
