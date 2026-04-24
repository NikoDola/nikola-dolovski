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

export default function BlogPage() {
  const posts = getPosts().filter((p) => p.status === "published")

  return (
    <main className="blg">
      <section className="blg__hero">
        <h1 className="blg__heroTitle">Blog</h1>
        <p className="blg__heroSub">Thoughts on design, branding, and craft.</p>
      </section>

      <section className="blg__list">
        {posts.length === 0 ? (
          <p className="blg__empty">No posts yet. Check back soon.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="blg__card">
              <time className="blg__date">{post.publishedAt}</time>
              <h2 className="blg__cardTitle">
                <Link href={`/blog/${post.slug}`} className="blg__cardLink">{post.title}</Link>
              </h2>
              {post.excerpt && <p className="blg__excerpt">{post.excerpt}</p>}
              <Link href={`/blog/${post.slug}`} className="blg__read">Read →</Link>
            </article>
          ))
        )}
      </section>
    </main>
  )
}
