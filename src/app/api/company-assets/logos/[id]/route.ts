import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"

const LOGOS_JSON = path.join(process.cwd(), "public", "company-assets", "logos.json")
const LOGOS_DIR  = path.join(process.cwd(), "public", "company-assets", "logos")

async function readLogos() {
  try { return JSON.parse(await fs.readFile(LOGOS_JSON, "utf-8")) } catch { return [] }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const logos: Record<string, unknown>[] = await readLogos()
  const logo = logos.find(l => l.id === id)
  if (!logo) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(logo)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const logos: { id: string; filename: string }[] = await readLogos()
  const target = logos.find(l => l.id === id)
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 })

  try { await fs.unlink(path.join(LOGOS_DIR, target.filename)) } catch { /* already gone */ }

  const updated = logos.filter(l => l.id !== id)
  await fs.writeFile(LOGOS_JSON, JSON.stringify(updated, null, 2))
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json() as Record<string, unknown>
  const logos: Record<string, unknown>[] = await readLogos()
  const idx = logos.findIndex((l: Record<string, unknown>) => l.id === id)
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

  logos[idx] = { ...logos[idx], ...body }
  await fs.writeFile(LOGOS_JSON, JSON.stringify(logos, null, 2))
  return NextResponse.json(logos[idx])
}
