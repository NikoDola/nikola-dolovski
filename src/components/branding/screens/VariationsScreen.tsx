"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"
import VariationCard from "../shared/VariationCard"
import BackButton from "../shared/BackButton"
import { VerticalLogoDemo, HorizontalLogoDemo, BadgeLogoDemo, IconOnlyDemo, WordmarkDemo } from "../demos/LogoDemos"

interface Props { onBack: () => void; onNext: (vars: string[]) => void; submitRef?: { current: (() => void) | null } }

const VARIATIONS = [
  { id: "vertical",   title: "Vertical",     slug: "vertical-logo",     description: "Icon stacked above the brand name. Ideal for social profiles and square formats.",      demo: <VerticalLogoDemo /> },
  { id: "horizontal", title: "Horizontal",   slug: "horizontal-logo",   description: "Icon beside the brand name. The most versatile format — great for headers and cards.",  demo: <HorizontalLogoDemo /> },
  { id: "badge",      title: "Badge / Seal", slug: "badge-seal-logo",   description: "Name wraps around the icon in a circular seal. Adds a premium, established feel.",       demo: <BadgeLogoDemo /> },
  { id: "icon",       title: "Icon Only",    slug: "icon-only-logo",    description: "Just the logomark, no text. Used as a standalone symbol across all touchpoints.",         demo: <IconOnlyDemo /> },
  { id: "wordmark",   title: "Wordmark",     slug: "wordmark-logo",     description: "Typography-only logo. The brand name itself becomes the visual identity.",               demo: <WordmarkDemo /> },
]

export default function VariationsScreen({ onBack, onNext, submitRef }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext(selected)
  })

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const extraCount  = Math.max(0, selected.length - 1)
  const extrasTotal = extraCount * 25

  const getPriceLabel = (id: string) => {
    if (selected.length === 0) return "Free"
    if (selected[0] === id)    return "Included"
    if (selected.includes(id)) return "+$25"
    return "+$25 ea."
  }

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["6"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Choose your logo variations
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          Your first variation is <strong>included free</strong>. Each additional format is <strong>+$25</strong>.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: T.space["4"], marginBottom: T.space["6"] }}>
        {VARIATIONS.map(v => {
          const label  = getPriceLabel(v.id)
          const isFree = label === "Free" || label === "Included"
          return (
            <div key={v.id} style={{ display: "flex", flexDirection: "column", gap: T.space["2"], position: "relative" }}>
              <div style={{ position: "absolute", top: T.space["3"], left: T.space["3"], zIndex: 2, background: isFree ? T.color.accent : T.color.surface, border: `1px solid ${isFree ? T.color.accent : T.color.border}`, color: isFree ? "#fff" : T.color.textSecondary, fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, borderRadius: T.radius.full, padding: `2px ${T.space["3"]}`, letterSpacing: T.letterSpacing.wide }}>{label}</div>
              <div style={{ flex: 1 }}>
                <VariationCard title={v.title} description={v.description} selected={selected.includes(v.id)} onClick={() => toggle(v.id)}>
                  {v.demo}
                </VariationCard>
              </div>
              <a href={`/blog/${v.slug}`} onClick={e => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: T.space["1"], fontSize: T.fontSize.xs, color: T.color.textMuted, textDecoration: "none", padding: `${T.space["1"]} ${T.space["2"]}`, transition: `color ${T.duration.normal} ${T.easing.smooth}` }}
                onMouseEnter={e => (e.currentTarget.style.color = T.color.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = T.color.textMuted)}
              >
                Read more
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          )
        })}
      </div>

      {selected.length > 1 && (
        <div style={{ background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.lg, padding: T.space["4"], marginBottom: T.space["6"], display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary }}>1 included + {extraCount} extra variation{extraCount > 1 ? "s" : ""}</span>
          <span style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.bold, color: T.color.accent }}>+${extrasTotal} added</span>
        </div>
      )}

    </div>
  )
}
