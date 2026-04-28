import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

const LOGOS_JSON = path.join(process.cwd(), "public", "company-assets", "logos.json")
const LOGOS_DIR  = path.join(process.cwd(), "public", "company-assets", "logos")

async function readLogos() {
  try { return JSON.parse(await fs.readFile(LOGOS_JSON, "utf-8")) } catch { return [] }
}

export async function GET() {
  return NextResponse.json(await readLogos())
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const ext      = file.name.split(".").pop()?.toLowerCase() || "png"
    const filename = `${randomUUID()}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    await fs.mkdir(LOGOS_DIR, { recursive: true })
    await fs.writeFile(path.join(LOGOS_DIR, filename), buffer)

    const meta = {
      id:                  randomUUID(),
      filename,
      url:                 `/company-assets/logos/${filename}`,
      title:               (form.get("title") as string) || "",
      designer:            (form.get("designer") as string) || "Niko Dola",
      displayInStyleScreen: form.get("displayInStyleScreen") !== "false",
      age:                 (form.get("age") as string) || "between",
      materialism:         (form.get("materialism") as string) || "between",
      formStyle:           (form.get("formStyle") as string) || "between",
      obviousAbstract:     (form.get("obviousAbstract") as string) || "between",
      negativeSpace:       (form.get("negativeSpace") as string) || "no",
      era:                 (form.get("era") as string) || "between",
      gender:              (form.get("gender") as string) || "unisex",
      colorCount:          (form.get("colorCount") as string) || "2 colors",
      logoType:            (form.get("logoType") as string) || "Logo",
      complexity:          (form.get("complexity") as string) || "between",
    }

    const logos = await readLogos()
    logos.unshift(meta)
    await fs.writeFile(LOGOS_JSON, JSON.stringify(logos, null, 2))

    return NextResponse.json(meta)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
