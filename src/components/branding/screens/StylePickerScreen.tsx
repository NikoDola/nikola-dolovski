"use client"
import { useState, useEffect } from "react"
import StyleCard from "../shared/StyleCard"
import BackButton from "../shared/BackButton"
import TextInput from "../shared/TextInput"
import { STYLE_PRESETS } from "../data"
import "./StylePickerScreen.css"

interface StyleInfo { styles: string[]; pinterestUrl: string }
interface Props { onBack: () => void; onNext: (info: StyleInfo) => void; submitRef?: { current: (() => void) | null } }

const MAX_SELECT = 6
const BATCH_SIZE = 6

const ALL_PRESETS = [
  ...STYLE_PRESETS,
  ...STYLE_PRESETS.map(p => ({ ...p, id: `${p.id}-2` })),
  ...STYLE_PRESETS.map(p => ({ ...p, id: `${p.id}-3` })),
]

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="20 14" opacity="0.6"/>
    </svg>
  )
}

export default function StylePickerScreen({ onBack, onNext, submitRef }: Props) {
  const [selected, setSelected]         = useState<string[]>([])
  const [pinterestUrl, setPinterestUrl] = useState("")
  const [loadingFirst, setLoadingFirst] = useState(true)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ styles: selected, pinterestUrl })
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

  const visiblePresets = ALL_PRESETS.slice(0, visibleCount)
  const hasMore = visibleCount < ALL_PRESETS.length

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

      <div className="style-picker__inspiration">
        <div className="style-picker__inspiration-pinterest">
          <div className="style-picker__inspiration-pinterest-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.27-1.95 3.27-4.76 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.69 2.22-4.69 4.51 0 .89.34 1.85.77 2.37.08.1.09.19.07.29-.08.32-.25 1.04-.28 1.18-.04.19-.14.23-.32.14-1.25-.58-2.03-2.42-2.03-3.89 0-3.15 2.29-6.05 6.6-6.05 3.46 0 6.15 2.47 6.15 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.96-.53-2.29-1.15l-.62 2.33c-.22.86-.83 1.94-1.24 2.59.94.29 1.93.45 2.96.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#E60023"/>
            </svg>
          </div>
          <div className="style-picker__inspiration-pinterest-body">
            <div className="style-picker__inspiration-pinterest-label">Share a Pinterest board</div>
            <div className="style-picker__inspiration-pinterest-hint">Paste the link to a board filled with brands, logos, or visuals that inspire you</div>
          </div>
        </div>
        <TextInput
          label=""
          placeholder="https://pinterest.com/yourboard/logo-inspiration"
          value={pinterestUrl}
          onChange={setPinterestUrl}
          hint="Optional"
        />
        <div className="style-picker__inspiration-divider">
          <span>or</span>
        </div>
        <div className="style-picker__inspiration-email">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="var(--color-text-muted)" strokeWidth="1.3"/>
            <path d="M1.5 6l6.5 4 6.5-4" stroke="var(--color-text-muted)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>
            You can also email logo or image references to{" "}
            <a href="mailto:nikodola@gmail.com" className="style-picker__inspiration-email-link">nikodola@gmail.com</a>
            {" "}— file uploads are disabled on this form for security reasons.
          </span>
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
                setVisibleCount(c => Math.min(c + BATCH_SIZE, ALL_PRESETS.length))
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
          {selected.length === 0 && !pinterestUrl ? "Choose styles or share your inspiration" : `${selected.length} style${selected.length !== 1 ? "s" : ""} selected`}
        </span>
      </div>
    </div>
  )
}
