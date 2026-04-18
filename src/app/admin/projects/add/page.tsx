"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getProjects } from "@/lib/actions/projects"
import { TagsInput } from "@/components/ui/TagsInput"
import { validateImageFile } from "@/lib/imageNames"
import type { Project, BrandColor } from "@/types/project"
import "./add.css"

const empty: Project = {
  slug: "", name: "", category: "branding", description: "",
  mission: "", vision: "", href: "", clientThumbnail: "",
  client: { firstName: "", lastName: "" },
  services: [], review: "", technologyUsed: [],
  thumbnails: [], heroSection: [], images: [], brandColors: [],
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function getInitials(firstName: string, lastName: string) {
  const a = firstName.trim()[0] ?? ""
  const b = lastName.trim()[0] ?? ""
  return (a + b).toUpperCase() || "?"
}

// ─── Asset entry ────────────────────────────────────────────────────────────
interface AssetEntry {
  file: File
  baseName: string   // editable: "primary-logo_branding"
  ext: string        // fixed: "svg"
  preview: string
  valid: boolean
  error?: string
}

function makeEntry(file: File): AssetEntry {
  const lastDot = file.name.lastIndexOf(".")
  const ext = lastDot >= 0 ? file.name.slice(lastDot + 1).toLowerCase() : ""
  const baseName = lastDot >= 0 ? file.name.slice(0, lastDot) : file.name
  const v = validateImageFile(file.name)
  return {
    file,
    baseName,
    ext,
    preview: URL.createObjectURL(file),
    valid: v.valid,
    error: v.error,
  }
}

function revalidate(entry: AssetEntry, newBaseName: string): AssetEntry {
  const v = validateImageFile(`${newBaseName}.${entry.ext}`)
  return { ...entry, baseName: newBaseName, valid: v.valid, error: v.error }
}

// ─── SVG color extraction ────────────────────────────────────────────────────
async function extractColorsFromSvgs(entries: AssetEntry[]): Promise<BrandColor[]> {
  const svgEntries = entries.filter((e) => e.ext === "svg")
  const hexCounts = new Map<string, number>()

  for (const entry of svgEntries) {
    const text = await entry.file.text()
    const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g
    let match
    while ((match = hexRegex.exec(text)) !== null) {
      let h = match[1].toLowerCase()
      if (h.length === 3) h = h.split("").map((c) => c + c).join("")
      const full = `#${h}`
      if (full === "#000000" || full === "#ffffff") continue
      hexCounts.set(full, (hexCounts.get(full) ?? 0) + 1)
    }
  }

  return Array.from(hexCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([hex], order) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return { hex, rgb: `rgb(${r}, ${g}, ${b})`, order }
    })
}

// ─── Asset Card ─────────────────────────────────────────────────────────────
function AssetCard({
  entry, index, onChange, onRemove,
}: {
  entry: AssetEntry
  index: number
  onChange: (i: number, newBase: string) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className={`apfa__assetCard${entry.valid ? " apfa__assetCard--valid" : " apfa__assetCard--invalid"}`}>
      <button type="button" className="apfa__assetRemove" onClick={() => onRemove(index)} title="Remove">✕</button>
      <div className="apfa__assetPreview">
        <img src={entry.preview} alt={entry.baseName} />
      </div>
      <div className="apfa__assetInfo">
        <div className="apfa__assetNameRow">
          <input
            className="apfa__assetNameInput"
            value={entry.baseName}
            onChange={(e) => onChange(index, e.target.value)}
            spellCheck={false}
            title="Edit filename (without extension)"
          />
          <span className="apfa__assetExt">.{entry.ext}</span>
        </div>
        <div className="apfa__assetStatus">
          {entry.valid
            ? <span className="apfa__assetOk">✓ Valid</span>
            : <span className="apfa__assetErr" title={entry.error}>✗ {entry.error}</span>
          }
        </div>
      </div>
    </div>
  )
}

// ─── Color Swatch ───────────────────────────────────────────────────────────
function ColorSwatch({
  color, index, total,
  onMoveUp, onMoveDown, onRemove,
}: {
  color: BrandColor
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}) {
  const labels = ["Primary", "Secondary", "Accent", "Support 1", "Support 2",
    "Support 3", "Support 4", "Support 5", "Support 6", "Support 7"]
  return (
    <div className="apfa__colorSwatch">
      <div className="apfa__colorDot" style={{ background: color.hex }} />
      <div className="apfa__colorMeta">
        <span className="apfa__colorLabel">{labels[index] ?? `Color ${index + 1}`}</span>
        <span className="apfa__colorHex">{color.hex}</span>
        <span className="apfa__colorRgb">{color.rgb}</span>
      </div>
      <div className="apfa__colorActions">
        <button type="button" onClick={onMoveUp} disabled={index === 0} title="Move up">↑</button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Move down">↓</button>
        <button type="button" onClick={onRemove} title="Remove">✕</button>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AddProjectPage() {
  const params = useSearchParams()
  const router = useRouter()
  const editSlug = params.get("slug")

  const [form, setForm] = useState<Project>(empty)
  const [assets, setAssets] = useState<AssetEntry[]>([])
  const [colors, setColors] = useState<BrandColor[]>([])
  const [extracting, setExtracting] = useState(false)
  const [clientThumbFile, setClientThumbFile] = useState<File | null>(null)
  const [clientThumbPreview, setClientThumbPreview] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
  const clientThumbRef = useRef<HTMLInputElement>(null)
  const assetInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editSlug) return
    getProjects().then((projects) => {
      const p = projects.find((p) => p.slug === editSlug)
      if (p) {
        setForm(p)
        if (p.brandColors) setColors(p.brandColors)
      }
    })
  }, [editSlug])

  const set = (field: keyof Project, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const setClient = (field: keyof Project["client"], value: string) =>
    setForm((f) => ({ ...f, client: { ...f.client, [field]: value } }))

  const handleAssetFiles = (files: File[]) => {
    setAssets((prev) => [...prev, ...files.map(makeEntry)])
    if (assetInputRef.current) assetInputRef.current.value = ""
  }

  const handleAssetChange = (i: number, newBase: string) => {
    setAssets((prev) => prev.map((e, j) => (j === i ? revalidate(e, newBase) : e)))
  }

  const handleAssetRemove = (i: number) => {
    setAssets((prev) => prev.filter((_, j) => j !== i))
  }

  const handleClientThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setClientThumbFile(file)
    setClientThumbPreview(URL.createObjectURL(file))
  }

  const handleGenerateColors = async () => {
    setExtracting(true)
    const extracted = await extractColorsFromSvgs(assets)
    setColors(extracted)
    setExtracting(false)
  }

  const moveColor = (from: number, to: number) => {
    setColors((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next.map((c, i) => ({ ...c, order: i }))
    })
  }

  const removeColor = (i: number) => {
    setColors((prev) => prev.filter((_, j) => j !== i).map((c, i) => ({ ...c, order: i })))
  }

  const hasErrors = assets.some((e) => !e.valid)
  const hasSvgs = assets.some((e) => e.ext === "svg")

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
      }

      const fd = new FormData()
      fd.append("project", JSON.stringify(project))

      // Append each asset with its renamed filename
      for (const entry of assets) {
        const renamed = new File([entry.file], `${entry.baseName}.${entry.ext}`, { type: entry.file.type })
        fd.append("images", renamed)
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

  const initials = getInitials(form.client.firstName, form.client.lastName)

  return (
    <div className="apfa">
      <h1 className="apfa__title">{editSlug ? "Edit Project" : "Add Project"}</h1>
      <p className="apfa__subtitle">Files push directly to GitHub and update the live portfolio.</p>

      <form onSubmit={handleSubmit} className="apfa__form">

        {/* ── Project Info ── */}
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
          <label>Description <span className="apfa__hint">(max 60 chars — shown on home thumbnail)</span>
            <input value={form.description} maxLength={60} onChange={(e) => set("description", e.target.value)} required />
          </label>
          <label>Page Link (href) <span className="apfa__hint">(leave blank to use /my-work/{"{slug}"})</span>
            <input value={form.href} placeholder={`/my-work/${form.slug || "slug"}`} onChange={(e) => set("href", e.target.value)} />
          </label>
        </fieldset>

        {/* ── Brand Strategy ── */}
        <fieldset className="apfa__group">
          <legend>Brand Strategy</legend>
          <label>Mission <span className="apfa__hint">(what the brand does and for whom)</span>
            <textarea value={form.mission} rows={3} onChange={(e) => set("mission", e.target.value)} placeholder="We help X achieve Y through Z..." />
          </label>
          <label>Vision <span className="apfa__hint">(where the brand is going)</span>
            <textarea value={form.vision} rows={3} onChange={(e) => set("vision", e.target.value)} placeholder="To become the leading..." />
          </label>
        </fieldset>

        {/* ── Client ── */}
        <fieldset className="apfa__group">
          <legend>Client</legend>
          <div className="apfa__clientThumb">
            <div className="apfa__clientAvatar" style={{ backgroundImage: clientThumbPreview ? `url(${clientThumbPreview})` : "none" }}>
              {!clientThumbPreview && <span>{initials}</span>}
            </div>
            <div className="apfa__clientAvatarMeta">
              <p>Client logo or photo <span className="apfa__hint">(optional — initials shown if empty)</span></p>
              <button type="button" onClick={() => clientThumbRef.current?.click()} className="apfa__addImg">
                {clientThumbFile ? "Change Image" : "Upload Image"}
              </button>
              <input ref={clientThumbRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleClientThumb} />
            </div>
          </div>
          <label>First Name <input value={form.client.firstName} onChange={(e) => setClient("firstName", e.target.value)} required /></label>
          <label>Last Name <input value={form.client.lastName} onChange={(e) => setClient("lastName", e.target.value)} required /></label>
        </fieldset>

        {/* ── Services ── */}
        <fieldset className="apfa__group">
          <legend>Services</legend>
          <TagsInput tags={form.services} onAddTag={(t) => set("services", [...form.services, t])} onRemoveTag={(t) => set("services", form.services.filter((s) => s !== t))} />
        </fieldset>

        {/* ── Technology ── */}
        <fieldset className="apfa__group">
          <legend>Technology Used</legend>
          <TagsInput tags={form.technologyUsed} onAddTag={(t) => set("technologyUsed", [...form.technologyUsed, t])} onRemoveTag={(t) => set("technologyUsed", form.technologyUsed.filter((s) => s !== t))} />
        </fieldset>

        {/* ── Review ── */}
        <fieldset className="apfa__group">
          <legend>Client Review</legend>
          <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={4} placeholder="Client testimonial..." />
        </fieldset>

        {/* ── Project Assets ── */}
        <fieldset className="apfa__group">
          <legend>
            Project Assets
            <span className="apfa__hint"> — name files as: primary-logo_branding.svg · landing-page_ui.png</span>
          </legend>

          {assets.length === 0 ? (
            <p className="apfa__assetEmpty">No files uploaded yet. Images are optional.</p>
          ) : (
            <div className="apfa__assetGrid">
              {assets.map((entry, i) => (
                <AssetCard
                  key={i}
                  entry={entry}
                  index={i}
                  onChange={handleAssetChange}
                  onRemove={handleAssetRemove}
                />
              ))}
            </div>
          )}

          <input
            ref={assetInputRef}
            type="file"
            accept="image/*,.svg"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleAssetFiles(Array.from(e.target.files ?? []))}
          />
          <div className="apfa__assetActions">
            <button type="button" onClick={() => assetInputRef.current?.click()} className="apfa__addImg">
              + Upload Assets
            </button>
            {hasSvgs && (
              <button
                type="button"
                onClick={handleGenerateColors}
                className="apfa__generateColors"
                disabled={extracting}
              >
                {extracting ? "Extracting..." : "Generate Colors from SVG"}
              </button>
            )}
          </div>

          {assets.length > 0 && hasErrors && (
            <p className="apfa__assetNote">
              Rename files with ✗ before saving. Edit the input — it validates as you type.
            </p>
          )}
        </fieldset>

        {/* ── Brand Colors ── */}
        {colors.length > 0 && (
          <fieldset className="apfa__group">
            <legend>Brand Colors <span className="apfa__hint">(drag to reorder — first = primary)</span></legend>
            <div className="apfa__colorList">
              {colors.map((color, i) => (
                <ColorSwatch
                  key={color.hex + i}
                  color={color}
                  index={i}
                  total={colors.length}
                  onMoveUp={() => moveColor(i, i - 1)}
                  onMoveDown={() => moveColor(i, i + 1)}
                  onRemove={() => removeColor(i)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {status && (
          <p className={`apfa__status${status.ok ? "" : " apfa__status--error"}`}>
            {status.msg}
          </p>
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
