"use client"
import { useState, useEffect } from "react"
import TextInput from "../shared/TextInput"
import UploadZone from "../shared/UploadZone"
import BackButton from "../shared/BackButton"
import "./UploadScreen.css"

interface UploadInfo { companyName: string; tagline: string; description: string; file: File | null }
interface Props { onBack: () => void; onNext: (info: UploadInfo) => void; submitRef?: { current: (() => void) | null } }

export default function UploadScreen({ onBack, onNext, submitRef }: Props) {
  const [companyName, setCompany] = useState("")
  const [tagline, setTagline]     = useState("")
  const [description, setDesc]    = useState("")
  const [file, setFile]           = useState<File | null>(null)

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ companyName, tagline, description, file })
  })

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div className="upload__header">
        <h1 className="upload__title">
          Tell us about your brand
        </h1>
        <p className="upload__subtitle">
          Share a few details about your company so we understand what we&apos;re working with before we begin.
        </p>
      </div>

      <div className="upload__fields">
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName} onChange={setCompany} />
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
      </div>

      <div className="upload__desc-block">
        <label className="upload__desc-label">
          About your company
          <span className="upload__desc-label-badge">Recommended</span>
        </label>
        <p className="upload__desc-hint">
          Tell us what you do, who your audience is, your values, and the feeling you want your logo to convey.
        </p>
        <textarea
          value={description}
          onChange={e => setDesc(e.target.value)}
          rows={5}
          placeholder="e.g. We're a boutique creative studio focused on sustainable brands..."
          className="upload__textarea"
        />
      </div>

      <div className="upload__zone-block">
        <div className="upload__zone-label">Current Logo</div>
        <UploadZone file={file} onFile={setFile} />
      </div>

      <div className="upload__tips">
        {[
          ["Preferred", "SVG, AI, EPS, PDF — vector formats give the best results"],
          ["Accepted",  "JPG, PNG — raster files work too; higher resolution is better"],
        ].map(([label, tip]) => (
          <div key={label} className="upload__tip">
            <div className="upload__tip-label">✦ {label}</div>
            <div className="upload__tip-text">{tip}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
