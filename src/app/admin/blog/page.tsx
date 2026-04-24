"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { RichEditor } from "./RichEditor"
import type { BlogPost } from "@/app/api/blog/route"
import "./blog.css"

interface ProjectSection {
  id: string
  path: string[]
  headline: string
}

interface Project {
  slug: string
  name: string
  sections?: ProjectSection[]
}

type EditorState = Omit<BlogPost, "id"> & { id: string | null }

const EMPTY: EditorState = {
  id: null, slug: "", title: "", excerpt: "", content: "",
  publishedAt: new Date().toISOString().split("T")[0],
  status: "draft",
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  async function load() {
    const [blogRes, projRes] = await Promise.all([
      fetch("/api/blog"),
      fetch("/api/projects"),
    ])
    setPosts(await blogRes.json())
    setProjects(await projRes.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startNew() {
    setEditor({ ...EMPTY })
    setStatus(null)
  }

  function startEdit(post: BlogPost) {
    setEditor({ ...post })
    setStatus(null)
  }

  function patch(updates: Partial<EditorState>) {
    setEditor((e) => e ? { ...e, ...updates } : e)
  }

  async function save(status: "draft" | "published") {
    if (!editor) return
    setSaving(true)
    setStatus(null)
    const post: BlogPost = {
      ...editor,
      id: editor.id ?? crypto.randomUUID(),
      slug: editor.slug || toSlug(editor.title),
      status,
      publishedAt: editor.publishedAt || new Date().toISOString().split("T")[0],
    }
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })
      if (res.ok) {
        setStatus({ ok: true, msg: status === "published" ? "Published." : "Saved as draft." })
        await load()
        setEditor(null)
      } else {
        setStatus({ ok: false, msg: "Save failed." })
      }
    } catch {
      setStatus({ ok: false, msg: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" })
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const allSections = projects.flatMap((proj) =>
    (proj.sections ?? []).map((s) => ({ proj, section: s }))
  )

  return (
    <div className="admb">
      <div className="admb__header">
        <h1 className="admb__title">Blog</h1>
        <div className="admb__headerActions">
          <Link href="/blog" target="_blank" className="admb__viewLink">View Blog →</Link>
          {!editor && (
            <button className="admb__newBtn" onClick={startNew}>+ New Post</button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="admb__status">Loading...</p>
      ) : editor ? (
        <div className="admb__editor">
          <div className="admb__editorHeader">
            <h2 className="admb__editorTitle">{editor.id ? "Edit Post" : "New Post"}</h2>
            <button type="button" className="admb__cancelBtn" onClick={() => setEditor(null)}>Cancel</button>
          </div>

          <div className="admb__fields">
            <label className="admb__label">
              Title
              <input className="admb__input" value={editor.title}
                onChange={(e) => patch({ title: e.target.value, slug: toSlug(e.target.value) })} />
            </label>

            <label className="admb__label">
              Slug
              <input className="admb__input admb__input--mono" value={editor.slug}
                onChange={(e) => patch({ slug: e.target.value })} />
            </label>

            <label className="admb__label">
              Excerpt <span className="admb__hint">(shown on listing page)</span>
              <textarea className="admb__textarea" rows={2} value={editor.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })} />
            </label>

            {allSections.length > 0 && (
              <label className="admb__label">
                Link to project section <span className="admb__hint">(optional)</span>
                <select className="admb__select"
                  value={editor.sectionId ?? ""}
                  onChange={(e) => {
                    const found = allSections.find((x) => x.section.id === e.target.value)
                    patch({
                      sectionId: found?.section.id ?? undefined,
                      projectSlug: found?.proj.slug ?? undefined,
                    })
                  }}>
                  <option value="">— None —</option>
                  {allSections.map(({ proj, section }) => (
                    <option key={section.id} value={section.id}>
                      {proj.name}: {section.path.slice(1).join(" / ")} — {section.headline}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="admb__label">
              Content
              <RichEditor value={editor.content} onChange={(content) => patch({ content })} />
            </label>
          </div>

          {status && (
            <p className={`admb__msg${status.ok ? "" : " admb__msg--error"}`}>{status.msg}</p>
          )}

          <div className="admb__editorFooter">
            <button type="button" className="admb__draftBtn" onClick={() => save("draft")} disabled={saving || !editor.title}>
              Save Draft
            </button>
            <button type="button" className="admb__publishBtn" onClick={() => save("published")} disabled={saving || !editor.title}>
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="admb__status">No posts yet. Create your first one.</p>
          ) : (
            <table className="admb__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td><code>{post.slug}</code></td>
                    <td>
                      <span className={`admb__badge admb__badge--${post.status}`}>{post.status}</span>
                    </td>
                    <td>{post.publishedAt}</td>
                    <td className="admb__actions">
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="admb__viewBtn">View</Link>
                      )}
                      <button className="admb__editBtn" onClick={() => startEdit(post)}>Edit</button>
                      <button className="admb__deleteBtn" onClick={() => handleDelete(post.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="admb__back">
            <Link href="/admin">← Admin</Link>
          </div>
        </>
      )}
    </div>
  )
}
