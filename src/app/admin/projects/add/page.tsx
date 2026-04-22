"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getProjects } from "@/lib/actions/projects"
import { TagsInput } from "@/components/ui/TagsInput"
import { validateImageFile, autoCorrectFilename, parseImageFilename, SECTION_ORDER } from "@/lib/imageNames"
import type { Project, BrandColor } from "@/types/project"
import "./add.css"

const empty: Project = {
  slug: "", name: "", category: "branding", description: "",
  mission: "", vision: "", href: "", clientThumbnail: "",
  client: { firstName: "", lastName: "" },
  services: [], review: "", technologyUsed: [],
  thumbnails: [], heroSection: [], images: [], brandColors: [],
  sectionDescriptions: {},
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function getInitials(firstName: string, lastName: string) {
  const a = firstName.trim()[0] ?? ""
  const b = lastName.trim()[0] ?? ""
  return (a + b).toUpperCase() || "?"
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Brand prefix extraction ──────────────────────────────────────────────────
// "@gmunchies_branding_logo_primary.svg" → "gmunchies"
function extractBrandPrefix(filename: string): string {
  const parsed = parseImageFilename(filename)
  return parsed?.brand ?? ""
}

function detectTechnologies(entries: AssetEntry[]): string[] {
  const found = new Set<string>()
  let hasUi = false
  for (const e of entries) {
    if (e.ext === "svg") found.add("Adobe Illustrator")
    if (["webp", "avif", "png", "jpg", "jpeg"].includes(e.ext)) found.add("Adobe Photoshop")
    if (e.baseName.includes("mockup")) found.add("Adobe Photoshop")
    const parsed = parseImageFilename(`${e.baseName}.${e.ext}`)
    if (parsed?.category === "ui") hasUi = true
  }
  if (hasUi) {
    for (const t of ["Figma", "HTML", "CSS", "React", "Next.js"]) found.add(t)
  }
  return [...found]
}

function detectSectionsFromPaths(paths: string[]): string[] {
  const found = new Set<string>()
  for (const path of paths) {
    const filename = path.split("/").pop() ?? ""
    const parsed = parseImageFilename(filename)
    if (!parsed || parsed.pathSegments.length === 0) continue
    const seg = parsed.pathSegments[0]
    const display = SECTION_ORDER.find(
      (s) => s.toLowerCase().replace(/[^a-z]/g, "") === seg.replace(/-/g, "")
    ) ?? seg
    found.add(display)
  }
  return SECTION_ORDER.filter((s) => found.has(s))
}

function detectSections(entries: AssetEntry[]): string[] {
  const found = new Set<string>()
  for (const e of entries) {
    if (!e.valid) continue
    const parsed = parseImageFilename(`${e.baseName}.${e.ext}`)
    if (!parsed || parsed.pathSegments.length === 0) continue
    const seg = parsed.pathSegments[0]
    // Map segment to display name using SECTION_ORDER
    const display = SECTION_ORDER.find((s) =>
      s.toLowerCase().replace(/[^a-z]/g, "") === seg.replace(/-/g, "")
    ) ?? seg
    found.add(display)
  }
  return SECTION_ORDER.filter((s) => found.has(s))
}

function detectServices(entries: AssetEntry[]): string[] {
  const found = new Set<string>()
  for (const e of entries) {
    if (!e.valid) continue
    const parsed = parseImageFilename(`${e.baseName}.${e.ext}`)
    if (!parsed || parsed.pathSegments.length === 0) continue
    const segs = parsed.pathSegments
    // Each parent segment individually: print, stationery, business-card
    const parents = segs.length > 1 ? segs.slice(0, -1) : segs
    for (const seg of parents) found.add(seg)
    // Last two joined as a pair: business-card-front, icon-outline, icon-white
    if (segs.length > 1) found.add(`${segs[segs.length - 2]}-${segs[segs.length - 1]}`)
  }
  return [...found]
}

// ── Asset entry ──────────────────────────────────────────────────────────────
interface AssetEntry {
  file: File
  baseName: string
  ext: string
  preview: string
  valid: boolean
  error?: string
}

function makeEntry(file: File): AssetEntry {
  const lastDot = file.name.lastIndexOf(".")
  const ext = lastDot >= 0 ? file.name.slice(lastDot + 1).toLowerCase() : ""
  const baseName = lastDot >= 0 ? file.name.slice(0, lastDot) : file.name
  const v = validateImageFile(file.name)
  return { file, baseName, ext, preview: URL.createObjectURL(file), valid: v.valid, error: v.error }
}

function revalidate(entry: AssetEntry, newBaseName: string): AssetEntry {
  const v = validateImageFile(`${newBaseName}.${entry.ext}`)
  return { ...entry, baseName: newBaseName, valid: v.valid, error: v.error }
}

// ── Color extraction ─────────────────────────────────────────────────────────
function extractHexSet(svgText: string): Set<string> {
  const set = new Set<string>()
  const regex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g
  let m
  while ((m = regex.exec(svgText)) !== null) {
    let h = m[1].toLowerCase()
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    const full = `#${h}`
    if (full === "#000000" || full === "#ffffff" || full === "#000" || full === "#fff") continue
    set.add(full)
  }
  return set
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

async function extractColorsFromAssets(entries: AssetEntry[]): Promise<BrandColor[]> {
  const svgs = entries.filter((e) => e.ext === "svg")
  if (svgs.length === 0) return []

  // For each SVG, collect its color set
  const sets: Set<string>[] = await Promise.all(
    svgs.map(async (e) => extractHexSet(await e.file.text()))
  )

  // Count how many SVG files each color appears in (cross-file frequency)
  const fileCount = new Map<string, number>()
  for (const s of sets) {
    for (const hex of s) {
      fileCount.set(hex, (fileCount.get(hex) ?? 0) + 1)
    }
  }

  return Array.from(fileCount.entries())
    .sort((a, b) => b[1] - a[1])       // colors in more files = more brand-like
    .map(([hex], order) => ({ hex, rgb: hexToRgb(hex), order, name: "", usage: "" }))
}

// ── Asset Card ───────────────────────────────────────────────────────────────
function AssetCard({
  entry, index, onChange, onRemove, onAutoCorrect,
}: {
  entry: AssetEntry; index: number
  onChange: (i: number, v: string) => void
  onRemove: (i: number) => void
  onAutoCorrect: (i: number) => void
}) {
  return (
    <div className={`apfa__assetCard${entry.valid ? " apfa__assetCard--valid" : " apfa__assetCard--invalid"}`}>
      <button type="button" className="apfa__assetRemove" onClick={() => onRemove(index)} title="Remove">✕</button>
      <div className="apfa__assetPreview">
        {["mp4", "webm", "mov"].includes(entry.ext) ? (
          <video src={entry.preview} muted autoPlay loop playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.preview} alt={entry.baseName} />
        )}
      </div>
      <div className="apfa__assetInfo">
        <div className="apfa__assetNameRow">
          <input
            className="apfa__assetNameInput"
            value={entry.baseName}
            onChange={(e) => onChange(index, e.target.value)}
            spellCheck={false}
          />
          <span className="apfa__assetExt">.{entry.ext}</span>
        </div>
        <div className="apfa__assetStatus">
          {entry.valid
            ? <span className="apfa__assetOk">✓ Valid</span>
            : (
              <span className="apfa__assetErrRow">
                <span className="apfa__assetErr" title={entry.error}>✗ {entry.error}</span>
                <button type="button" className="apfa__assetFixBtn" onClick={() => onAutoCorrect(index)} title="Auto-correct this file">
                  Fix
                </button>
              </span>
            )}
        </div>
      </div>
    </div>
  )
}

// ── Color Swatch ─────────────────────────────────────────────────────────────
const COLOR_ROLE_LABELS = [
  "Primary", "Secondary", "Accent",
  "Support 1", "Support 2", "Support 3",
  "Support 4", "Support 5", "Support 6", "Support 7",
]

function ColorSwatch({
  color, index, total, isDragOver,
  onUpdate, onMoveUp, onMoveDown, onRemove,
  onDragStart, onDragOver, onDrop,
}: {
  color: BrandColor; index: number; total: number; isDragOver: boolean
  onUpdate: (patch: Partial<BrandColor>) => void
  onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void
  onDragStart: () => void; onDragOver: () => void; onDrop: () => void
}) {
  const [editing, setEditing] = useState(false)
  const defaultLabel = COLOR_ROLE_LABELS[index] ?? `Color ${index + 1}`

  return (
    <div
      className={`apfa__colorSwatch${isDragOver ? " apfa__colorSwatch--over" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver() }}
      onDrop={onDrop}
      onDragEnd={() => onDrop()}
    >
      <span className="apfa__colorDrag" title="Drag to reorder">⠿</span>

      {/* Hex color picker */}
      <label className="apfa__colorDotWrap" title="Change color">
        <div className="apfa__colorDot" style={{ background: color.hex }} />
        <input
          type="color"
          value={color.hex}
          onChange={(e) => {
            const hex = e.target.value
            onUpdate({ hex, rgb: hexToRgb(hex) })
          }}
          className="apfa__colorInput"
        />
      </label>

      {editing ? (
        <div className="apfa__colorEdit">
          <input
            className="apfa__colorEditName"
            value={color.name ?? ""}
            placeholder={defaultLabel}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          <input
            className="apfa__colorEditUsage"
            value={color.usage ?? ""}
            placeholder="Usage (e.g. Primary: Passion & Energy)"
            onChange={(e) => onUpdate({ usage: e.target.value })}
          />
        </div>
      ) : (
        <div className="apfa__colorMeta">
          <span className="apfa__colorLabel">{color.name || defaultLabel}</span>
          <span className="apfa__colorHex">{color.hex}</span>
          <span className="apfa__colorRgb">{color.rgb}</span>
          {color.usage && <span className="apfa__colorUsage">{color.usage}</span>}
        </div>
      )}

      <div className="apfa__colorActions">
        <button type="button" onClick={() => setEditing((e) => !e)} title={editing ? "Done" : "Edit name & usage"}>
          {editing ? "✓" : "✏"}
        </button>
        <button type="button" onClick={onMoveUp} disabled={index === 0} title="Move up">↑</button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Move down">↓</button>
        <button type="button" onClick={onRemove} title="Remove">✕</button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AddProjectPage() {
  const params = useSearchParams()
  const router = useRouter()
  const editSlug = params.get("slug")

  const [form, setForm] = useState<Project>(empty)
  const [assets, setAssets] = useState<AssetEntry[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [colors, setColors] = useState<BrandColor[]>([])
  const [pickerHex, setPickerHex] = useState("#88D1D4")
  const [extracting, setExtracting] = useState(false)
  const [clientThumbFile, setClientThumbFile] = useState<File | null>(null)
  const [clientThumbPreview, setClientThumbPreview] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [visibleColors, setVisibleColors] = useState(10)
  const dragSrcRef = useRef<number | null>(null)
  const clientThumbRef = useRef<HTMLInputElement>(null)
  const assetInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editSlug) return
    getProjects().then((projects) => {
      const p = projects.find((p) => p.slug === editSlug)
      if (p) {
        setForm(p)
        if (p.brandColors) setColors(p.brandColors)
        if (p.images) setExistingImages(p.images)
      }
    })
  }, [editSlug])

  const set = (field: keyof Project, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const setClient = (field: keyof Project["client"], value: string) =>
    setForm((f) => ({ ...f, client: { ...f.client, [field]: value } }))

  const setSectionDesc = (section: string, value: string) =>
    setForm((f) => ({
      ...f,
      sectionDescriptions: { ...f.sectionDescriptions, [section]: value },
    }))

  const detectedSections = [
    ...new Set([...detectSections(assets), ...detectSectionsFromPaths(existingImages)])
  ].sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b))

  const handleDeleteExisting = (path: string) =>
    setExistingImages((prev) => prev.filter((p) => p !== path))

  const handleAssetFiles = async (files: File[]) => {
    const entries = files.map(makeEntry)
    const combined = [...assets, ...entries]
    setAssets(combined)
    if (assetInputRef.current) assetInputRef.current.value = ""

    // Auto-fill project name from brand prefix (only if currently empty)
    if (!form.name && files.length > 0) {
      const prefix = extractBrandPrefix(files[0].name)
      if (prefix) {
        const brandName = capitalize(prefix)
        setForm((f) => ({
          ...f,
          name: f.name || brandName,
          slug: f.slug || slugify(prefix),
        }))
      }
    }

    // Auto-fill services and technologies from uploaded files (merge, no duplicates)
    const detected = detectServices(combined)
    const detectedTech = detectTechnologies(combined)
    setForm((f) => ({
      ...f,
      ...(detected.length > 0 && { services: [...new Set([...f.services, ...detected])] }),
      ...(detectedTech.length > 0 && { technologyUsed: [...new Set([...f.technologyUsed, ...detectedTech])] }),
    }))

    // Auto-extract colors whenever SVG files are present
    const hasSvgs = combined.some((e) => e.ext === "svg")
    if (hasSvgs) {
      setExtracting(true)
      const extracted = await extractColorsFromAssets(combined)
      if (extracted.length > 0) setColors(extracted)
      setExtracting(false)
    }
  }

  const handleAssetChange = (i: number, newBase: string) =>
    setAssets((prev) => prev.map((e, j) => (j === i ? revalidate(e, newBase) : e)))

  const handleAssetRemove = (i: number) =>
    setAssets((prev) => prev.filter((_, j) => j !== i))

  const correctEntry = (entry: AssetEntry): AssetEntry => {
    if (entry.valid) return entry
    const corrected = autoCorrectFilename(entry.baseName, entry.ext)
    if (!corrected) return entry
    const lastDot = corrected.lastIndexOf(".")
    const newBase = lastDot >= 0 ? corrected.slice(0, lastDot) : corrected
    return revalidate(entry, newBase)
  }

  const handleAutoCorrect = () =>
    setAssets((prev) => prev.map(correctEntry))

  const handleAutoCorrectOne = (i: number) =>
    setAssets((prev) => prev.map((e, j) => (j === i ? correctEntry(e) : e)))

  const handleClientThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setClientThumbFile(file)
    setClientThumbPreview(URL.createObjectURL(file))
  }

  // ── Color management ──
  const updateColor = (i: number, patch: Partial<BrandColor>) =>
    setColors((prev) => prev.map((c, j) => (j === i ? { ...c, ...patch } : c)))

  const moveColor = (from: number, to: number) => {
    setColors((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next.map((c, i) => ({ ...c, order: i }))
    })
  }

  const removeColor = (i: number) =>
    setColors((prev) => prev.filter((_, j) => j !== i).map((c, i) => ({ ...c, order: i })))

  const addPickerColor = () => {
    const hex = pickerHex
    setColors((prev) => [
      ...prev,
      { hex, rgb: hexToRgb(hex), order: prev.length, name: "", usage: "" },
    ].map((c, i) => ({ ...c, order: i })))
  }

  const handleReExtract = async () => {
    setExtracting(true)
    const extracted = await extractColorsFromAssets(assets)
    if (extracted.length > 0) setColors(extracted)
    setExtracting(false)
  }

  // ── Drag handlers ──
  const handleColorDragStart = (i: number) => { dragSrcRef.current = i }
  const handleColorDragOver = (i: number) => { setDragOverIdx(i) }
  const handleColorDrop = (i: number) => {
    if (dragSrcRef.current !== null && dragSrcRef.current !== i) {
      moveColor(dragSrcRef.current, i)
    }
    dragSrcRef.current = null
    setDragOverIdx(null)
  }

  const hasErrors = assets.some((e) => !e.valid)
  const hasSvgs = assets.some((e) => e.ext === "svg")
  const initials = getInitials(form.client.firstName, form.client.lastName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasErrors) {
      setStatus({ msg: "Fix all image naming errors before saving.", ok: false })
      return
    }
    setSaving(true)
    setStatus(null)
    try {
      const clientThumbPath = clientThumbFile
        ? `/my-work/${form.slug}/images/client-thumbnail.${clientThumbFile.name.split(".").pop()}`
        : form.clientThumbnail

      const project: Project = {
        ...form,
        href: form.href || `/my-work/${form.slug}`,
        clientThumbnail: clientThumbPath,
        brandColors: colors.length > 0 ? colors : form.brandColors,
        images: existingImages,
      }

      const fd = new FormData()
      fd.append("project", JSON.stringify(project))
      for (const entry of assets) {
        fd.append("images", new File([entry.file], `${entry.baseName}.${entry.ext}`, { type: entry.file.type }))
      }
      if (clientThumbFile) fd.append("clientThumbnail", clientThumbFile)

      const res = await fetch("/api/push-project", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Push failed")

      setStatus({ msg: `Pushed to GitHub! Slug: ${project.slug}`, ok: true })
      setTimeout(() => router.push("/admin/projects"), 1800)
    } catch (err) {
      setStatus({ msg: err instanceof Error ? err.message : "Error", ok: false })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="apfa">
      <h1 className="apfa__title">{editSlug ? "Edit Project" : "Add Project"}</h1>
      <p className="apfa__subtitle">Upload assets first — project name and colors are detected automatically.</p>

      <form onSubmit={handleSubmit} className="apfa__form">

        {/* ── 1. Project Assets (first) ── */}
        <fieldset className="apfa__group">
          <legend>
            Project Assets
            <span className="apfa__hint">
              {" "}— <strong>_</strong> separates sections · <strong>-</strong> stays within a section
              · e.g. <code>gmunchies_icon-stock_branding.svg</code>
            </span>
          </legend>

          {/* Existing uploaded images */}
          {existingImages.length > 0 && (
            <div className="apfa__existingSection">
              <p className="apfa__existingLabel">Uploaded images — click × to remove</p>
              <div className="apfa__assetGrid">
                {existingImages.map((path) => {
                  const filename = path.split("/").pop() ?? path
                  return (
                    <div key={path} className="apfa__assetCard apfa__assetCard--valid apfa__assetCard--existing">
                      <button type="button" className="apfa__assetRemove" onClick={() => handleDeleteExisting(path)} title="Remove">✕</button>
                      <div className="apfa__assetPreview">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={path} alt={filename} />
                      </div>
                      <div className="apfa__assetInfo">
                        <span className="apfa__assetNameInput apfa__assetNameInput--readonly" title={filename}>{filename}</span>
                        <span className="apfa__assetOk">✓ Saved</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {assets.length === 0 && existingImages.length === 0 ? (
            <p className="apfa__assetEmpty">
              Upload your design files. Brand name and colors will be auto-detected from SVGs.
            </p>
          ) : assets.length > 0 ? (
            <>
              {hasErrors && (
                <div className="apfa__autoCorrectBar">
                  <span className="apfa__autoCorrectInfo">
                    {assets.filter(e => !e.valid).length} file{assets.filter(e => !e.valid).length !== 1 ? "s" : ""} with naming errors
                  </span>
                  <button type="button" onClick={handleAutoCorrect} className="apfa__autoCorrectBtn">
                    Auto-correct All
                  </button>
                </div>
              )}
            <div className="apfa__assetGrid">
              {assets.map((entry, i) => (
                <AssetCard key={i} entry={entry} index={i} onChange={handleAssetChange} onRemove={handleAssetRemove} onAutoCorrect={handleAutoCorrectOne} />
              ))}
            </div>
            </>
          ) : null}

          <input
            ref={assetInputRef}
            type="file"
            accept="image/*,.svg,video/mp4,video/webm,.mov"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleAssetFiles(Array.from(e.target.files ?? []))}
          />
          <div className="apfa__assetActions">
            <button type="button" onClick={() => assetInputRef.current?.click()} className="apfa__addImg">
              + Upload Assets
            </button>
            {hasSvgs && (
              <button type="button" onClick={handleReExtract} className="apfa__generateColors" disabled={extracting}>
                {extracting ? "Extracting..." : "Re-extract Colors"}
              </button>
            )}
          </div>

          {assets.length > 0 && hasErrors && (
            <p className="apfa__assetNote">Rename files with ✗ — it validates as you type.</p>
          )}
          {extracting && <p className="apfa__assetNote apfa__assetNote--info">Detecting colors from SVGs…</p>}
        </fieldset>

        {/* ── 1b. Section Descriptions ── */}
        {detectedSections.length > 0 && (
          <fieldset className="apfa__group">
            <legend>
              Section Descriptions
              <span className="apfa__hint"> — optional description for each portfolio section</span>
            </legend>
            {detectedSections.map((section) => (
              <label key={section}>
                {section} <span className="apfa__hint">(optional)</span>
                <textarea
                  rows={3}
                  value={form.sectionDescriptions?.[section] ?? ""}
                  placeholder={`Describe the ${section.toLowerCase()} section...`}
                  onChange={(e) => setSectionDesc(section, e.target.value)}
                />
              </label>
            ))}
          </fieldset>
        )}

        {/* ── 2. Project Info ── */}
        <fieldset className="apfa__group">
          <legend>Project Info</legend>
          <label>Project Name
            <input value={form.name} onChange={(e) => {
              set("name", e.target.value)
              if (!editSlug) set("slug", slugify(e.target.value))
            }} required />
          </label>
          <label>Slug
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </label>
          <label>Category
            <select value={form.category} onChange={(e) => set("category", e.target.value as "branding" | "other")}>
              <option value="branding">Branding</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>Description <span className="apfa__hint">(60–500 chars)</span>
            <textarea value={form.description} minLength={60} maxLength={500} rows={4}
              onChange={(e) => set("description", e.target.value)} required />
          </label>
          <label>Page Link (href) <span className="apfa__hint">(leave blank to use /my-work/{"{slug}"})</span>
            <input value={form.href} placeholder={`/my-work/${form.slug || "slug"}`} onChange={(e) => set("href", e.target.value)} />
          </label>
        </fieldset>

        {/* ── 3. Brand Strategy ── */}
        <fieldset className="apfa__group">
          <legend>Brand Strategy</legend>
          <label>Mission <span className="apfa__hint">(what the brand does and for whom)</span>
            <textarea value={form.mission} rows={3} onChange={(e) => set("mission", e.target.value)} placeholder="We help X achieve Y through Z..." />
          </label>
          <label>Vision <span className="apfa__hint">(where the brand is going)</span>
            <textarea value={form.vision} rows={3} onChange={(e) => set("vision", e.target.value)} placeholder="To become the leading..." />
          </label>
        </fieldset>

        {/* ── 4. Client ── */}
        <fieldset className="apfa__group">
          <legend>Client</legend>
          <div className="apfa__clientThumb">
            <div className="apfa__clientAvatar" style={{ backgroundImage: clientThumbPreview ? `url(${clientThumbPreview})` : "none" }}>
              {!clientThumbPreview && <span>{initials}</span>}
            </div>
            <div className="apfa__clientAvatarMeta">
              <p>Client logo or photo <span className="apfa__hint">(optional)</span></p>
              <button type="button" onClick={() => clientThumbRef.current?.click()} className="apfa__addImg">
                {clientThumbFile ? "Change Image" : "Upload Image"}
              </button>
              <input ref={clientThumbRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleClientThumb} />
            </div>
          </div>
          <label>First Name <input value={form.client.firstName} onChange={(e) => setClient("firstName", e.target.value)} required /></label>
          <label>Last Name <input value={form.client.lastName} onChange={(e) => setClient("lastName", e.target.value)} required /></label>
        </fieldset>

        {/* ── 5. Services ── */}
        <fieldset className="apfa__group">
          <legend>Services</legend>
          <TagsInput tags={form.services} onAddTag={(t) => set("services", [...form.services, t])} onRemoveTag={(t) => set("services", form.services.filter((s) => s !== t))} />
        </fieldset>

        {/* ── 6. Technology ── */}
        <fieldset className="apfa__group">
          <legend>Technology Used</legend>
          <TagsInput tags={form.technologyUsed} onAddTag={(t) => set("technologyUsed", [...form.technologyUsed, t])} onRemoveTag={(t) => set("technologyUsed", form.technologyUsed.filter((s) => s !== t))} />
        </fieldset>

        {/* ── 7. Review ── */}
        <fieldset className="apfa__group">
          <legend>Client Review</legend>
          <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={4} placeholder="Client testimonial..." />
        </fieldset>

        {/* ── 8. Brand Colors ── */}
        <fieldset className="apfa__group">
          <legend>
            Brand Colors
            <span className="apfa__hint"> — auto-detected from SVGs · drag to reorder · click swatch to change</span>
          </legend>

          {colors.length > 0 && (
            <div className="apfa__colorList">
              {colors.slice(0, visibleColors).map((color, i) => (
                <ColorSwatch
                  key={color.hex + i}
                  color={color}
                  index={i}
                  total={colors.length}
                  isDragOver={dragOverIdx === i}
                  onUpdate={(patch) => updateColor(i, patch)}
                  onMoveUp={() => moveColor(i, i - 1)}
                  onMoveDown={() => moveColor(i, i + 1)}
                  onRemove={() => removeColor(i)}
                  onDragStart={() => handleColorDragStart(i)}
                  onDragOver={() => handleColorDragOver(i)}
                  onDrop={() => handleColorDrop(i)}
                />
              ))}
              {colors.length > visibleColors && (
                <button
                  type="button"
                  className="apfa__addImg"
                  onClick={() => setVisibleColors((v) => v + 10)}
                >
                  Load more ({colors.length - visibleColors} remaining)
                </button>
              )}
            </div>
          )}

          <div className="apfa__colorPickerRow">
            <label className="apfa__colorPickerLabel" title="Pick a color to add">
              <div className="apfa__colorPickerDot" style={{ background: pickerHex }} />
              <input
                type="color"
                value={pickerHex}
                onChange={(e) => setPickerHex(e.target.value)}
                className="apfa__colorInput"
              />
            </label>
            <button type="button" onClick={addPickerColor} className="apfa__addImg">
              + Add Color
            </button>
            {colors.length === 0 && !hasSvgs && (
              <span className="apfa__hint">Upload SVG files above to auto-detect colors</span>
            )}
          </div>
        </fieldset>

        {status && (
          <p className={`apfa__status${status.ok ? "" : " apfa__status--error"}`}>{status.msg}</p>
        )}

        <div className="apfa__footer">
          <button type="button" onClick={() => router.push("/admin/projects")} className="apfa__cancel">Cancel</button>
          <button type="submit" disabled={saving || hasErrors} className="apfa__save">
            {saving ? "Pushing to GitHub..." : "Save & Push"}
          </button>
        </div>

      </form>
    </div>
  )
}
