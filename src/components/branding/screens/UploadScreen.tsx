"use client"
import { useState } from "react"
import { T } from "../tokens"
import TextInput from "../shared/TextInput"
import UploadZone from "../shared/UploadZone"
import BackButton from "../shared/BackButton"
import Button from "../shared/Button"

interface UploadInfo { companyName: string; tagline: string; estYear: string; description: string; file: File | null }
interface Props { onBack: () => void; onNext: (info: UploadInfo) => void }

export default function UploadScreen({ onBack, onNext }: Props) {
  const [file, setFile]           = useState<File | null>(null)
  const [companyName, setCompany] = useState("")
  const [tagline, setTagline]     = useState("")
  const [estYear, setEstYear]     = useState("")
  const [description, setDesc]    = useState("")
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const handleNext = () => {
    const e: Record<string, string> = {}
    if (!companyName.trim()) e.companyName = "Company name is required"
    if (!file) e.file = "Please upload your current logo"
    if (Object.keys(e).length) { setErrors(e); return }
    onNext({ companyName, tagline, estYear, description, file })
  }

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Tell us about your brand
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          Share your current logo and some basic details so we know what we're working with.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.space["5"], marginBottom: T.space["6"] }}>
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName}
          onChange={v => { setCompany(v); setErrors(p => ({...p, companyName: ""})) }} required error={errors.companyName} />
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
        <TextInput label="Established Year" placeholder="e.g. 2019" value={estYear} onChange={setEstYear} hint="Optional"
          note="This will only appear in your logo if you choose to include it." />
      </div>

      <div style={{ marginBottom: T.space["2"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>
          Current Logo <span style={{ color: T.color.accent }}>*</span>
        </div>
        <UploadZone file={file} onFile={f => { setFile(f); setErrors(p => ({...p, file: ""})) }} />
        {errors.file && <div style={{ fontSize: T.fontSize.xs, color: T.color.error, marginTop: T.space["2"] }}>{errors.file}</div>}
      </div>

      <div style={{ display: "flex", gap: T.space["4"], marginBottom: T.space["10"], marginTop: T.space["4"] }}>
        {[["Preferred", "SVG, AI, EPS, PDF — vector formats give the best results"], ["Accepted", "JPG, PNG — raster files work too; higher resolution is better"]].map(([label, tip]) => (
          <div key={label} style={{ flex: 1, borderRadius: T.radius.lg, padding: `${T.space["3"]} 0` }}>
            <div style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: T.color.accent, letterSpacing: T.letterSpacing.wider, textTransform: "uppercase", marginBottom: T.space["2"] }}>✦ {label}</div>
            <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>{tip}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleNext} size="lg"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
          Next — Variations
        </Button>
      </div>
    </div>
  )
}
