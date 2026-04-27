"use client"
import { useState, useRef } from "react"
import { T } from "../tokens"

interface UploadZoneProps {
  file:   File | null
  onFile: (f: File) => void
}

export default function UploadZone({ file, onFile }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? T.color.accent : file ? T.color.accent : T.color.border}`,
        borderRadius: T.radius.xl, padding: `${T.space["12"]} ${T.space["8"]}`,
        background: dragging ? T.color.accentLight : file ? T.color.accentLight : T.color.surface,
        cursor: "pointer", transition: `all ${T.duration.normal} ${T.easing.smooth}`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: T.space["4"], textAlign: "center",
      }}
    >
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.svg,.ai,.pdf,.eps" style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />

      {file ? (
        <>
          <div style={{ width: "56px", height: "56px", borderRadius: T.radius.lg, background: T.color.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3v14M7 11l6 6 6-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="20" width="18" height="2.5" rx="1.25" fill="#fff"/></svg>
          </div>
          <div>
            <div style={{ fontSize: T.fontSize.md, fontWeight: T.fontWeight.semibold, color: T.color.accent }}>{file.name}</div>
            <div style={{ fontSize: T.fontSize.sm, color: T.color.textMuted, marginTop: T.space["1"] }}>{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: "56px", height: "56px", borderRadius: T.radius.lg, background: T.color.surfaceAlt, border: `1px solid ${T.color.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 17V3M7 9l6-6 6 6" stroke={T.color.textMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="20" width="18" height="2.5" rx="1.25" fill={T.color.border}/></svg>
          </div>
          <div>
            <div style={{ fontSize: T.fontSize.md, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary }}>Drop your logo here</div>
            <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, marginTop: T.space["1"] }}>or click to browse</div>
            <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: T.space["3"], letterSpacing: T.letterSpacing.wide, textTransform: "uppercase" }}>JPG · PNG · SVG · AI · PDF · EPS</div>
          </div>
        </>
      )}
    </div>
  )
}
