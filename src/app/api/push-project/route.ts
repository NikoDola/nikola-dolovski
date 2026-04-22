import { NextRequest, NextResponse } from "next/server"
import { pushTextFile, pushBinaryFile, readTextFile } from "@/lib/github"
import { isLogoMockup, isVideoFile, parseImageFilename } from "@/lib/imageNames"
import type { Project } from "@/types/project"
import { writeFileSync, mkdirSync } from "fs"
import path from "path"

function writeLocal(relativePath: string, content: string) {
  const abs = path.join(process.cwd(), relativePath)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, content, "utf-8")
}

function writeBinaryLocal(relativePath: string, base64: string) {
  const abs = path.join(process.cwd(), relativePath)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, Buffer.from(base64, "base64"))
}

function deriveThumbnailsAndHero(
  slug: string,
  imageFiles: File[]
): { thumbnails: string[]; heroSection: string[] } {
  const paths = imageFiles.map((f) => `/my-work/${slug}/images/${f.name}`)
  const names = imageFiles.map((f) => f.name)

  const mockupPaths = names
    .filter((n) => isLogoMockup(n))
    .map((n) => `/my-work/${slug}/images/${n}`)

  const logoPaths = names
    .filter((n) => {
      const parsed = parseImageFilename(n)
      return parsed?.pathSegments[0] === "logo"
    })
    .map((n) => `/my-work/${slug}/images/${n}`)

  const thumbnails =
    mockupPaths.length > 0
      ? mockupPaths.slice(0, 1)
      : logoPaths.length > 0
      ? logoPaths.slice(0, 1)
      : paths.slice(0, 1)

  const heroSection =
    mockupPaths.length > 0 ? mockupPaths : paths.slice(0, 1)

  return { thumbnails, heroSection }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const projectStr = formData.get("project") as string
    if (!projectStr) return NextResponse.json({ error: "Missing project data" }, { status: 400 })

    const project = JSON.parse(projectStr) as Project
    const { slug } = project

    // Process image files — strip @ from filenames so URLs don't break
    const rawImages = formData.getAll("images") as File[]
    const imageFiles = rawImages.map((f) =>
      new File([f], f.name.replace(/@/g, ""), { type: f.type })
    )
    if (imageFiles.length > 0) {
      const newPaths = imageFiles.map((f) => `/my-work/${slug}/images/${f.name}`)
      const existing = project.images ?? []
      project.images = [...new Set([...existing, ...newPaths])]
      const nonVideoFiles = imageFiles.filter((f) => !isVideoFile(f.name))
      if (nonVideoFiles.length > 0) {
        const { thumbnails, heroSection } = deriveThumbnailsAndHero(slug, nonVideoFiles)
        project.thumbnails = thumbnails
        project.heroSection = heroSection
      }
    }

    // 1. Push per-project JSON
    await pushTextFile(
      `public/my-work/${slug}/data/project.json`,
      JSON.stringify(project, null, 2),
      `chore: update project data for ${slug}`
    )

    // 2. Merge into src/data/projects.json index
    const indexPath = "src/data/projects.json"
    const currentText = await readTextFile(indexPath)
    const allProjects: Project[] = currentText ? JSON.parse(currentText) : []
    const existingIdx = allProjects.findIndex((p) => p.slug === slug)
    if (existingIdx >= 0) allProjects[existingIdx] = project
    else allProjects.push(project)

    await pushTextFile(
      indexPath,
      JSON.stringify(allProjects, null, 2),
      `chore: ${existingIdx >= 0 ? "update" : "add"} ${slug} in projects index`
    )

    // 3. Write index locally so /api/projects reflects immediately
    writeLocal(indexPath, JSON.stringify(allProjects, null, 2))

    // 4. Write images locally first (dev server serves immediately), then push to GitHub
    for (const file of imageFiles) {
      const buf = await file.arrayBuffer()
      const base64 = Buffer.from(buf).toString("base64")
      writeBinaryLocal(`public/my-work/${slug}/images/${file.name}`, base64)
      await pushBinaryFile(
        `public/my-work/${slug}/images/${file.name}`,
        base64,
        `chore: add image ${file.name} to ${slug}`
      )
    }

    // 5. Push client thumbnail (if provided)
    const thumbFile = formData.get("clientThumbnail") as File | null
    if (thumbFile && thumbFile.size > 0) {
      const ext = thumbFile.name.split(".").pop() ?? "webp"
      const buf = await thumbFile.arrayBuffer()
      const base64 = Buffer.from(buf).toString("base64")
      await pushBinaryFile(
        `public/my-work/${slug}/images/client-thumbnail.${ext}`,
        base64,
        `chore: add client thumbnail to ${slug}`
      )
      writeBinaryLocal(`public/my-work/${slug}/images/client-thumbnail.${ext}`, base64)
    }

    return NextResponse.json({ success: true, slug })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
