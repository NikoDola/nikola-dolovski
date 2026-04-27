"use client"
import { useState, useRef, useEffect } from "react"
import { T } from "../tokens"
import TextInput from "../shared/TextInput"
import BackButton from "../shared/BackButton"
import Button from "../shared/Button"
import { FONT_CATEGORIES } from "../data"
import type { FontDef, ServiceType } from "../types"

interface TypoInfo { typographyType: "custom"|"free"|null; customPrice: number; selectedFonts: string[]; sameBrandFont: boolean; uploadedFont: File|null; fontName: string }
interface Props { onBack: () => void; onNext: (info: TypoInfo) => void; serviceType: ServiceType; selectedVariations: string[] }

function FontCard({ font, selected, onClick, index, dimmed }: { font: FontDef; selected: boolean; onClick: () => void; index: number; dimmed?: boolean }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), index * 60); return () => clearTimeout(t) }, [index])
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: selected ? T.color.accentLight : T.color.surface, border: `2px solid ${selected ? T.color.accent : hovered ? T.color.accentMuted : T.color.border}`, borderRadius: T.radius.lg, padding: T.space["5"], cursor: dimmed ? "not-allowed" : "pointer", transition: "all 200ms ease", position: "relative", opacity: !visible ? 0 : dimmed ? 0.35 : 1, transform: visible ? "translateY(0)" : "translateY(8px)" }}>
      {selected && <div style={{ position: "absolute", top: T.space["3"], right: T.space["3"], width: "20px", height: "20px", borderRadius: "50%", background: T.color.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
      <div style={{ fontFamily: font.family, fontWeight: font.weight, fontSize: "22px", color: T.color.textPrimary, lineHeight: 1.2, marginBottom: T.space["2"] }}>{font.name}</div>
      <div style={{ fontFamily: font.family, fontWeight: 400, fontSize: "13px", color: T.color.textSecondary, fontStyle: "italic", marginBottom: T.space["3"] }}>{font.sample}</div>
      {font.sublabel && <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, background: T.color.surfaceAlt, borderRadius: T.radius.sm, padding: `2px ${T.space["2"]}`, display: "inline-block" }}>{font.sublabel}</div>}
    </div>
  )
}

export default function TypographyScreen({ onBack, onNext, serviceType, selectedVariations }: Props) {
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
  const canProceed  = typographyType !== null || sameBrandFont

  const currentFonts = FONT_CATEGORIES[activeCategory].fonts
  const visibleFonts = currentFonts.slice(0, visibleCount)
  const hasMore = visibleCount < currentFonts.length

  useEffect(() => { setVisible(BATCH) }, [activeCategory])

  const toggleFont = (id: string) => setSelectedFonts(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= MAX_FONTS ? prev : [...prev, id])

  const handleNext = () => {
    if (!canProceed) return
    onNext({ typographyType, customPrice, selectedFonts, sameBrandFont, uploadedFont, fontName })
  }

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>Typography</h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>Choose the type style for your logo.</p>
      </div>

      {isRedesign && (
        <div style={{ marginBottom: T.space["5"] }}>
          <div onClick={() => setSameBrand(v => !v)} style={{ display: "flex", alignItems: "center", gap: T.space["4"], background: sameBrandFont ? T.color.accentLight : T.color.surface, border: `1.5px solid ${sameBrandFont ? T.color.accent : T.color.border}`, borderRadius: T.radius.lg, padding: T.space["5"], cursor: "pointer", transition: "all 180ms ease" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: T.radius.full, border: `2px solid ${sameBrandFont ? T.color.accent : T.color.border}`, background: sameBrandFont ? T.color.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 180ms ease" }}>
              {sameBrandFont && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: sameBrandFont ? T.color.accent : T.color.textPrimary }}>Use the same font as my current brand</div>
              <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: "2px" }}>We'll carry over your existing typeface into the refreshed logo</div>
            </div>
          </div>
          {sameBrandFont && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.space["4"], padding: `${T.space["4"]} ${T.space["5"]}`, background: T.color.surfaceAlt, borderRadius: T.radius.lg, border: `1px solid ${T.color.border}`, marginTop: T.space["3"] }}>
              <div>
                <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["2"] }}>Upload font file <span style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, fontWeight: 400 }}>Optional</span></div>
                <div onClick={() => fontInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: T.space["3"], background: T.color.surface, border: `1.5px dashed ${uploadedFont ? T.color.accent : T.color.border}`, borderRadius: T.radius.md, padding: T.space["3"], cursor: "pointer" }}>
                  <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: "none" }} onChange={e => e.target.files?.[0] && setUploadFont(e.target.files[0])} />
                  <span style={{ fontSize: T.fontSize.xs, color: uploadedFont ? T.color.accent : T.color.textMuted }}>{uploadedFont ? uploadedFont.name : "TTF, OTF, WOFF"}</span>
                </div>
              </div>
              <TextInput label="Font Name" placeholder="e.g. Helvetica Neue" value={fontName} onChange={setFontName} hint="Optional" />
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: T.space["6"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>Typography type</div>
        <div style={{ display: "flex", gap: T.space["3"] }}>
          {[{ id: "custom" as const, label: "Custom Typography", sublabel: isWordmark ? "Included with your Wordmark logo" : "Professional custom lettering", price: customPrice }, { id: "free" as const, label: "Free Font", sublabel: "Curated from our free font library", price: 0 }].map(opt => {
            const sel = typographyType === opt.id
            return (
              <div key={opt.id} onClick={() => setTypoType(opt.id)} style={{ flex: 1, padding: T.space["5"], borderRadius: T.radius.lg, border: `2px solid ${sel ? T.color.accent : T.color.border}`, background: sel ? T.color.accentLight : T.color.surface, cursor: "pointer", transition: "all 180ms ease", position: "relative" }}>
                {opt.id === "custom" && customPrice === 0 && <div style={{ position: "absolute", top: "-10px", left: T.space["4"], background: T.color.accent, color: "#fff", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, borderRadius: T.radius.full, padding: `2px ${T.space["3"]}` }}>INCLUDED</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: T.space["2"] }}>
                  <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: sel ? T.color.accent : T.color.textPrimary }}>{opt.label}</div>
                  <div style={{ fontSize: T.fontSize.lg, fontWeight: T.fontWeight.bold, color: sel ? T.color.accent : T.color.textPrimary }}>{opt.price === 0 ? "Free" : `+$${opt.price}`}</div>
                </div>
                <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary }}>{opt.sublabel}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: T.space["4"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>Browse type styles <span style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, fontWeight: 400 }}>Optional</span></div>
        <div style={{ display: "flex", gap: T.space["2"], padding: "4px", background: T.color.surfaceAlt, borderRadius: T.radius.full, width: "fit-content", marginBottom: T.space["4"] }}>
          {Object.entries(FONT_CATEGORIES).map(([key, cat]) => (
            <button key={key} onClick={() => setActiveCategory(key)} style={{ padding: `${T.space["2"]} ${T.space["5"]}`, borderRadius: T.radius.full, border: "none", cursor: "pointer", fontFamily: T.font.sans, fontSize: T.fontSize.sm, fontWeight: T.fontWeight.medium, transition: "all 180ms ease", background: activeCategory === key ? T.color.surface : "transparent", color: activeCategory === key ? T.color.textPrimary : T.color.textMuted, boxShadow: activeCategory === key ? T.shadow.xs : "none" }}>
              {cat.label}
            </button>
          ))}
        </div>
        {selectedFonts.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: T.space["3"], marginBottom: T.space["3"] }}>
            <div style={{ background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.full, padding: `${T.space["1"]} ${T.space["4"]}`, fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.accent }}>{selectedFonts.length} / {MAX_FONTS} selected</div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: T.space["4"], marginBottom: T.space["4"] }}>
          {visibleFonts.map((font, i) => (
            <FontCard key={font.id} font={font} selected={selectedFonts.includes(font.id)} onClick={() => toggleFont(font.id)} index={i} dimmed={selectedFonts.length >= MAX_FONTS && !selectedFonts.includes(font.id)} />
          ))}
          {loadingMore && [...Array(BATCH)].map((_,i) => <div key={"sk"+i} className="skeleton" style={{ height: "120px", borderRadius: "12px" }} />)}
        </div>
        {hasMore && !loadingMore && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: T.space["6"] }}>
            <button onClick={() => { setLoadingMore(true); setTimeout(() => { setVisible(v => Math.min(v + BATCH, currentFonts.length)); setLoadingMore(false) }, 700) }} style={{ display: "inline-flex", alignItems: "center", gap: T.space["2"], background: T.color.surface, border: `1.5px solid ${T.color.border}`, borderRadius: T.radius.full, padding: `${T.space["3"]} ${T.space["6"]}`, fontSize: T.fontSize.sm, fontWeight: T.fontWeight.medium, color: T.color.textSecondary, fontFamily: T.font.sans, cursor: "pointer" }}>Load more fonts</button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleNext} disabled={!canProceed} size="lg"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
          Next — Colors
        </Button>
      </div>
    </div>
  )
}
