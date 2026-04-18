import type { Project } from "@/types/project"

export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function deleteProject(slug: string): Promise<void> {
  await fetch(`/api/projects?slug=${encodeURIComponent(slug)}`, { method: "DELETE" })
}
