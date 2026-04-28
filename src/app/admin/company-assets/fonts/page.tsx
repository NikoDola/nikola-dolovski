"use client"
import { useState, useEffect } from "react"
import AdminNav from "../../AdminNav"

interface FontEntry {
  id: string
  name: string
  family: string
  weight: number
  sample: string
  category: string
  embedParam: string
}

const CATEGORY_LABELS: Record<string, string> = { serif: "Serif", sans: "Sans-Serif", handwriting: "Handwriting" }

function buildGoogleFontsUrl(fonts: FontEntry[]) {
  const params = fonts.map(f => `family=${f.embedParam}`).join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

export default function FontsPage() {
  const [fonts, setFonts]         = useState<FontEntry[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [toDelete, setToDelete]   = useState<FontEntry | null>(null)
  const [deleting, setDeleting]   = useState(false)

  const [name, setName]           = useState("")
  const [family, setFamily]       = useState("")
  const [sample, setSample]       = useState("")
  const [category, setCategory]   = useState("sans")
  const [embedParam, setEmbed]    = useState("")
  const [weight, setWeight]       = useState(700)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetch("/api/company-assets/fonts")
      .then(r => r.json())
      .then((data: FontEntry[]) => { setFonts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (fonts.length === 0) return
    const existing = document.getElementById("ca-gfonts")
    if (existing) existing.remove()
    const link = document.createElement("link")
    link.id = "ca-gfonts"
    link.rel = "stylesheet"
    link.href = buildGoogleFontsUrl(fonts)
    document.head.appendChild(link)
  }, [fonts])

  const handleAdd = async () => {
    if (!embedParam.trim()) { setFormError("embedParam is required"); return }
    setFormError("")
    setSaving(true)
    const res = await fetch("/api/company-assets/fonts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || undefined, family: family || undefined, sample: sample || undefined, category, embedParam: embedParam.trim(), weight }),
    })
    if (res.ok) {
      const added: FontEntry = await res.json()
      setFonts(prev => [...prev, added])
      setName(""); setFamily(""); setSample(""); setEmbed(""); setWeight(700); setCategory("sans")
    }
    setSaving(false)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    const res = await fetch(`/api/company-assets/fonts/${toDelete.id}`, { method: "DELETE" })
    if (res.ok) setFonts(prev => prev.filter(f => f.id !== toDelete.id))
    setDeleting(false)
    setToDelete(null)
  }

  const grouped = fonts.reduce<Record<string, FontEntry[]>>((acc, f) => {
    const cat = f.category || "sans"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {})

  return (
    <div className="admin-page">
      <AdminNav backHref="/admin/company-assets" backLabel="Company Assets" sectionLabel="Fonts" />
      <div className="admin-inner">
        <div className="admin-header">
          <div className="admin-badge"><div className="admin-badge-dot" /><span className="admin-badge-label">Studio</span></div>
          <div className="admin-title-row">
            <h1 className="admin-title" style={{ margin: 0 }}>Font Library</h1>
            {!loading && <span className="admin-count">{fonts.length}</span>}
          </div>
          <p className="admin-subtitle">Add Google Fonts shown in the typography browser. Paste the embed parameter from the Google Fonts URL.</p>
        </div>

        <div className="ca-form-card">
          <div className="ca-form-title">Add a font</div>

          <div className="ca-field">
            <label className="ca-label">Embed param <span className="ca-required">*</span></label>
            <input className="ca-input" value={embedParam} onChange={e => setEmbed(e.target.value)} placeholder="e.g. Inter:wght@400;700" />
            <div className="ca-hint">The part after <code>family=</code> in a Google Fonts URL. Example: <code>Playfair+Display:wght@400;700</code></div>
          </div>

          <div className="ca-row-2">
            <div className="ca-field">
              <label className="ca-label">Display name</label>
              <input className="ca-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Playfair Display" />
            </div>
            <div className="ca-field">
              <label className="ca-label">Sample text</label>
              <input className="ca-input" value={sample} onChange={e => setSample(e.target.value)} placeholder="e.g. Elegant & Timeless" />
            </div>
          </div>

          <div className="ca-row-2">
            <div className="ca-field">
              <label className="ca-label">CSS font-family</label>
              <input className="ca-input" value={family} onChange={e => setFamily(e.target.value)} placeholder="e.g. 'Playfair Display', serif" />
            </div>
            <div className="ca-field">
              <label className="ca-label">Weight for preview</label>
              <input className="ca-input" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} placeholder="700" />
            </div>
          </div>

          <div className="ca-field">
            <label className="ca-label">Category</label>
            <div className="ca-pills">
              {["serif", "sans", "handwriting"].map(c => (
                <button key={c} className={`ca-pill${category === c ? " ca-pill--active" : ""}`} onClick={() => setCategory(c)}>
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {formError && <div className="ca-error">{formError}</div>}

          <button className="ca-submit" onClick={handleAdd} disabled={saving}>
            {saving ? "Adding..." : "Add font"}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Loading fonts...</p>
        ) : fonts.length === 0 ? (
          <div className="orders-empty">No fonts yet. Add a Google Font above.</div>
        ) : (
          Object.entries(grouped).map(([cat, catFonts]) => (
            <div key={cat} className="ca-font-group">
              <div className="ca-font-group__label">{CATEGORY_LABELS[cat] || cat}</div>
              <div className="ca-font-list">
                {catFonts.map(font => (
                  <div key={font.id} className="ca-font-item">
                    <div className="ca-font-item__preview">
                      <div style={{ fontFamily: font.family, fontWeight: font.weight, fontSize: "20px", color: "var(--color-text-primary)", lineHeight: 1.2 }}>{font.name}</div>
                      <div style={{ fontFamily: font.family, fontWeight: 400, fontSize: "13px", color: "var(--color-text-secondary)", fontStyle: "italic", marginTop: "4px" }}>{font.sample}</div>
                    </div>
                    <div className="ca-font-item__meta">
                      <span className="ca-font-item__embed">{font.embedParam}</span>
                    </div>
                    <button className="ca-font-item__delete" onClick={() => setToDelete(font)} title="Delete font">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M1 3h12M5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M11 3l-.8 9a1 1 0 0 1-1 .9H4.8a1 1 0 0 1-1-.9L3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
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
            <div className="delete-modal__title">Remove this font?</div>
            <div className="delete-modal__desc"><strong>{toDelete.name}</strong> will be removed from the font library.</div>
            <div className="delete-modal__actions">
              <button className="delete-modal__cancel" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="delete-modal__confirm" onClick={confirmDelete} disabled={deleting}>{deleting ? "Removing..." : "Yes, remove"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
