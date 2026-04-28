import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

const FONTS_JSON = path.join(process.cwd(), "public", "company-assets", "fonts.json")

async function readFonts() {
  try { return JSON.parse(await fs.readFile(FONTS_JSON, "utf-8")) } catch { return [] }
}

export async function GET() {
  return NextResponse.json(await readFonts())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { embedParam?: string; category?: string; name?: string; family?: string; weight?: number; sample?: string }

    if (!body.embedParam) return NextResponse.json({ error: "embedParam required" }, { status: 400 })

    const font = {
      id:         randomUUID(),
      name:       body.name       || body.embedParam.split(":")[0].replace(/\+/g, " "),
      family:     body.family     || `'${body.embedParam.split(":")[0].replace(/\+/g, " ")}', sans-serif`,
      weight:     body.weight     || 700,
      sample:     body.sample     || "Custom Font",
      category:   body.category   || "sans",
      embedParam: body.embedParam,
    }

    const fonts = await readFonts()
    fonts.push(font)
    await fs.writeFile(FONTS_JSON, JSON.stringify(fonts, null, 2))

    return NextResponse.json(font)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to add font" }, { status: 500 })
  }
}
