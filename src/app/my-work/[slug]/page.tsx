import { notFound } from "next/navigation"
import Image from "next/image"
import { readFileSync } from "fs"
import path from "path"
import type { Project, ProjectSection, BrandColor } from "@/types/project"
import { getIconLabel, parseImageFilename, isVideoFile } from "@/lib/imageNames"
import ProjectHero from "@/components/sections/ProjectHero"
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
  { key: "website",         topSection: "Website",        label: "Website",         type: "default" },
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

// ── TOC (hierarchical) ────────────────────────────────────────────────────────

type TocNode = { id: string; label: string; children?: TocNode[] }

function makeSectionId(key: string, idx: number) {
  return `section-${idx}-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

const LOGO_TOPS = new Set(["Logo", "Mascot", "Wordmark"])
const ICON_TOPS = new Set(["Icons"])
const BRAND_TOPS = new Set(["Colors", "Typography"])

function buildHierarchicalToc(
  sections: SectionDef[],
  hasMission: boolean,
  hasVision: boolean
): TocNode[] {
  const result: TocNode[] = []

  // Introduction (mission + vision as children)
  if (hasMission || hasVision) {
    const introChildren: TocNode[] = []
    if (hasMission) introChildren.push({ id: "proj-mission", label: "Mission" })
    if (hasVision) introChildren.push({ id: "proj-vision", label: "Vision" })
    result.push({ id: "proj-introduction", label: "Introduction", children: introChildren })
  }

  let logoIdx = -1
  const logoChildren: TocNode[] = []

  let iconIdx = -1
  const iconChildren: TocNode[] = []

  let brandIdx = -1
  const brandChildren: TocNode[] = []

  const otherChildren = new Map<string, TocNode[]>()

  sections.forEach((s, i) => {
    const id = makeSectionId(s.key, i)

    // ── Logo family
    if (LOGO_TOPS.has(s.topSection)) {
      if (logoIdx === -1) {
        logoIdx = result.length
        result.push({ id, label: "Logo", children: logoChildren })
      }
      // Prefer primary or mockup as the parent link target
      if (s.key === "logo_primary" || s.images.some(img => img.includes("mockup"))) {
        result[logoIdx].id = id
      }
      logoChildren.push({ id, label: s.label })
      return
    }

    // ── Icons (custom + stock)
    if (ICON_TOPS.has(s.topSection)) {
      if (iconIdx === -1) {
        iconIdx = result.length
        result.push({ id, label: "Icons", children: iconChildren })
      }
      iconChildren.push({ id, label: s.label })
      return
    }

    // ── Brand Style (Colors + Typography)
    if (BRAND_TOPS.has(s.topSection)) {
      if (brandIdx === -1) {
        brandIdx = result.length
        result.push({ id, label: "Brand Style", children: brandChildren })
      }

      if (s.topSection === "Colors") {
        const hasGradient = s.images.some(img => img.includes("gradient"))
        const hasSolid = s.images.some(img => !img.includes("gradient"))
        brandChildren.push({
          id,
          label: "Colors",
          children: hasGradient && hasSolid
            ? [{ id, label: "Solid" }, { id, label: "Gradient" }]
            : undefined,
        })
      }

      if (s.topSection === "Typography") {
        const hasMockup = s.images.some(img => img.includes("mockup"))
        const typChildren: TocNode[] = []
        if (s.images.some(img => img.includes("hierarchy") || img.includes("heading"))) typChildren.push({ id, label: "Heading" })
        if (s.images.some(img => img.includes("pairing") || img.includes("scale") || img.includes("body"))) typChildren.push({ id, label: "Body" })
        if (s.images.some(img => img.includes("custom"))) typChildren.push({ id, label: "Custom" })
        // Parent link: mockup if exists, else first child's section
        if (hasMockup) result[brandIdx].id = id
        brandChildren.push({ id, label: "Typography", children: typChildren.length > 0 ? typChildren : undefined })
      }
      return
    }

    // ── Everything else — group by topSection
    const top = s.topSection
    if (!otherChildren.has(top)) {
      otherChildren.set(top, [])
      result.push({ id, label: top, children: otherChildren.get(top) })
    } else {
      otherChildren.get(top)!.push({ id, label: s.label })
    }
  })

  // Clean up empty/single children
  for (const node of result) {
    if (!node.children) continue
    if (node.children.length === 0) { node.children = undefined; continue }
    if (node.label !== "Logo" && node.label !== "Brand Style" && node.label !== "Introduction" && node.children.length === 1) {
      node.id = node.children[0].id
      node.children = undefined
    }
  }
  if (logoIdx !== -1 && logoChildren.length <= 1) result[logoIdx].children = undefined
  if (iconIdx !== -1 && iconChildren.length <= 1) result[iconIdx].children = undefined

  return result
}

function TocTree({ nodes, depth = 0 }: { nodes: TocNode[]; depth?: number }) {
  return (
    <ol className={depth === 0 ? "proj-toc__list" : "proj-toc__children"}>
      {nodes.map((node, i) => (
        <li key={`${node.id}-${i}`} className="proj-toc__item">
          <a href={`#${node.id}`} className={`proj-toc__link${depth > 0 ? " proj-toc__link--child" : ""}`}>
            {depth === 0 && <span className="proj-toc__num">{String(i + 1).padStart(2, "0")}</span>}
            {node.label}
          </a>
          {node.children && <TocTree nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ol>
  )
}

// ── New sections rendering (from ProjectSection[]) ───────────────────────────

function sectionDisplayType(path: string[], colors?: BrandColor[]): "logo" | "icon" | "print" | "colors" | "default" {
  if (colors && colors.length > 0) return "colors"
  const lower = path.map((s) => s.toLowerCase())
  if (lower.some((s) => s === "icon logo")) return "icon"
  if (lower.some((s) =>
    s === "logo" || s.includes("horizontal") || s.includes("vertical logo") ||
    s.includes("mascot") || s.includes("typography logo") || s.includes("badge logo")
  )) return "logo"
  if (lower.some((s) =>
    s.includes("print") || s.includes("stationery") || s.includes("business") || s.includes("packaging")
  )) return "print"
  return "default"
}

function renderSection(section: ProjectSection, i: number, projectName: string) {
  const id = `section-${i}-${section.id}`
  const catLabel = section.path[0] === "Branding" ? "Branding" : section.path[0] ?? "Project"
  const type = sectionDisplayType(section.path, section.colors)

  if (type === "logo") {
    return (
      <section key={id} id={id} className="section-full proj-section">
        <div className="section-regular">
          <div className="proj-section__header">
            <span className="proj-section__label">{catLabel}</span>
            <h2 className="proj-section__title">{section.headline}</h2>
          </div>
          {section.body && <p className="proj-section__desc">{section.body}</p>}
          <div className="proj-logo-stage">
            {section.images.map((img) => (
              <div key={img} className="proj-logo-backdrop">
                <div className="proj-logo-art" style={{ width: 700, height: 420 }}>
                  <Image src={img} alt={section.headline} fill style={{ objectFit: "contain" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === "icon") {
    return (
      <section key={id} id={id} className="section-full proj-section">
        <div className="section-regular">
          <div className="proj-section__header">
            <span className="proj-section__label">{catLabel}</span>
            <h2 className="proj-section__title">{section.headline}</h2>
          </div>
          {section.body && <p className="proj-section__desc">{section.body}</p>}
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

  if (type === "print") {
    return (
      <section key={id} id={id} className="section-full proj-section">
        <div className="section-regular">
          <div className="proj-section__header">
            <span className="proj-section__label">{catLabel}</span>
            <h2 className="proj-section__title">{section.headline}</h2>
          </div>
          {section.body && <p className="proj-section__desc">{section.body}</p>}
          <div className="proj-print-grid">
            {section.images.map((img) => (
              <div key={img} className="proj-print-card">
                <Image
                  src={img}
                  alt={`${projectName} ${section.headline}`}
                  width={840}
                  height={540}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === "colors") {
    const pathLower = section.path.map((s) => s.toLowerCase())
    const isGradient = pathLower.includes("gradient")
    const gradientCss = `linear-gradient(135deg, ${section.colors!.map((c) => c.hex).join(", ")})`

    return (
      <section key={id} id={id} className="section-full proj-section">
        <div className="section-regular">
          <div className="proj-section__header">
            <span className="proj-section__label">{catLabel}</span>
            <h2 className="proj-section__title">{section.headline}</h2>
          </div>
          {section.body && <p className="proj-section__desc">{section.body}</p>}

          {isGradient ? (
            <div className="proj-colors--gradient">
              {section.colors!.length >= 2 && (
                <div className="proj-color-gradient-bar" style={{ background: gradientCss }} />
              )}
              <div className="proj-colors proj-colors__swatches">
                {section.colors!.map((color, ci) => (
                  <div key={color.hex + ci} className="proj-color-card proj-color-card--small">
                    <div className="proj-color-card__swatch" style={{ backgroundColor: color.hex }} />
                    <div className="proj-color-card__info">
                      <p className="proj-color-card__role">{color.name || `Stop ${ci + 1}`}</p>
                      <p className="proj-color-card__hex">{color.hex}</p>
                      <p className="proj-color-card__rgb">{color.rgb}</p>
                      {color.usage && <p className="proj-color-card__usage">{color.usage}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="proj-colors">
              {section.colors!.map((color, ci) => (
                <div key={color.hex + ci} className="proj-color-family">
                  <div className="proj-color-card">
                    <div className="proj-color-card__swatch" style={{ backgroundColor: color.hex }} />
                    <div className="proj-color-card__info">
                      <p className="proj-color-card__role">{color.name || `Color ${ci + 1}`}</p>
                      <p className="proj-color-card__hex">{color.hex}</p>
                      <p className="proj-color-card__rgb">{color.rgb}</p>
                      {color.usage && <p className="proj-color-card__usage">{color.usage}</p>}
                    </div>
                  </div>
                  {color.children && color.children.length > 0 && (
                    <div className="proj-color-children">
                      {color.children.map((child, cj) => (
                        <div key={child.hex + cj} className="proj-color-card proj-color-card--child">
                          <div className="proj-color-card__swatch" style={{ backgroundColor: child.hex }} />
                          <div className="proj-color-card__info">
                            <p className="proj-color-card__role">{child.name || `Tone ${cj + 1}`}</p>
                            <p className="proj-color-card__hex">{child.hex}</p>
                            <p className="proj-color-card__rgb">{child.rgb}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  // default — image grid
  return (
    <section key={id} id={id} className="section-full proj-section">
      <div className="section-regular">
        <div className="proj-section__header">
          <span className="proj-section__label">{catLabel}</span>
          <h2 className="proj-section__title">{section.headline}</h2>
        </div>
        {section.body && <p className="proj-section__desc">{section.body}</p>}
        {section.images.length > 0 && (
          <div className={`proj-section__grid${section.images.length === 1 ? " proj-section__grid--single" : ""}`}>
            {section.images.map((img) => (
              <div key={img} className="proj-section__imgWrap">
                <Image src={img} alt={section.headline} fill className="proj-section__img" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
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

  const useNewSections = project.sections && project.sections.length > 0

  const allFiles = [...new Set(project.images ?? [])]
  const images = allFiles.filter((f) => !isVideoFile(f.split("/").pop() ?? f))
  const videos = allFiles.filter((f) => isVideoFile(f.split("/").pop() ?? f))
  const legacySections = useNewSections ? [] : buildSections(images, project.sectionDescriptions)
  const hasBrandColors = project.brandColors && project.brandColors.length > 0
  const hasMission = !!project.mission
  const hasVision = !!project.vision

  const tocNodes = useNewSections ? [] : buildHierarchicalToc(legacySections, hasMission, hasVision)

  const thumbnail = project.thumbnails?.[0] ?? project.images?.[0] ?? ""

  return (
    <main className="proj-page">

      {/* ── Hero ── */}
      <ProjectHero
        thumbnail={thumbnail}
        eyebrow={`${project.category === "branding" ? "Brand Identity" : "Project"} ${new Date().getFullYear()}`}
        title={project.name}
        desc={project.description}
      />

      {/* ── Contents (blends with hero) ── */}
      <section className="section-full proj-intro">
        <div className="section-regular proj-intro__inner">
          {tocNodes.length > 0 && (
            <nav className="proj-toc" aria-label="Contents">
              <p className="proj-toc__heading">Contents</p>
              <TocTree nodes={tocNodes} />
            </nav>
          )}
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      {(project.mission || project.vision) && (
        <section id="proj-introduction" className="section-regular proj-strategy">
          {project.mission && (
            <div id="proj-mission" className="proj-strategy__item">
              <p className="proj-strategy__label">Mission</p>
              <p className="proj-strategy__text">{project.mission}</p>
            </div>
          )}
          {project.vision && (
            <div id="proj-vision" className="proj-strategy__item">
              <p className="proj-strategy__label">Vision</p>
              <p className="proj-strategy__text">{project.vision}</p>
            </div>
          )}
        </section>
      )}

      {/* ── Sections (new tree-based) ── */}
      {useNewSections && project.sections!.map((section, i) =>
        renderSection(section, i, project.name)
      )}

      {/* ── Sections (legacy image-name-based) ── */}
      {!useNewSections && legacySections.map((section, i) => {
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

      {/* ── Device Preview (Website / Application) ── */}
      {project.deviceVideos && (project.deviceVideos.mobile || project.deviceVideos.desktop) && (() => {
        const { type = "website", mobile, desktop } = project.deviceVideos!
        const title = type === "application" ? "Application" : "Website"
        return (
          <section className="section-full proj-section proj-section--devices">
            <div className="section-regular proj-devices-inner">
              <div className="proj-section__header">
                <span className="proj-section__label">UI / UX</span>
                <h2 className="proj-section__title">{title}</h2>
              </div>
              <div className="proj-devices">
                {desktop && (
                  <div className="proj-device proj-device--laptop">
                    <div className="proj-device__screen">
                      <video src={desktop} autoPlay muted loop playsInline />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/personal/devices/devices_laptop.svg" alt="" className="proj-device__frame" />
                  </div>
                )}
                {mobile && (
                  <div className="proj-device proj-device--mobile">
                    <div className="proj-device__screen">
                      <video src={mobile} autoPlay muted loop playsInline />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/personal/devices/devices_mobile.svg" alt="" className="proj-device__frame" />
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ── Website Videos / GIFs ── */}
      {videos.length > 0 && (
        <section className="section-regular proj-section">
          {videos.map((src) =>
            src.toLowerCase().endsWith(".gif") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
            ) : (
              <video
                key={src}
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )
          )}
        </section>
      )}

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
