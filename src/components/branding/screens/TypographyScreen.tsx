"use client"
import { useState, useRef, useEffect } from "react"
import TextInput from "../shared/TextInput"
import BackButton from "../shared/BackButton"
import { FONT_CATEGORIES } from "../data"
import type { FontDef, ServiceType } from "../types"
import "./TypographyScreen.css"

interface TypoInfo { typographyType: "custom"|"free"|null; customPrice: number; selectedFonts: string[]; sameBrandFont: boolean; uploadedFont: File|null; fontName: string }
interface Props { onBack: () => void; onNext: (info: TypoInfo) => void; serviceType: ServiceType; selectedVariations: string[]; submitRef?: { current: (() => void) | null } }

function FontCard({ font, selected, onClick, index, dimmed }: { font: FontDef; selected: boolean; onClick: () => void; index: number; dimmed?: boolean }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), index * 60); return () => clearTimeout(t) }, [index])
  return (
    <div
      onClick={onClick}
      className={`font-card${visible ? " font-card--visible" : ""}${selected ? " font-card--selected" : ""}${dimmed ? " font-card--dimmed" : ""}`}
    >
      {selected && (
        <div className="font-card__check">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      <div style={{ fontFamily: font.family, fontWeight: font.weight, fontSize: "22px", color: "var(--color-text-primary)", lineHeight: 1.2, marginBottom: "var(--space-2)" }}>{font.name}</div>
      <div style={{ fontFamily: font.family, fontWeight: 400, fontSize: "13px", color: "var(--color-text-secondary)", fontStyle: "italic", marginBottom: "var(--space-3)" }}>{font.sample}</div>
      {font.sublabel && <div className="font-card__sublabel">{font.sublabel}</div>}
    </div>
  )
}

export default function TypographyScreen({ onBack, onNext, serviceType, selectedVariations, submitRef }: Props) {
  const MAX_FONTS = 10
  const BATCH = 9
  const [sameBrandFont, setSameBrand]   = useState(false)
  const [uploadedFont, setUploadFont]   = useState<File|null>(null)
  const [fontName, setFontName]         = useState("")
  const [typographyType, setTypoType]   = useState<"custom"|"free"|null>(null)
  const [selectedFonts, setSelectedFonts] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("serif")
  const [visibleCount, setVisible]      = useState(BATCH)
  const [loadingMore, setLoadingMore]   = useState(false)
  const fontInputRef = useRef<HTMLInputElement>(null)

  const isWordmark  = selectedVariations.includes("wordmark") && selectedVariations.length === 1
  const isRedesign  = serviceType === "redesign"
  const customPrice = isWordmark ? 0 : 100
  const currentFonts = FONT_CATEGORIES[activeCategory].fonts
  const visibleFonts = currentFonts.slice(0, visibleCount)
  const hasMore = visibleCount < currentFonts.length

  useEffect(() => { setVisible(BATCH) }, [activeCategory])

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ typographyType, customPrice, selectedFonts, sameBrandFont, uploadedFont, fontName })
  })

  const toggleFont = (id: string) => setSelectedFonts(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= MAX_FONTS ? prev : [...prev, id])

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div className="typography__header">
        <h1 className="typography__title">Typography</h1>
        <p className="typography__subtitle">Choose the type style for your logo.</p>
      </div>

      {isRedesign && (
        <div className="typography__same-brand">
          <div
            onClick={() => setSameBrand(v => !v)}
            className={`typography__same-brand-toggle${sameBrandFont ? " typography__same-brand-toggle--active" : ""}`}
          >
            <div className={`typography__same-brand-radio${sameBrandFont ? " typography__same-brand-radio--active" : ""}`}>
              {sameBrandFont && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <div className={`typography__same-brand-label${sameBrandFont ? " typography__same-brand-label--active" : ""}`}>Use the same font as my current brand</div>
              <div className="typography__same-brand-hint">We&apos;ll carry over your existing typeface into the refreshed logo</div>
            </div>
          </div>
          {sameBrandFont && (
            <div className="typography__font-upload-grid">
              <div>
                <div className="typography__upload-label">
                  Upload font file <span className="typography__upload-label-opt">Optional</span>
                </div>
                <div
                  onClick={() => fontInputRef.current?.click()}
                  className={`typography__upload-dropzone${uploadedFont ? " typography__upload-dropzone--active" : ""}`}
                >
                  <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: "none" }} onChange={e => e.target.files?.[0] && setUploadFont(e.target.files[0])} />
                  <span className={`typography__upload-filename${uploadedFont ? " typography__upload-filename--active" : ""}`}>
                    {uploadedFont ? uploadedFont.name : "TTF, OTF, WOFF"}
                  </span>
                </div>
              </div>
              <TextInput label="Font Name" placeholder="e.g. Helvetica Neue" value={fontName} onChange={setFontName} hint="Optional" />
            </div>
          )}
        </div>
      )}

      <div className="typography__type-section">
        <div className="typography__type-label">Typography type</div>
        <div className="typography__type-options">
          {[
            { id: "custom" as const, label: "Custom Typography", sublabel: isWordmark ? "Included with your Wordmark logo" : "Professional custom lettering", price: customPrice },
            { id: "free" as const, label: "Free Font", sublabel: "Curated from our free font library", price: 0 }
          ].map(opt => {
            const sel = typographyType === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => setTypoType(opt.id)}
                className={`typography__type-option${sel ? " typography__type-option--selected" : ""}`}
              >
                {opt.id === "custom" && customPrice === 0 && (
                  <div className="typography__type-badge">INCLUDED</div>
                )}
                <div className="typography__type-option-header">
                  <div className={`typography__type-option-name${sel ? " typography__type-option-name--selected" : ""}`}>{opt.label}</div>
                  <div className={`typography__type-option-price${sel ? " typography__type-option-price--selected" : ""}`}>{opt.price === 0 ? "Free" : `+$${opt.price}`}</div>
                </div>
                <div className="typography__type-option-sublabel">{opt.sublabel}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="typography__browse-section">
        <div className="typography__browse-label">
          Browse type styles <span className="typography__browse-label-opt">Optional</span>
        </div>
        <div className="typography__tabs">
          {Object.entries(FONT_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`typography__tab${activeCategory === key ? " typography__tab--active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {selectedFonts.length > 0 && (
          <div className="typography__selection-bar">
            <div className="typography__selection-badge">{selectedFonts.length} / {MAX_FONTS} selected</div>
          </div>
        )}
        <div className="typography__font-grid">
          {visibleFonts.map((font, i) => (
            <FontCard key={font.id} font={font} selected={selectedFonts.includes(font.id)} onClick={() => toggleFont(font.id)} index={i} dimmed={selectedFonts.length >= MAX_FONTS && !selectedFonts.includes(font.id)} />
          ))}
          {loadingMore && [...Array(BATCH)].map((_,i) => <div key={"sk"+i} className="skeleton" style={{ height: "120px", borderRadius: "12px" }} />)}
        </div>
        {hasMore && !loadingMore && (
          <div className="typography__load-more">
            <button
              onClick={() => {
                setLoadingMore(true)
                setTimeout(() => {
                  setVisible(v => Math.min(v + BATCH, currentFonts.length))
                  setLoadingMore(false)
                }, 700)
              }}
              className="typography__load-more-btn"
            >
              Load more fonts
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
