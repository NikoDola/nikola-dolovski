import { notFound } from "next/navigation"
import Image from "next/image"
import { readFileSync } from "fs"
import path from "path"
import type { Project } from "@/types/project"
import { getImageSection, getIconLabel, SECTION_ORDER } from "@/lib/imageNames"
import "./page.css"

export const dynamic = "force-dynamic"

function loadProject(slug: string): Project | null {
  try {
    const filePath = path.join(process.cwd(), "src/data/projects.json")
    const allProjects: Project[] = JSON.parse(readFileSync(filePath, "utf-8"))
    return allProjects.find((p) => p.slug === slug) ?? null
  } catch {
    return null
  }
}

function groupImages(images: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  for (const img of images) {
    const filename = img.split("/").pop() ?? img
    const section = getImageSection(filename)
    if (!groups.has(section)) groups.set(section, [])
    groups.get(section)!.push(img)
  }
  return groups
}

function sectionLabel(section: string): string {
  if (section === "UI") return "UI / UX"
  return section
}

type TocItem = { id: string; label: string }

function makeSectionId(section: string, idx: number) {
  return `section-${idx}-${section.toLowerCase().replace(/\s+/g, "-")}`
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = loadProject(slug)
  if (!project) notFound()

  const images = project.images ?? []
  const groups = groupImages(images)
  const orderedSections = SECTION_ORDER.filter((s) => groups.has(s))

  const toc: TocItem[] = orderedSections.map((s, i) => ({
    id: makeSectionId(s, i),
    label: sectionLabel(s),
  }))

  const hasBrandColors = project.brandColors && project.brandColors.length > 0

  return (
    <main className="proj-page">

      {/* ── Hero ── */}
      <section className="section-full proj-hero">
        <div className="proj-container proj-hero__inner">
          <div className="proj-hero__identity">
            <p className="proj-hero__eyebrow">
              {project.category === "branding" ? "Brand Identity" : "Project"} {new Date().getFullYear()}
            </p>
            <h1 className="proj-hero__title">{project.name}</h1>
            {project.description && (
              <p className="proj-hero__desc">{project.description}</p>
            )}
            {project.mission && (
              <p className="proj-hero__mission">{project.mission}</p>
            )}
          </div>

          {(toc.length > 0 || hasBrandColors) && (
            <nav className="proj-toc" aria-label="Contents">
              <p className="proj-toc__heading">Contents</p>
              <ol className="proj-toc__list">
                {toc.map((item, i) => (
                  <li key={item.id} className="proj-toc__item">
                    <a href={`#${item.id}`} className="proj-toc__link">
                      <span className="proj-toc__num">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>

              {project.services.length > 0 && (
                <div className="proj-toc__services">
                  <p className="proj-toc__servLabel">Services</p>
                  <ul className="proj-toc__servList">
                    {project.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>
          )}
        </div>
      </section>

      {/* ── Sections from images ── */}
      {orderedSections.map((sectionName, i) => {
        const sectionImages = groups.get(sectionName) ?? []
        const id = makeSectionId(sectionName, i)

        // Icons section — all branding icons in a grid, labeled by @label or path
        if (sectionName === "Icons") {
          return (
            <section key={id} id={id} className="section-regular proj-section">
              <div className="proj-section__header">
                <span className="proj-section__label">Branding</span>
                <h2 className="proj-section__title">Icons</h2>
              </div>
              <div className="proj-icon-grid">
                {sectionImages.map((img) => {
                  const filename = img.split("/").pop() ?? ""
                  const label = getIconLabel(filename)
                  return (
                    <div key={img} className="proj-icon-card">
                      <div className="proj-icon-card__imgWrap">
                        <Image src={img} alt={label} fill className="proj-icon-card__img" />
                      </div>
                      <p className="proj-icon-card__label">{label}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        }

        // All other sections
        const mockupIdx = sectionImages.findIndex((img) => img.includes("logo-mockup"))
        const hero = mockupIdx >= 0 ? sectionImages[mockupIdx] : null
        const gridImages = hero
          ? sectionImages.filter((img) => !img.includes("logo-mockup"))
          : sectionImages

        return (
          <section key={id} id={id} className="section-regular proj-section">
            <div className="proj-section__header">
              <span className="proj-section__label">
                {sectionImages[0]?.includes("_ui") ? "UI / UX" : "Branding"}
              </span>
              <h2 className="proj-section__title">{sectionLabel(sectionName)}</h2>
            </div>

            {hero && (
              <div className="proj-section__hero">
                <Image
                  src={hero}
                  alt={`${project.name} ${sectionName} hero`}
                  fill
                  className="proj-section__heroImg"
                />
              </div>
            )}

            {gridImages.length > 0 && (
              <div className={`proj-section__grid${gridImages.length === 1 ? " proj-section__grid--single" : ""}`}>
                {gridImages.map((img) => (
                  <div key={img} className="proj-section__imgWrap">
                    <Image
                      src={img}
                      alt={img.split("/").pop()?.replace(/[_-]/g, " ") ?? ""}
                      fill
                      className="proj-section__img"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}

      {/* ── Brand Colors (if generated) ── */}
      {hasBrandColors && (
        <section className="section-regular proj-section">
          <div className="proj-section__header">
            <span className="proj-section__label">Branding</span>
            <h2 className="proj-section__title">Brand Colors</h2>
          </div>
          <div className="proj-colors">
            {project.brandColors!.map((color, i) => {
              const labels = [
                "Primary", "Secondary", "Accent",
                "Support 1", "Support 2", "Support 3",
                "Support 4", "Support 5", "Support 6", "Support 7",
              ]
              return (
                <div key={color.hex + i} className="proj-color-card">
                  <div className="proj-color-card__swatch" style={{ backgroundColor: color.hex }} />
                  <div className="proj-color-card__info">
                    <p className="proj-color-card__role">{color.name || labels[i] || `Color ${i + 1}`}</p>
                    <p className="proj-color-card__hex">{color.hex}</p>
                    <p className="proj-color-card__rgb">{color.rgb}</p>
                    {color.usage && <p className="proj-color-card__usage">{color.usage}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Client Review ── */}
      {project.review && (
        <section className="section-regular proj-section proj-review">
          <blockquote className="proj-review__quote">{project.review}</blockquote>
          <p className="proj-review__author">
            {project.client.firstName} {project.client.lastName}
          </p>
        </section>
      )}

    </main>
  )
}
