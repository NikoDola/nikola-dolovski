import { notFound } from "next/navigation"
import Image from "next/image"
import { readFileSync } from "fs"
import path from "path"
import type { Project } from "@/types/project"
import { getIconLabel, parseImageFilename } from "@/lib/imageNames"
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

// ── Granular section definitions ──────────────────────────────────────────────

type SectionType = "logo" | "icon-custom" | "icon-stock" | "default"

type SectionDef = {
  key: string
  topSection: string
  label: string
  catLabel: string
  desc: string | undefined
  images: string[]
  type: SectionType
  fillImages: string[]
  outlineImages: string[]
}

const SECTION_KEY_DEFS: Array<{
  key: string
  topSection: string
  label: string
  type: SectionType
}> = [
  { key: "logo_primary",    topSection: "Logo",           label: "Logo",            type: "logo" },
  { key: "logo_horizontal", topSection: "Logo",           label: "Logo Horizontal", type: "logo" },
  { key: "logo_vertical",   topSection: "Logo",           label: "Logo Vertical",   type: "logo" },
  { key: "logo_icon",       topSection: "Logo",           label: "Logo Icon",       type: "logo" },
  { key: "logo_badge",      topSection: "Logo",           label: "Logo Badge",      type: "logo" },
  { key: "logo_monogram",   topSection: "Logo",           label: "Logo Monogram",   type: "logo" },
  { key: "logo_mascot",     topSection: "Mascot",         label: "Mascot",          type: "logo" },
  { key: "logo_wordmark",   topSection: "Wordmark",       label: "Wordmark",        type: "logo" },
  { key: "logo",            topSection: "Logo",           label: "Logo",            type: "logo" },
  { key: "icon_custom",     topSection: "Icons",          label: "Custom Icons",    type: "icon-custom" },
  { key: "icon_stock",      topSection: "Icons",          label: "Stock Icons",     type: "icon-stock" },
  { key: "icon",            topSection: "Icons",          label: "Icons",           type: "icon-custom" },
  { key: "mascot",          topSection: "Mascot",         label: "Mascot",          type: "default" },
  { key: "illustration",    topSection: "Illustration",   label: "Illustration",    type: "default" },
  { key: "pattern",         topSection: "Pattern",        label: "Pattern",         type: "default" },
  { key: "color",           topSection: "Colors",         label: "Colors",          type: "default" },
  { key: "typography",      topSection: "Typography",     label: "Typography",      type: "default" },
  { key: "brand-guidelines",topSection: "Brand Guidelines",label: "Brand Guidelines",type: "default" },
  { key: "stationery",      topSection: "Stationery",     label: "Stationery",      type: "default" },
  { key: "print",           topSection: "Print",          label: "Print",           type: "default" },
  { key: "packaging",       topSection: "Packaging",      label: "Packaging",       type: "default" },
  { key: "merch",           topSection: "Merch",          label: "Merch",           type: "default" },
  { key: "social",          topSection: "Social",         label: "Social",          type: "default" },
  { key: "signage",         topSection: "Signage",        label: "Signage",         type: "default" },
  { key: "page",            topSection: "Pages",          label: "Pages",           type: "default" },
  { key: "structure",       topSection: "Structure",      label: "Structure",       type: "default" },
  { key: "components",      topSection: "Components",     label: "Components",      type: "default" },
  { key: "navigation",      topSection: "Navigation",     label: "Navigation",      type: "default" },
  { key: "sections",        topSection: "UI Sections",    label: "UI Sections",     type: "default" },
  { key: "auth",            topSection: "Auth",           label: "Auth",            type: "default" },
  { key: "user",            topSection: "User",           label: "User",            type: "default" },
  { key: "ecommerce",       topSection: "E-Commerce",     label: "E-Commerce",      type: "default" },
  { key: "email",           topSection: "Email",          label: "Email",           type: "default" },
  { key: "states",          topSection: "States",         label: "States",          type: "default" },
  { key: "animation",       topSection: "Animation",      label: "Animation",       type: "default" },
  { key: "visual",          topSection: "Visual",         label: "Visual",          type: "default" },
  { key: "system",          topSection: "Design System",  label: "Design System",   type: "default" },
  { key: "responsive",      topSection: "Responsive",     label: "Responsive",      type: "default" },
  { key: "theme",           topSection: "Theme",          label: "Theme",           type: "default" },
  { key: "prototype",       topSection: "Prototype",      label: "Prototype",       type: "default" },
]

function imageToKey(img: string): string {
  const filename = img.split("/").pop() ?? img
  const parsed = parseImageFilename(filename)
  if (!parsed || parsed.pathSegments.length === 0) return "other"
  const s0 = parsed.pathSegments[0]
  const s1 = parsed.pathSegments[1]
  if (s0 === "logo") return s1 ? `logo_${s1}` : "logo"
  if (s0 === "icon" && s1 === "custom") return "icon_custom"
  if (s0 === "icon" && s1 === "stock") return "icon_stock"
  if (s0 === "icon") return "icon"
  return s0
}

function imageCatLabel(img: string): string {
  const filename = img.split("/").pop() ?? img
  const parsed = parseImageFilename(filename)
  return parsed?.category === "ui" ? "UI / UX" : "Branding"
}

function buildSections(
  images: string[],
  sectionDescriptions?: Record<string, string>
): SectionDef[] {
  const map = new Map<string, string[]>()
  for (const img of images) {
    const key = imageToKey(img)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(img)
  }

  // Track which topSections have already shown their description
  const shownDesc = new Set<string>()

  return SECTION_KEY_DEFS
    .filter(({ key }) => map.has(key))
    .map(({ key, topSection, label, type }) => {
      const imgs = map.get(key)!
      const catLabel = imgs.length > 0 ? imageCatLabel(imgs[0]) : "Branding"

      // Description: label-specific first, then topSection fallback; show once per topSection
      const rawDesc =
        sectionDescriptions?.[label] ?? sectionDescriptions?.[topSection]
      const desc = rawDesc && !shownDesc.has(topSection) ? rawDesc : undefined
      if (desc) shownDesc.add(topSection)

      // icon-stock: split fill vs outline
      const fillImages: string[] = []
      const outlineImages: string[] = []
      if (type === "icon-stock") {
        for (const img of imgs) {
          const filename = img.split("/").pop() ?? img
          const parsed = parseImageFilename(filename)
          const variant = parsed?.pathSegments[2]
          if (variant === "fill") fillImages.push(img)
          else if (variant === "outline") outlineImages.push(img)
          else fillImages.push(img) // default to fill group
        }
      }

      return { key, topSection, label, catLabel, desc, images: imgs, type, fillImages, outlineImages }
    })
}

// ── TOC ───────────────────────────────────────────────────────────────────────

type TocItem = { id: string; label: string }

function makeSectionId(key: string, idx: number) {
  return `section-${idx}-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = loadProject(slug)
  if (!project) notFound()

  const images = [...new Set(project.images ?? [])]
  const sections = buildSections(images, project.sectionDescriptions)
  const hasBrandColors = project.brandColors && project.brandColors.length > 0

  const toc: TocItem[] = sections.map((s, i) => ({
    id: makeSectionId(s.key, i),
    label: s.label,
  }))

  return (
    <main className="proj-page">

      {/* ── Hero ── */}
      <section className="section-full proj-hero">
        <div className="section-regular proj-hero__inner">
          <div className="proj-hero__identity">
            <p className="proj-hero__eyebrow">
              {project.category === "branding" ? "Brand Identity" : "Project"} {new Date().getFullYear()}
            </p>
            <h1 className="proj-hero__title">{project.name}</h1>
            {project.description && (
              <p className="proj-hero__desc">{project.description}</p>
            )}
            {(project.mission || project.vision) && (
              <div className="proj-hero__strategy">
                {project.mission && (
                  <div className="proj-hero__strategy-item">
                    <p className="proj-hero__strategy-label">Mission</p>
                    <p className="proj-hero__strategy-text">{project.mission}</p>
                  </div>
                )}
                {project.vision && (
                  <div className="proj-hero__strategy-item">
                    <p className="proj-hero__strategy-label">Vision</p>
                    <p className="proj-hero__strategy-text">{project.vision}</p>
                  </div>
                )}
              </div>
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

      {/* ── Sections ── */}
      {sections.map((section, i) => {
        const id = makeSectionId(section.key, i)

        // ── Logo sections ─────────────────────────────────────────────────────
        if (section.type === "logo") {
          const artW = { logo_primary: 750, logo_mascot: 625, logo_wordmark: 500 }[section.key] ?? 700
          const artH = { logo_primary: 450, logo_mascot: 625, logo_wordmark: 250 }[section.key] ?? 420

          return (
            <section key={id} id={id} className="section-full proj-section">
              <div className="section-regular">
                <div className="proj-section__header">
                  <span className="proj-section__label">{section.catLabel}</span>
                  <h2 className="proj-section__title">{section.label}</h2>
                </div>
                {section.desc && <p className="proj-section__desc">{section.desc}</p>}
                <div className="proj-logo-stage">
                  {section.images.map((img) => (
                    <div key={img} className="proj-logo-backdrop">
                      <div className="proj-logo-art" style={{ width: artW, height: artH }}>
                        <Image
                          src={img}
                          alt={img.split("/").pop()?.replace(/[_@-]/g, " ") ?? ""}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        // ── Custom Icons ──────────────────────────────────────────────────────
        if (section.type === "icon-custom") {
          return (
            <section key={id} id={id} className="section-full proj-section">
              <div className="section-regular">
                <div className="proj-section__header">
                  <span className="proj-section__label">{section.catLabel}</span>
                  <h2 className="proj-section__title">{section.label}</h2>
                </div>
                {section.desc && <p className="proj-section__desc">{section.desc}</p>}
                <div className="proj-icon-grid proj-icon-grid--custom">
                  {section.images.map((img) => {
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
              </div>
            </section>
          )
        }

        // ── Stock Icons (fill + outline) ──────────────────────────────────────
        if (section.type === "icon-stock") {
          const hasFill = section.fillImages.length > 0
          const hasOutline = section.outlineImages.length > 0
          const renderIconGroup = (imgs: string[]) =>
            imgs.map((img) => {
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
            })

          return (
            <section key={id} id={id} className="section-full proj-section">
              <div className="section-regular">
                <div className="proj-section__header">
                  <span className="proj-section__label">{section.catLabel}</span>
                  <h2 className="proj-section__title">{section.label}</h2>
                </div>
                {section.desc && <p className="proj-section__desc">{section.desc}</p>}

                {hasFill && (
                  <>
                    <p className="proj-icon-group__label">Fill</p>
                    <div className="proj-icon-grid proj-icon-grid--stock">{renderIconGroup(section.fillImages)}</div>
                  </>
                )}
                {hasFill && hasOutline && <div className="proj-icon-group__sep" />}
                {hasOutline && (
                  <>
                    <p className="proj-icon-group__label">Outline</p>
                    <div className="proj-icon-grid proj-icon-grid--stock">{renderIconGroup(section.outlineImages)}</div>
                  </>
                )}
              </div>
            </section>
          )
        }

        // ── Default (print, stationery, etc.) ────────────────────────────────
        const isPrint = section.topSection === "Print" || section.topSection === "Stationery"
        const mockupImg = section.images.find((img) => img.includes("mockup"))
        const gridImages = mockupImg
          ? section.images.filter((img) => !img.includes("mockup"))
          : section.images

        return (
          <section key={id} id={id} className="section-full proj-section">
            <div className="section-regular">
              <div className="proj-section__header">
                <span className="proj-section__label">{section.catLabel}</span>
                <h2 className="proj-section__title">{section.label}</h2>
              </div>
              {section.desc && <p className="proj-section__desc">{section.desc}</p>}

              {mockupImg && (
                <div className="proj-section__hero">
                  <Image
                    src={mockupImg}
                    alt={`${project.name} ${section.label} mockup`}
                    fill
                    className="proj-section__heroImg"
                  />
                </div>
              )}

              {gridImages.length > 0 && (
                <div className={isPrint ? "proj-print-grid" : `proj-section__grid${gridImages.length === 1 ? " proj-section__grid--single" : ""}`}>
                  {gridImages.map((img) => (
                    <div key={img} className={isPrint ? "proj-print-card" : "proj-section__imgWrap"}>
                      {isPrint ? (
                        <Image
                          src={img}
                          alt={img.split("/").pop()?.replace(/[_@-]/g, " ") ?? ""}
                          width={840}
                          height={540}
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : (
                        <Image
                          src={img}
                          alt={img.split("/").pop()?.replace(/[_@-]/g, " ") ?? ""}
                          fill
                          className="proj-section__img"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* ── Brand Colors ── */}
      {hasBrandColors && (
        <section className="section-full proj-section">
          <div className="section-regular">
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
          </div>
        </section>
      )}

      {/* ── Client Review ── */}
      {project.review && (
        <section className="section-full proj-section proj-review">
          <div className="section-regular proj-review__inner">
            <div className="proj-review__client">
              {project.clientThumbnail ? (
                <div className="proj-review__avatarWrap">
                  <Image
                    src={project.clientThumbnail}
                    alt={`${project.client.firstName} ${project.client.lastName}`}
                    fill
                    className="proj-review__avatarImg"
                  />
                </div>
              ) : (
                <div className="proj-review__avatarInitials">
                  {(project.client.firstName[0] ?? "").toUpperCase()}
                  {(project.client.lastName[0] ?? "").toUpperCase()}
                </div>
              )}
              <p className="proj-review__author">
                {project.client.firstName} {project.client.lastName}
              </p>
            </div>
            <blockquote className="proj-review__quote">{project.review}</blockquote>
          </div>
        </section>
      )}

    </main>
  )
}
