"use client"
import { useRef } from "react"
import type { UiBuildState, SectionFile } from "../../types"

interface Props {
  build: UiBuildState
  onChange: (patch: Partial<UiBuildState>) => void
}

export function WebsiteEditor({ build, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const files: SectionFile[] = Array.from(incoming).map((f) => ({
      file: f, name: f.name, preview: URL.createObjectURL(f),
    }))
    onChange({ newFiles: [...build.newFiles, ...files] })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="sb__form">
      <label className="sb__formLabel">
        Section Headline
        <input className="sb__formInput" value={build.headline} placeholder="Website"
          onChange={(e) => onChange({ headline: e.target.value })} />
      </label>

      <div className="sb__formLabel">
        Type
        <div className="apfa__toggleRow" style={{ marginTop: "0.35rem" }}>
          {(["website", "application"] as const).map((t) => (
            <button key={t} type="button"
              className={`apfa__toggleBtn${build.deviceType === t ? " apfa__toggleBtn--active" : ""}`}
              onClick={() => onChange({ deviceType: t })}>
              {t === "website" ? "Website" : "Application"}
            </button>
          ))}
        </div>
      </div>

      {(build.existingImages.length > 0 || build.newFiles.length > 0) && (
        <div className="sb__existingImgs">
          {build.existingImages.map((img) => (
            <div key={img} className="sb__existingImg">
              <button type="button" className="sb__removeImg"
                onClick={() => onChange({ existingImages: build.existingImages.filter((x) => x !== img) })}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" />
              <span>{img.split("/").pop()}</span>
            </div>
          ))}
          {build.newFiles.map((f, i) => (
            <div key={i} className="sb__existingImg">
              <button type="button" className="sb__removeImg"
                onClick={() => onChange({ newFiles: build.newFiles.filter((_, j) => j !== i) })}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.preview} alt={f.name} />
              <span>{f.name}</span>
            </div>
          ))}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.svg,.webp,.avif" multiple
        style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
      <button type="button" className="apfa__addImg" onClick={() => fileInputRef.current?.click()}>
        + Upload Preview Image
      </button>

      <label className="sb__formLabel">
        Mobile video URL <span className="apfa__hint">— Firebase Storage URL</span>
        <input className="sb__formInput" type="url" value={build.mobileUrl}
          placeholder="https://firebasestorage.googleapis.com/..."
          onChange={(e) => onChange({ mobileUrl: e.target.value })} />
      </label>

      <label className="sb__formLabel">
        Desktop video URL <span className="apfa__hint">— Firebase Storage URL</span>
        <input className="sb__formInput" type="url" value={build.desktopUrl}
          placeholder="https://firebasestorage.googleapis.com/..."
          onChange={(e) => onChange({ desktopUrl: e.target.value })} />
      </label>
    </div>
  )
}
