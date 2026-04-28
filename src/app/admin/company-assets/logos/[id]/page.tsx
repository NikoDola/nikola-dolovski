"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminNav from "../../../AdminNav"

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

export default function EditLogoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState("")
  const [saved, setSaved]       = useState(false)

  const [url, setUrl]           = useState("")
  const [title, setTitle]       = useState("")
  const [designer, setDesigner] = useState("Niko Dola")
  const [displayIn, setDisplayIn] = useState(true)
  const [age, setAge]           = useState("between")
  const [materialism, setMat]   = useState("between")
  const [formStyle, setForm]    = useState("between")
  const [obvious, setObvious]   = useState("between")
  const [negSpace, setNeg]      = useState("no")
  const [era, setEra]           = useState("between")
  const [gender, setGender]     = useState("unisex")
  const [colorCount, setColor]  = useState("2 colors")
  const [logoType, setLogoType] = useState("Logo")
  const [complexity, setComplex] = useState("between")

  useEffect(() => {
    fetch(`/api/company-assets/logos/${id}`)
      .then(r => r.json())
      .then((data: LogoMeta) => {
        setUrl(data.url || "")
        setTitle(data.title || "")
        setDesigner(data.designer || "Niko Dola")
        setDisplayIn(data.displayInStyleScreen !== false)
        setAge(data.age || "between")
        setMat(data.materialism || "between")
        setForm(data.formStyle || "between")
        setObvious(data.obviousAbstract || "between")
        setNeg(data.negativeSpace || "no")
        setEra(data.era || "between")
        setGender(data.gender || "unisex")
        setColor(data.colorCount || "2 colors")
        setLogoType(data.logoType || "Logo")
        setComplex(data.complexity || "between")
        setLoading(false)
      })
      .catch(() => { setError("Failed to load logo"); setLoading(false) })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/company-assets/logos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, designer, displayInStyleScreen: displayIn,
        age, materialism: materialism, formStyle, obviousAbstract: obvious,
        negativeSpace: negSpace, era, gender, colorCount, logoType, complexity,
      }),
    })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  const shell = (content: React.ReactNode) => (
    <div className="admin-page">
      <AdminNav backHref="/admin/company-assets/logos" backLabel="Logo Library" sectionLabel="Edit Logo" />
      <div className="admin-inner">{content}</div>
    </div>
  )

  if (loading) return shell(<p style={{ color: "var(--color-text-muted)" }}>Loading...</p>)
  if (error)   return shell(<p style={{ color: "var(--color-error)" }}>{error}</p>)

  return shell(
    <>
      <div className="admin-header">
        <div className="admin-badge"><div className="admin-badge-dot" /><span className="admin-badge-label">Studio</span></div>
        <h1 className="admin-title">{title || "Untitled logo"}</h1>
        <p className="admin-subtitle">Edit the metadata for this logo. The image cannot be changed — delete and re-upload if needed.</p>
      </div>

      <div className="ca-edit-layout">
        <div className="ca-edit-preview">
          <div className="ca-edit-preview__img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={title || "Logo"} className="ca-edit-preview__img" />
          </div>
          <button
            className="ca-edit-preview__delete"
            onClick={() => {
              if (!confirm("Delete this logo permanently?")) return
              fetch(`/api/company-assets/logos/${id}`, { method: "DELETE" })
                .then(() => router.push("/admin/company-assets/logos"))
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M11 3l-.8 9a1 1 0 0 1-1 .9H4.8a1 1 0 0 1-1-.9L3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete logo
          </button>
        </div>

        <div className="ca-form-card" style={{ marginBottom: 0 }}>
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

          <PillGroup label="Logo type"      options={["Logo","Wordmark","Badge","Icon Only"]}           value={logoType}    onChange={setLogoType} />
          <PillGroup label="Age feel"       options={["youthful","between","mature"]}                    value={age}         onChange={setAge} />
          <PillGroup label="Materialism"    options={["economical","between","luxury"]}                  value={materialism} onChange={setMat} />
          <PillGroup label="Form"           options={["geometric","between","organic"]}                  value={formStyle}   onChange={setForm} />
          <PillGroup label="Clarity"        options={["obvious","between","abstract"]}                   value={obvious}     onChange={setObvious} />
          <PillGroup label="Complexity"     options={["minimal","between","complex"]}                    value={complexity}  onChange={setComplex} />
          <PillGroup label="Era"            options={["vintage","between","modern"]}                     value={era}         onChange={setEra} />
          <PillGroup label="Gender feel"    options={["manly","unisex","feminine"]}                      value={gender}      onChange={setGender} />
          <PillGroup label="Color count"    options={["1 color","2 colors","3 colors","4+ colors"]}      value={colorCount}  onChange={setColor} />
          <PillGroup label="Negative space" options={["yes","no"]}                                       value={negSpace}    onChange={setNeg} />

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

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <button className="ca-submit" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-accent)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
