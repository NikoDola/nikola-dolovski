"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getProjects, deleteProject } from "@/lib/actions/projects"
import type { Project } from "@/types/project"
import "./projects.css"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await getProjects()
      setProjects(data.filter((p) => p.images && p.images.length > 0))
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"?`)) return
    await deleteProject(slug)
    setProjects((prev) => prev.filter((p) => p.slug !== slug))
  }

  return (
    <div className="apj">
      <div className="apj__header">
        <h1 className="apj__title">Portfolio Projects</h1>
        <Link href="/admin/projects/add" className="apj__add">+ Add Project</Link>
      </div>

      {loading ? (
        <p className="apj__status">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="apj__status">No projects yet. Add your first one.</p>
      ) : (
        <table className="apj__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Thumbnails</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.slug}>
                <td>{p.name}</td>
                <td><code>{p.slug}</code></td>
                <td><span className={`apj__badge apj__badge--${p.category}`}>{p.category}</span></td>
                <td>{p.thumbnails.length}</td>
                <td className="apj__actions">
                  <Link href={`/admin/projects/add?slug=${p.slug}`} className="apj__edit">Edit</Link>
                  <button onClick={() => handleDelete(p.slug)} className="apj__delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="apj__back">
        <Link href="/admin">← Back to Admin</Link>
      </div>
    </div>
  )
}
