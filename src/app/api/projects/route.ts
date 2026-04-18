import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import path from "path"
import { pushTextFile } from "@/lib/github"
import type { Project } from "@/types/project"

export const dynamic = "force-dynamic"

const INDEX = "src/data/projects.json"

function readProjects(): Project[] {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), INDEX), "utf-8"))
  } catch {
    return []
  }
}

export function GET() {
  return NextResponse.json(readProjects())
}

export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const updated = readProjects().filter((p) => p.slug !== slug)
  const json = JSON.stringify(updated, null, 2)

  writeFileSync(path.join(process.cwd(), INDEX), json, "utf-8")

  try {
    await pushTextFile(INDEX, json, `chore: remove project ${slug}`)
  } catch {
    // local delete succeeded even if GitHub push fails
  }

  return NextResponse.json({ success: true })
}
