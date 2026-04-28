import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"

const FONTS_JSON = path.join(process.cwd(), "public", "company-assets", "fonts.json")

async function readFonts() {
  try { return JSON.parse(await fs.readFile(FONTS_JSON, "utf-8")) } catch { return [] }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fonts: { id: string }[] = await readFonts()
  const updated = fonts.filter(f => f.id !== id)
  if (updated.length === fonts.length) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await fs.writeFile(FONTS_JSON, JSON.stringify(updated, null, 2))
  return NextResponse.json({ success: true })
}
