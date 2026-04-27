"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"
import TextInput from "../shared/TextInput"
import UploadZone from "../shared/UploadZone"
import BackButton from "../shared/BackButton"

interface UploadInfo { companyName: string; tagline: string; estYear: string; description: string; file: File | null }
interface Props { onBack: () => void; onNext: (info: UploadInfo) => void; submitRef?: { current: (() => void) | null } }

export default function UploadScreen({ onBack, onNext, submitRef }: Props) {
  const [file, setFile]           = useState<File | null>(null)
  const [companyName, setCompany] = useState("")
  const [tagline, setTagline]     = useState("")
  const [estYear, setEstYear]     = useState("")

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ companyName, tagline, estYear, description: "", file })
  })

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Tell us about your brand
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          Share your current logo and some basic details so we know what we&apos;re working with.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.space["5"], marginBottom: T.space["6"] }}>
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName}
          onChange={setCompany} />
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
        <TextInput label="Established Year" placeholder="e.g. 2019" value={estYear} onChange={setEstYear} hint="Optional"
          note="This will only appear in your logo if you choose to include it." />
      </div>

      <div style={{ marginBottom: T.space["2"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>
          Current Logo
        </div>
        <UploadZone file={file} onFile={setFile} />
      </div>

      <div style={{ display: "flex", gap: T.space["4"], marginBottom: T.space["10"], marginTop: T.space["4"] }}>
        {[["Preferred", "SVG, AI, EPS, PDF — vector formats give the best results"], ["Accepted", "JPG, PNG — raster files work too; higher resolution is better"]].map(([label, tip]) => (
          <div key={label} style={{ flex: 1, borderRadius: T.radius.lg, padding: `${T.space["3"]} 0` }}>
            <div style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: T.color.accent, letterSpacing: T.letterSpacing.wider, textTransform: "uppercase", marginBottom: T.space["2"] }}>✦ {label}</div>
            <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>{tip}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
