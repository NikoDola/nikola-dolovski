"use client"
import { useState, useEffect, useRef } from "react"
import StyleCard from "../shared/StyleCard"
import BackButton from "../shared/BackButton"
import { STYLE_PRESETS } from "../data"
import "./StylePickerScreen.css"

interface StyleInfo { styles: string[]; inspirationFile: File | null }
interface Props { onBack: () => void; onNext: (info: StyleInfo) => void; submitRef?: { current: (() => void) | null } }

const MAX_SELECT = 6
const BATCH_SIZE = 9

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="20 14" opacity="0.6"/>
    </svg>
  )
}

export default function StylePickerScreen({ onBack, onNext, submitRef }: Props) {
  const [selected, setSelected]        = useState<string[]>([])
  const [inspirationFile, setInspFile] = useState<File | null>(null)
  const [loadingFirst, setLoadingFirst] = useState(true)
  const [loadingMore, setLoadingMore]  = useState(false)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ styles: selected, inspirationFile })
  })

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
      <div className="style-picker__header">
        <h1 className="style-picker__title">
          Choose a design style
        </h1>
        <p className="style-picker__subtitle">
          Pick up to <strong>6 styles</strong> that resonate with your brand.
        </p>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className={`style-picker__upload${inspirationFile ? " style-picker__upload--active" : ""}`}
      >
        <input ref={fileRef} type="file" accept="image/*,.pdf,.svg" style={{ display: "none" }} onChange={e => e.target.files?.[0] && setInspFile(e.target.files[0])} />
        <div className={`style-picker__upload-icon${inspirationFile ? " style-picker__upload-icon--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 12V4M5 8l4-4 4 4" stroke={inspirationFile ? "#fff" : "var(--color-text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="12" height="2" rx="1" fill={inspirationFile ? "#fff" : "var(--color-border)"}/>
          </svg>
        </div>
        <div className="style-picker__upload-body">
          <div className={`style-picker__upload-title${inspirationFile ? " style-picker__upload-title--active" : ""}`}>
            {inspirationFile ? inspirationFile.name : "Upload inspiration from a brand you admire"}
          </div>
          <div className="style-picker__upload-hint">
            {inspirationFile ? `${(inspirationFile.size/1024).toFixed(1)} KB · Click to replace` : "Optional — JPG, PNG, PDF, SVG"}
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="style-picker__selection-bar">
          <div className="style-picker__selection-badge">
            {selected.length} / {MAX_SELECT} selected
          </div>
          {selected.length >= MAX_SELECT && <span className="style-picker__selection-max">Maximum reached</span>}
        </div>
      )}

      <div className="style-picker__grid">
        {loadingFirst
          ? [...Array(BATCH_SIZE)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: "4/3", borderRadius: "12px" }} />)
          : visiblePresets.map((s, i) => (
              <StyleCard key={s.id} label={s.label} sublabel={s.sublabel} selected={selected.includes(s.id)}
                onClick={() => toggleSelect(s.id)} index={i} dimmed={selected.length >= MAX_SELECT && !selected.includes(s.id)}>
                {s.preview("var(--color-accent)")}
              </StyleCard>
            ))
        }
        {loadingMore && [...Array(BATCH_SIZE)].map((_, i) => <div key={"m"+i} className="skeleton" style={{ aspectRatio: "4/3", borderRadius: "12px" }} />)}
      </div>

      {!loadingFirst && hasMore && (
        <div className="style-picker__load-more">
          <button
            onClick={() => {
              if (loadingMore) return
              setLoadingMore(true)
              setTimeout(() => {
                setVisibleCount(c => Math.min(c + BATCH_SIZE, STYLE_PRESETS.length))
                setLoadingMore(false)
              }, 800)
            }}
            className={`style-picker__load-more-btn${loadingMore ? " style-picker__load-more-btn--loading" : ""}`}
          >
            {loadingMore ? <><Spinner /> Loading...</> : <>Load more styles</>}
          </button>
        </div>
      )}

      <div className="style-picker__footer">
        <span className="style-picker__footer-label">
          {selected.length === 0 && !inspirationFile ? "Choose styles or upload inspiration" : `${selected.length} style${selected.length !== 1 ? "s" : ""} selected`}
        </span>
      </div>
    </div>
  )
}
