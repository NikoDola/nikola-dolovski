"use client"
import { useState } from "react"
import { T } from "../tokens"

interface ServiceCardProps {
  title:       string
  description: string
  price:       string
  icon:        React.ReactNode
  selected:    boolean
  onClick:     () => void
  badge?:      string
}

export default function ServiceCard({ title, description, price, icon, selected, onClick, badge }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? T.color.accentLight : T.color.surface,
        border: `2px solid ${selected ? T.color.accent : hovered ? T.color.accentMuted : T.color.border}`,
        borderRadius: T.radius.xl, padding: T.space["8"], cursor: "pointer",
        transition: `all ${T.duration.normal} ${T.easing.smooth}`,
        boxShadow: selected ? T.shadow.md : hovered ? T.shadow.sm : T.shadow.xs,
        transform: hovered && !selected ? "translateY(-2px)" : "none",
        position: "relative", flex: 1,
      }}
    >
      {selected && (
        <div style={{ position: "absolute", top: T.space["4"], right: T.space["4"], width: "22px", height: "22px", borderRadius: T.radius.full, background: T.color.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      {badge && (
        <div style={{ position: "absolute", top: "-10px", left: T.space["6"], background: T.color.accent, color: "#fff", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, padding: `3px 10px`, borderRadius: T.radius.full, letterSpacing: T.letterSpacing.wide }}>{badge}</div>
      )}
      <div style={{ fontSize: "36px", marginBottom: T.space["4"] }}>{icon}</div>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["2"] }}>{title}</div>
      <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal, marginBottom: T.space["6"] }}>{description}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: T.space["1"] }}>
        <span style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: selected ? T.color.accent : T.color.textPrimary }}>${price}</span>
        <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>flat rate</span>
      </div>
    </div>
  )
}
