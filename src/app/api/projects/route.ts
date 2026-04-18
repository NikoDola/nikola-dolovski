import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/projects.json")
    const text = readFileSync(filePath, "utf-8")
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json([])
  }
}
