import { notFound } from "next/navigation"
import Link from "next/link"
import { readFileSync } from "fs"
import path from "path"
import type { BlogPost } from "@/app/api/blog/route"
import "./page.css"

export const dynamic = "force-dynamic"

function getPosts(): BlogPost[] {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "src/data/blog.json"), "utf-8"))
  } catch {
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPosts().find((p) => p.slug === slug && p.status === "published")
  if (!post) notFound()

  return (
    <main className="blgp">
      <article className="blgp__article">
        <header className="blgp__header">
          <time className="blgp__date">{post.publishedAt}</time>
          <h1 className="blgp__title">{post.title}</h1>
          {post.excerpt && <p className="blgp__excerpt">{post.excerpt}</p>}
        </header>

        <div
          className="blgp__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="blgp__footer">
          <Link href="/blog" className="blgp__back">← All Posts</Link>
        </footer>
      </article>
    </main>
  )
}
