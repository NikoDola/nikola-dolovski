import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"
import { pushTextFile } from "@/lib/github"

export const dynamic = "force-dynamic"

const FILE = "src/data/quotes.json"

export interface QuoteRequest {
  id: string
  submittedAt: string
  name: string
  email: string
  phone?: string
  selections: {
    categoryId: string
    categoryLabel: string
    itemIds: string[]
    itemLabels: string[]
  }[]
  total: number
  status: "new" | "seen" | "replied"
}

function readQuotes(): QuoteRequest[] {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), FILE), "utf-8"))
  } catch {
    return []
  }
}

function writeQuotes(quotes: QuoteRequest[]) {
  const abs = path.join(process.cwd(), FILE)
  mkdirSync(path.dirname(abs), { recursive: true })
  const json = JSON.stringify(quotes, null, 2)
  writeFileSync(abs, json, "utf-8")
  return json
}

export function GET() {
  return NextResponse.json(readQuotes())
}

export async function POST(req: NextRequest) {
  const quote = await req.json() as Omit<QuoteRequest, "id" | "submittedAt" | "status">
  const entry: QuoteRequest = {
    ...quote,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "new",
  }
  const quotes = [entry, ...readQuotes()]
  const json = writeQuotes(quotes)
  try {
    await pushTextFile(FILE, json, `chore: new quote from ${entry.name}`)
  } catch {
    // local save succeeded
  }
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json() as { id: string; status: QuoteRequest["status"] }
  const quotes = readQuotes().map((q) => q.id === id ? { ...q, status } : q)
  writeQuotes(quotes)
  return NextResponse.json({ success: true })
}
