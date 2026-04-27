"use client"
import { useState } from "react"
import { T } from "../tokens"

interface VariationCardProps {
  title:       string
  description: string
  selected:    boolean
  onClick:     () => void
  children:    React.ReactNode
}

export default function VariationCard({ title, description, selected, onClick, children }: VariationCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? T.color.accentLight : "#FFFFFF",
        border: `2px solid ${selected ? T.color.accent : hovered ? "#B9907B" : T.color.accentMuted}`,
        borderRadius: T.radius.xl, padding: T.space["6"], cursor: "pointer",
        transition: `all ${T.duration.normal} ${T.easing.smooth}`,
        boxShadow: T.shadow.xs, position: "relative",
        display: "flex", flexDirection: "column", gap: T.space["5"],
      }}
    >
      {selected && (
        <div style={{ position: "absolute", top: T.space["4"], right: T.space["4"], width: "22px", height: "22px", borderRadius: T.radius.full, background: T.color.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      <div style={{ background: T.color.surfaceAlt, borderRadius: T.radius.md, padding: T.space["6"], minHeight: "130px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
      <div>
        <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["1"] }}>{title}</div>
        <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>{description}</div>
      </div>
    </div>
  )
}
