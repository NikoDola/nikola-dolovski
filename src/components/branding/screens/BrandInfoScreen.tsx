"use client"
import { useState, useEffect } from "react"
import TextInput from "../shared/TextInput"
import BackButton from "../shared/BackButton"
import "./BrandInfoScreen.css"

interface BrandInfo { companyName: string; tagline: string; description: string }
interface Props { onBack: () => void; onNext: (info: BrandInfo) => void; submitRef?: { current: (() => void) | null }; initialValue?: Partial<BrandInfo> }

export default function BrandInfoScreen({ onBack, onNext, submitRef, initialValue }: Props) {
  const [companyName, setCompany] = useState(initialValue?.companyName ?? "")
  const [tagline, setTagline]     = useState(initialValue?.tagline ?? "")
  const [description, setDesc]    = useState(initialValue?.description ?? "")
  const [error, setError]         = useState(false)

  useEffect(() => {
    if (submitRef) submitRef.current = () => {
      if (!companyName.trim()) { setError(true); return }
      onNext({ companyName, tagline, description })
    }
  })

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div className="brand-info__header">
        <h1 className="brand-info__title">
          Tell us about your brand
        </h1>
        <p className="brand-info__subtitle">
          This helps us shape your logo to fit your identity. The more you share, the better the result.
        </p>
      </div>

      <div className="brand-info__fields">
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName}
          onChange={v => { setCompany(v); if (v.trim()) setError(false) }} />
        {error && (
          <p className="form-error">
            Please enter your company name to continue.
          </p>
        )}
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
      </div>

      <div className="brand-info__desc-block">
        <label className="brand-info__desc-label">
          About your company
          <span className="brand-info__desc-label-badge">Recommended</span>
        </label>
        <p className="brand-info__desc-hint">
          Tell us what you do, who your audience is, your values, and the feeling you want your logo to convey.
        </p>
        <textarea value={description} onChange={e => setDesc(e.target.value)} rows={5}
          placeholder="e.g. We're a boutique creative studio focused on sustainable brands..."
          className="brand-info__textarea"
        />
      </div>

    </div>
  )
}
