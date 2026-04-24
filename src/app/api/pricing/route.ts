import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"
import { pushTextFile } from "@/lib/github"

export const dynamic = "force-dynamic"

const FILE = "src/data/pricing.json"

export interface PricingItem {
  id: string
  label: string
  sectionPath: string[]
  hours: number
}

export interface PricingCategory {
  id: string
  label: string
  hours: number
  items: PricingItem[]
}

export interface PricingData {
  hourlyRate: number
  categories: PricingCategory[]
}

function readPricing(): PricingData {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), FILE), "utf-8"))
  } catch {
    return { hourlyRate: 25, categories: [] }
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
    await pushTextFile(FILE, json, "chore: update pricing")
  } catch {
    // local save succeeded
  }
  return NextResponse.json({ success: true })
}
