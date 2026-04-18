"use client"
import { useEffect, useState } from "react"
import PortfolioThumbnail from "@/components/ui/PortfolioThumbnail"
import type { Project } from "@/types/project"
import "./HomePortfolio.css"

type Tab = "branding" | "other"

interface Props {
  defaultProjects: Project[]
}

export default function HomePortfolio({ defaultProjects }: Props) {
  const [tab, setTab] = useState<Tab>("branding")
  const [projects, setProjects] = useState<Project[]>(defaultProjects)

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => { if (data.length > 0) setProjects(data) })
      .catch(() => {})
  }, [])

  const filtered = projects.filter((p) => p.category === tab)

  return (
    <section className="hpf section-full">
      <div className="hpf__header section-regular">
        <div className="hpf__tabs">
          {(["branding", "other"] as Tab[]).map((t) => (
            <button
              key={t}
              className={`hpf__tab${tab === t ? " hpf__tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "branding" ? "Branding" : "Other"}
            </button>
          ))}
        </div>
        <h2 className="hpf__title">Selected Work</h2>
      </div>

      <div className="hpf__grid section-regular">
        {filtered.length === 0 ? (
          <p className="hpf__empty">No projects in this category yet.</p>
        ) : (
          filtered.map((p) => (
            <PortfolioThumbnail
              key={p.slug}
              images={p.thumbnails}
              name={p.name}
              description={p.description}
              client={`${p.client.firstName} ${p.client.lastName}`.trim()}
              href={p.href}
            />
          ))
        )}
      </div>
    </section>
  )
}
