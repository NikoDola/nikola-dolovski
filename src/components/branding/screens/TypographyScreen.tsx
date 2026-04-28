"use client"
import { useState, useEffect } from "react"
import TextInput from "../shared/TextInput"
import BackButton from "../shared/BackButton"
import { FONT_CATEGORIES } from "../data"
import type { FontDef, ServiceType } from "../types"
import "./TypographyScreen.css"

interface FontAsset extends FontDef { category: string; embedParam: string }

interface TypoInfo { typographyType: "custom"|"free"|null; customPrice: number; selectedFonts: string[]; sameBrandFont: boolean; fontLinks: string[] }
interface Props { onBack: () => void; onNext: (info: TypoInfo) => void; onChange?: (typographyType: "custom" | "free", customPrice: number) => void; serviceType: ServiceType; selectedVariations: string[]; submitRef?: { current: (() => void) | null } }

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

export default function TypographyScreen({ onBack, onNext, onChange, serviceType, selectedVariations, submitRef }: Props) {
  const MAX_FONTS = 10
  const BATCH = 9
  const [sameBrandFont, setSameBrand]       = useState(false)
  const [fontLinks, setFontLinks]           = useState<string[]>([""])
  const [typographyType, setTypoType]       = useState<"custom"|"free">("free")
  const [selectedFonts, setSelectedFonts]   = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("serif")
  const [visibleCount, setVisible]          = useState(BATCH)
  const [loadingMore, setLoadingMore]       = useState(false)
  const [fontAssets, setFontAssets]         = useState<FontAsset[]>([])

  const isWordmark  = selectedVariations.includes("wordmark") && selectedVariations.length === 1
  const isRedesign  = serviceType === "redesign"
  const customPrice = isWordmark ? 0 : 100

  const assetCategories: Record<string, { label: string; fonts: FontDef[] }> = fontAssets.length > 0
    ? fontAssets.reduce<Record<string, { label: string; fonts: FontDef[] }>>((acc, f) => {
        const cat = f.category || "sans"
        if (!acc[cat]) acc[cat] = { label: cat === "serif" ? "Serif" : cat === "handwriting" ? "Handwriting" : "Sans-Serif", fonts: [] }
        acc[cat].fonts.push(f)
        return acc
      }, {})
    : FONT_CATEGORIES

  const currentFonts = activeCategory !== "designer" ? (assetCategories[activeCategory]?.fonts ?? []) : []
  const visibleFonts = currentFonts.slice(0, visibleCount)
  const hasMore = visibleCount < currentFonts.length

  useEffect(() => {
    fetch("/company-assets/fonts.json")
      .then(r => r.json())
      .then((data: FontAsset[]) => {
        if (!data || data.length === 0) return
        setFontAssets(data)
        const url = "https://fonts.googleapis.com/css2?" + data.map(f => `family=${f.embedParam}`).join("&") + "&display=swap"
        const existing = document.getElementById("typo-gfonts")
        if (!existing) {
          const link = document.createElement("link")
          link.id = "typo-gfonts"
          link.rel = "stylesheet"
          link.href = url
          document.head.appendChild(link)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { setVisible(BATCH) }, [activeCategory])

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ typographyType, customPrice, selectedFonts, sameBrandFont, fontLinks: fontLinks.filter(l => l.trim()) })
  })

  const toggleFont = (id: string) => setSelectedFonts(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= MAX_FONTS ? prev : [...prev, id])

  const updateLink = (i: number, val: string) => setFontLinks(prev => prev.map((l, j) => j === i ? val : l))
  const addLink    = () => setFontLinks(prev => [...prev, ""])
  const removeLink = (i: number) => setFontLinks(prev => prev.filter((_, j) => j !== i))

  const TYPE_OPTIONS = [
    { id: "custom" as const, label: "Custom Typography", sublabel: isWordmark ? "Included with your Wordmark logo" : "Professional custom lettering", price: customPrice },
    { id: "free"   as const, label: "Free Font",         sublabel: "Browse and pick from our curated font library",                                   price: 0 },
  ]

  const FONT_TABS = [
    ...Object.entries(assetCategories).map(([key, cat]) => ({ key, label: cat.label })),
    { key: "designer", label: "Designer's Choice" },
  ]

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
        </div>
      )}

      <div className="typography__type-section">
        <div className="typography__type-label">Typography type</div>
        <div className="typography__type-options">
          {TYPE_OPTIONS.map(opt => {
            const sel = typographyType === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => { setTypoType(opt.id); onChange?.(opt.id, customPrice) }}
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

      <div className="typography__font-links">
        <div className="typography__font-links-label">
          Link your fonts <span className="typography__upload-label-opt">Optional</span>
        </div>
        <div className="typography__font-links-hint">
          Have a font you love? Paste the link and we&apos;ll use it as a reference — Google Fonts, Adobe Fonts, or anywhere else.
        </div>
        <div className="typography__font-links-list">
          {fontLinks.map((link, i) => (
            <div key={i} className="typography__font-link-row">
              <TextInput
                label=""
                placeholder="https://fonts.google.com/specimen/Inter"
                value={link}
                onChange={val => updateLink(i, val)}
              />
              {fontLinks.length > 1 && (
                <button onClick={() => removeLink(i)} className="typography__font-link-remove" aria-label="Remove link">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addLink} className="typography__font-link-add">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Add another font link
        </button>
      </div>

      <div className="typography__browse-section">
        <div className="typography__browse-label">
          Browse type styles <span className="typography__browse-label-opt">Optional</span>
        </div>
        <div className="typography__tabs">
          {FONT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`typography__tab${activeCategory === tab.key ? " typography__tab--active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeCategory === "designer" ? (
          <div className="typography__designer-message">
            <div className="typography__designer-message-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4l2.2 6.7H23l-5.6 4.1 2.1 6.6L14 17.3l-5.5 4.1 2.1-6.6L5 10.7h6.8L14 4z" fill="var(--color-accent)" opacity="0.25"/>
                <path d="M14 6l1.8 5.5H22l-5 3.6 1.9 5.8L14 17l-4.9 3.9 1.9-5.8-5-3.6h6.2L14 6z" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="typography__designer-message-body">
              <div className="typography__designer-message-title">Let us select the perfect typeface for your brand</div>
              <p className="typography__designer-message-text">
                No input needed. Our designer will study your brand, style direction, and audience to choose the typeface that fits best — just trust the process.
              </p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

    </div>
  )
}
