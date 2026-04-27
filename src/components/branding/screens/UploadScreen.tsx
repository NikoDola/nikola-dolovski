"use client"
import { useState, useEffect } from "react"
import TextInput from "../shared/TextInput"
import UploadZone from "../shared/UploadZone"
import BackButton from "../shared/BackButton"
import "./UploadScreen.css"

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
      <div className="upload__header">
        <h1 className="upload__title">
          Tell us about your brand
        </h1>
        <p className="upload__subtitle">
          Share your current logo and some basic details so we know what we&apos;re working with.
        </p>
      </div>

      <div className="upload__fields">
        <TextInput label="Company Name" placeholder="e.g. Apex Studio" value={companyName}
          onChange={setCompany} />
        <TextInput label="Tagline" placeholder="e.g. Crafting tomorrow's brands" value={tagline} onChange={setTagline} hint="Optional" />
        <TextInput label="Established Year" placeholder="e.g. 2019" value={estYear} onChange={setEstYear} hint="Optional"
          note="This will only appear in your logo if you choose to include it." />
      </div>

      <div className="upload__zone-block">
        <div className="upload__zone-label">
          Current Logo
        </div>
        <UploadZone file={file} onFile={setFile} />
      </div>

      <div className="upload__tips">
        {[["Preferred", "SVG, AI, EPS, PDF — vector formats give the best results"], ["Accepted", "JPG, PNG — raster files work too; higher resolution is better"]].map(([label, tip]) => (
          <div key={label} className="upload__tip">
            <div className="upload__tip-label">✦ {label}</div>
            <div className="upload__tip-text">{tip}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
