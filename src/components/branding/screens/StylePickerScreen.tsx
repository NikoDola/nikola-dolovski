"use client"
import { useState, useEffect, useRef } from "react"
import { T } from "../tokens"
import StyleCard from "../shared/StyleCard"
import BackButton from "../shared/BackButton"
import Button from "../shared/Button"
import { STYLE_PRESETS } from "../data"

interface StyleInfo { styles: string[]; inspirationFile: File | null }
interface Props { onBack: () => void; onNext: (info: StyleInfo) => void; nextLabel?: string }

const MAX_SELECT = 6
const BATCH_SIZE = 9

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="20 14" opacity="0.6"/>
    </svg>
  )
}

export default function StylePickerScreen({ onBack, onNext, nextLabel = "Next" }: Props) {
  const [selected, setSelected]        = useState<string[]>([])
  const [inspirationFile, setInspFile] = useState<File | null>(null)
  const [loadingFirst, setLoadingFirst] = useState(true)
  const [loadingMore, setLoadingMore]  = useState(false)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoadingFirst(false), 900)
    return () => clearTimeout(t)
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_SELECT) return prev
      return [...prev, id]
    })
  }

  const visiblePresets = STYLE_PRESETS.slice(0, visibleCount)
  const hasMore = visibleCount < STYLE_PRESETS.length

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Choose a design style
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          Pick up to <strong>6 styles</strong> that resonate with your brand.
        </p>
      </div>

      <div onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: T.space["4"], background: inspirationFile ? T.color.accentLight : T.color.surface, border: `1.5px dashed ${inspirationFile ? T.color.accent : T.color.border}`, borderRadius: T.radius.lg, padding: T.space["5"], cursor: "pointer", marginBottom: T.space["6"], transition: "all 180ms ease" }}>
        <input ref={fileRef} type="file" accept="image/*,.pdf,.svg" style={{ display: "none" }} onChange={e => e.target.files?.[0] && setInspFile(e.target.files[0])} />
        <div style={{ width: "40px", height: "40px", borderRadius: T.radius.md, background: inspirationFile ? T.color.accent : T.color.surfaceAlt, border: `1px solid ${T.color.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 12V4M5 8l4-4 4 4" stroke={inspirationFile ? "#fff" : T.color.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="12" height="2" rx="1" fill={inspirationFile ? "#fff" : T.color.border}/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: inspirationFile ? T.color.accent : T.color.textPrimary }}>
            {inspirationFile ? inspirationFile.name : "Upload inspiration from a brand you admire"}
          </div>
          <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: "2px" }}>
            {inspirationFile ? `${(inspirationFile.size/1024).toFixed(1)} KB · Click to replace` : "Optional — JPG, PNG, PDF, SVG"}
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: T.space["3"], marginBottom: T.space["4"] }}>
          <div style={{ background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.full, padding: `${T.space["1"]} ${T.space["4"]}`, fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.accent }}>
            {selected.length} / {MAX_SELECT} selected
          </div>
          {selected.length >= MAX_SELECT && <span style={{ fontSize: T.fontSize.xs, color: T.color.textMuted }}>Maximum reached</span>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: T.space["4"], marginBottom: T.space["6"] }}>
        {loadingFirst
          ? [...Array(BATCH_SIZE)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: "4/3", borderRadius: "12px" }} />)
          : visiblePresets.map((s, i) => (
              <StyleCard key={s.id} label={s.label} sublabel={s.sublabel} selected={selected.includes(s.id)}
                onClick={() => toggleSelect(s.id)} index={i} dimmed={selected.length >= MAX_SELECT && !selected.includes(s.id)}>
                {s.preview(T.color.accent)}
              </StyleCard>
            ))
        }
        {loadingMore && [...Array(BATCH_SIZE)].map((_, i) => <div key={"m"+i} className="skeleton" style={{ aspectRatio: "4/3", borderRadius: "12px" }} />)}
      </div>

      {!loadingFirst && hasMore && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: T.space["6"] }}>
          <button onClick={() => { if (loadingMore) return; setLoadingMore(true); setTimeout(() => { setVisibleCount(c => Math.min(c + BATCH_SIZE, STYLE_PRESETS.length)); setLoadingMore(false) }, 800) }}
            style={{ display: "inline-flex", alignItems: "center", gap: T.space["2"], background: T.color.surface, border: `1.5px solid ${T.color.border}`, borderRadius: T.radius.full, padding: `${T.space["3"]} ${T.space["6"]}`, fontSize: T.fontSize.sm, fontWeight: T.fontWeight.medium, color: T.color.textSecondary, fontFamily: T.font.sans, cursor: loadingMore ? "wait" : "pointer" }}>
            {loadingMore ? <><Spinner /> Loading...</> : <>Load more styles</>}
          </button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: T.space["4"], borderTop: `1px solid ${T.color.border}` }}>
        <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>
          {selected.length === 0 && !inspirationFile ? "Choose styles or upload inspiration" : `${selected.length} style${selected.length !== 1 ? "s" : ""} selected`}
        </span>
        <Button onClick={() => (selected.length > 0 || inspirationFile) && onNext({ styles: selected, inspirationFile })}
          disabled={selected.length === 0 && !inspirationFile} size="lg"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
