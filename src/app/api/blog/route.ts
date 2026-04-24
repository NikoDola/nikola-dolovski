import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

const FILE = "src/data/blog.json"

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  projectSlug?: string
  sectionId?: string
  status: "draft" | "published"
}

function readBlog(): BlogPost[] {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), FILE), "utf-8"))
  } catch {
    return []
  }
}

function writeBlog(posts: BlogPost[]) {
  const abs = path.join(process.cwd(), FILE)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, JSON.stringify(posts, null, 2), "utf-8")
}

export function GET() {
  return NextResponse.json(readBlog())
}

export async function POST(req: NextRequest) {
  const post = await req.json() as BlogPost
  const posts = readBlog()
  const idx = posts.findIndex((p) => p.id === post.id)
  if (idx >= 0) {
    posts[idx] = post
  } else {
    posts.unshift(post)
  }
  writeBlog(posts)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  writeBlog(readBlog().filter((p) => p.id !== id))
  return NextResponse.json({ success: true })
}
