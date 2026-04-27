"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"
import TextInput from "../shared/TextInput"
import BackButton from "../shared/BackButton"

interface BrandInfo { companyName: string; tagline: string; estYear: string; description: string }
interface Props { onBack: () => void; onNext: (info: BrandInfo) => void; submitRef?: { current: (() => void) | null } }

export default function BrandInfoScreen({ onBack, onNext, submitRef }: Props) {
  const [companyName, setCompany] = useState("")
  const [tagline, setTagline]     = useState("")
  const [estYear, setEstYear]     = useState("")
  const [description, setDesc]    = useState("")

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ companyName, tagline, estYear, description })
  })

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Tell us about your brand
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          This helps us shape your logo to fit your identity. The more you share, the better the result.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: T.space["6"], maxWidth: "560px", marginBottom: T.space["6"] }}>
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName}
          onChange={setCompany} />
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
        <TextInput label="Established Year" placeholder="e.g. 2019" value={estYear} onChange={setEstYear} hint="Optional"
          note="This will only appear in your logo if you'd like it to — leave it blank to keep things clean." />
      </div>

      <div style={{ maxWidth: "560px", marginBottom: T.space["10"] }}>
        <label style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, display: "block", marginBottom: T.space["2"] }}>
          About your company
          <span style={{ fontSize: T.fontSize.xs, fontWeight: 400, color: T.color.accent, marginLeft: T.space["2"] }}>Recommended</span>
        </label>
        <p style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginBottom: T.space["3"], lineHeight: T.lineHeight.normal }}>
          Tell us what you do, who your audience is, your values, and the feeling you want your logo to convey.
        </p>
        <textarea value={description} onChange={e => setDesc(e.target.value)} rows={5}
          placeholder="e.g. We're a boutique creative studio focused on sustainable brands..."
          style={{ width: "100%", fontFamily: T.font.sans, fontSize: T.fontSize.base, color: T.color.textPrimary, background: T.color.surface, border: `1.5px solid ${T.color.border}`, borderRadius: T.radius.md, padding: T.space["4"], resize: "vertical", outline: "none", lineHeight: T.lineHeight.normal, boxSizing: "border-box" }}
        />
      </div>

    </div>
  )
}
