"use client"
import { useRef } from "react"
import type { SectionFile } from "../../types"

interface Props {
  existingImages: string[]
  newFiles: SectionFile[]
  onChange: (existingImages: string[], newFiles: SectionFile[]) => void
}

export function ImageEditor({ existingImages, newFiles, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {existingImages.length > 0 && (
        <div className="sb__existingImgs">
          {existingImages.map((img) => (
            <div key={img} className="sb__existingImg">
              <button type="button" className="sb__removeImg"
                onClick={() => onChange(existingImages.filter((x) => x !== img), newFiles)}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" />
              <span>{img.split("/").pop()}</span>
            </div>
          ))}
        </div>
      )}

      {newFiles.length > 0 && (
        <div className="sb__fileGrid">
          {newFiles.map((f, i) => (
            <div key={i} className="sb__fileCard">
              <button type="button" className="sb__removeImg"
                onClick={() => onChange(existingImages, newFiles.filter((_, j) => j !== i))}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.preview} alt={f.name} />
              <span>{f.name}</span>
            </div>
          ))}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.svg" multiple style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).map((f) => ({
            file: f, name: f.name, preview: URL.createObjectURL(f),
          }))
          onChange(existingImages, [...newFiles, ...files])
          if (fileInputRef.current) fileInputRef.current.value = ""
        }} />
      <button type="button" className="apfa__addImg" onClick={() => fileInputRef.current?.click()}>
        + Upload Images
      </button>
    </>
  )
}
