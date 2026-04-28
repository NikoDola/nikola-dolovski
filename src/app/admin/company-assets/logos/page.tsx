"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "../../AdminNav"

interface LogoMeta {
  id: string
  filename: string
  url: string
  title: string
  designer: string
  displayInStyleScreen: boolean
  age: string
  materialism: string
  formStyle: string
  obviousAbstract: string
  negativeSpace: string
  era: string
  gender: string
  colorCount: string
  logoType: string
  complexity: string
}

function deriveTags(logo: LogoMeta): string[] {
  const t: string[] = []
  if (logo.logoType && logo.logoType !== "Logo") t.push(logo.logoType)
  if (logo.age === "youthful")           t.push("Youthful")
  if (logo.age === "mature")             t.push("Mature")
  if (logo.materialism === "luxury")     t.push("Luxury")
  if (logo.materialism === "economical") t.push("Budget-friendly")
  if (logo.formStyle === "geometric")    t.push("Geometric")
  if (logo.formStyle === "organic")      t.push("Organic")
  if (logo.obviousAbstract === "obvious") t.push("Obvious")
  if (logo.obviousAbstract === "abstract") t.push("Abstract")
  if (logo.negativeSpace === "yes")      t.push("Neg. Space")
  if (logo.era === "vintage")            t.push("Vintage")
  if (logo.gender === "manly")           t.push("Masculine")
  if (logo.gender === "feminine")        t.push("Feminine")
  if (logo.colorCount === "1 color")     t.push("Mono")
  if (logo.colorCount === "4+ colors")   t.push("Colorful")
  if (logo.complexity === "minimal")     t.push("Minimal")
  if (logo.complexity === "complex")     t.push("Complex")
  return t
}

function PillGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="ca-field">
      <label className="ca-label">{label}</label>
      <div className="ca-pills">
        {options.map(o => (
          <button key={o} type="button" className={`ca-pill${value === o ? " ca-pill--active" : ""}`} onClick={() => onChange(o)}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LogosPage() {
  const router = useRouter()
  const [logos, setLogos]         = useState<LogoMeta[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toDelete, setToDelete]   = useState<LogoMeta | null>(null)
  const [deleting, setDeleting]   = useState(false)
  const [dragging, setDragging]   = useState(false)
  const [file, setFile]           = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const fileRef                   = useRef<HTMLInputElement>(null)

  const [title, setTitle]         = useState("")
  const [designer, setDesigner]   = useState("Niko Dola")
  const [displayIn, setDisplayIn] = useState(true)
  const [age, setAge]             = useState("between")
  const [materialism, setMat]     = useState("between")
  const [formStyle, setForm]      = useState("between")
  const [obvious, setObvious]     = useState("between")
  const [negSpace, setNeg]        = useState("no")
  const [era, setEra]             = useState("between")
  const [gender, setGender]       = useState("unisex")
  const [colorCount, setColor]    = useState("2 colors")
  const [logoType, setLogoType]   = useState("Logo")
  const [complexity, setComplex]  = useState("between")

  useEffect(() => {
    fetch("/company-assets/logos.json")
      .then(r => r.json())
      .then((data: LogoMeta[]) => { setLogos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const pickFile = (f: File) => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const resetForm = () => {
    setFile(null); setPreview(null); setTitle(""); setDesigner("Niko Dola")
    setDisplayIn(true); setAge("between"); setMat("between"); setForm("between")
    setObvious("between"); setNeg("no"); setEra("between"); setGender("unisex")
    setColor("2 colors"); setLogoType("Logo"); setComplex("between")
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("title", title)
    fd.append("designer", designer)
    fd.append("displayInStyleScreen", String(displayIn))
    fd.append("age", age)
    fd.append("materialism", materialism)
    fd.append("formStyle", formStyle)
    fd.append("obviousAbstract", obvious)
    fd.append("negativeSpace", negSpace)
    fd.append("era", era)
    fd.append("gender", gender)
    fd.append("colorCount", colorCount)
    fd.append("logoType", logoType)
    fd.append("complexity", complexity)

    const res = await fetch("/api/company-assets/logos", { method: "POST", body: fd })
    if (res.ok) {
      const added: LogoMeta = await res.json()
      setLogos(prev => [added, ...prev])
      resetForm()
    }
    setUploading(false)
  }

  const toggleDisplay = async (logo: LogoMeta) => {
    const updated = { ...logo, displayInStyleScreen: !logo.displayInStyleScreen }
    setLogos(prev => prev.map(l => l.id === logo.id ? updated : l))
    await fetch(`/api/company-assets/logos/${logo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayInStyleScreen: updated.displayInStyleScreen }),
    })
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    const res = await fetch(`/api/company-assets/logos/${toDelete.id}`, { method: "DELETE" })
    if (res.ok) setLogos(prev => prev.filter(l => l.id !== toDelete.id))
    setDeleting(false)
    setToDelete(null)
  }

  return (
    <div className="admin-page">
      <AdminNav backHref="/admin/company-assets" backLabel="Company Assets" sectionLabel="Logo Library" />
      <div className="admin-inner">
        <div className="admin-header">
          <div className="admin-badge"><div className="admin-badge-dot" /><span className="admin-badge-label">Studio</span></div>
          <div className="admin-title-row">
            <h1 className="admin-title" style={{ margin: 0 }}>Logo Library</h1>
            {!loading && <span className="admin-count">{logos.length}</span>}
          </div>
          <p className="admin-subtitle">Upload portfolio logos used as style references in the branding calculator.</p>
        </div>

        <div className="ca-form-card">
          <div className="ca-form-title">Upload a logo</div>

          <div className="ca-field">
            <label className="ca-label">Logo image <span className="ca-required">*</span></label>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.svg,.webp" style={{ display: "none" }} onChange={e => e.target.files?.[0] && pickFile(e.target.files[0])} />
            <div
              className={`ca-dropzone${dragging ? " ca-dropzone--dragging" : ""}${file ? " ca-dropzone--filled" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }}
            >
              {preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="ca-dropzone__preview" />
                  <div className="ca-dropzone__replace">
                    <span>{file?.name}</span>
                    <span className="ca-dropzone__replace-hint">Click to replace</span>
                  </div>
                  <button className="ca-dropzone__remove" type="button" onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13V3M6 7l4-4 4 4" stroke="var(--color-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="15" width="16" height="2" rx="1" fill="var(--color-border)"/>
                  </svg>
                  <div>
                    <span className="ca-dropzone__heading">Drop a file or click to browse</span>
                    <span className="ca-dropzone__formats"> · PNG, JPG, SVG, WEBP</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="ca-row-2">
            <div className="ca-field">
              <label className="ca-label">Title</label>
              <input className="ca-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Bloom Coffee" />
            </div>
            <div className="ca-field">
              <label className="ca-label">Designer</label>
              <input className="ca-input" value={designer} onChange={e => setDesigner(e.target.value)} placeholder="Niko Dola" />
            </div>
          </div>

          <PillGroup label="Logo type"      options={["Logo","Wordmark","Badge","Icon Only"]}                      value={logoType}    onChange={setLogoType} />
          <PillGroup label="Age feel"       options={["youthful","between","mature"]}                               value={age}         onChange={setAge} />
          <PillGroup label="Materialism"    options={["economical","between","luxury"]}                             value={materialism} onChange={setMat} />
          <PillGroup label="Form"           options={["geometric","between","organic"]}                             value={formStyle}   onChange={setForm} />
          <PillGroup label="Clarity"        options={["obvious","between","abstract"]}                              value={obvious}     onChange={setObvious} />
          <PillGroup label="Era"            options={["vintage","between","modern"]}                                value={era}         onChange={setEra} />
          <PillGroup label="Gender feel"    options={["manly","unisex","feminine"]}                                 value={gender}      onChange={setGender} />
          <PillGroup label="Color count"    options={["1 color","2 colors","3 colors","4+ colors"]}                 value={colorCount}  onChange={setColor} />
          <PillGroup label="Complexity"      options={["minimal","between","complex"]}                             value={complexity}  onChange={setComplex} />
          <PillGroup label="Negative space" options={["yes","no"]}                                                  value={negSpace}    onChange={setNeg} />

          <div className="ca-field">
            <div className="ca-toggle-row" onClick={() => setDisplayIn(v => !v)}>
              <div className={`ca-toggle${displayIn ? " ca-toggle--active" : ""}`}>
                <div className="ca-toggle__knob" />
              </div>
              <div>
                <div className="ca-toggle-label">Show in style picker</div>
                <div className="ca-toggle-hint">Clients will see this logo in the &quot;Choose a design style&quot; step</div>
              </div>
            </div>
          </div>

          <button className="ca-submit" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload logo"}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Loading logos...</p>
        ) : logos.length === 0 ? (
          <div className="orders-empty">No logos yet. Upload one above.</div>
        ) : (
          <div className="ca-logo-grid">
            {logos.map(logo => {
              const tags = deriveTags(logo)
              return (
                <div key={logo.id} className="ca-logo-card">
                  <div className="ca-logo-card__img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.url} alt={logo.title || "Logo"} className="ca-logo-card__img" />
                    <div className="ca-logo-card__actions">
                      <button className="ca-logo-card__action-btn" onClick={() => router.push(`/admin/company-assets/logos/${logo.id}`)} title="Edit">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="ca-logo-card__action-btn ca-logo-card__action-btn--danger" onClick={() => setToDelete(logo)} title="Delete">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M1 3h12M5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M11 3l-.8 9a1 1 0 0 1-1 .9H4.8a1 1 0 0 1-1-.9L3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="ca-logo-card__body">
                    <div className="ca-logo-card__title">{logo.title || "Untitled"}</div>
                    <div className="ca-logo-card__designer">{logo.designer}</div>
                    {tags.length > 0 && (
                      <div className="ca-logo-card__tags">
                        {tags.map(tag => <span key={tag} className="ca-logo-card__tag">{tag}</span>)}
                      </div>
                    )}
                    <div className="ca-toggle-row ca-toggle-row--sm" onClick={() => toggleDisplay(logo)}>
                      <div className={`ca-toggle ca-toggle--sm${logo.displayInStyleScreen ? " ca-toggle--active" : ""}`}>
                        <div className="ca-toggle__knob" />
                      </div>
                      <span className="ca-toggle-label--sm">{logo.displayInStyleScreen ? "Visible in calculator" : "Hidden from calculator"}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toDelete && (
        <div className="delete-overlay" onClick={() => setToDelete(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal__icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 5h18M8 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M18 5l-1.2 14a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 5" stroke="#C0392B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="delete-modal__title">Delete this logo?</div>
            <div className="delete-modal__desc"><strong>{toDelete.title || "This logo"}</strong> will be permanently removed. This cannot be undone.</div>
            <div className="delete-modal__actions">
              <button className="delete-modal__cancel" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="delete-modal__confirm" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting..." : "Yes, delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
