"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"

interface StyleCardProps {
  label:    string
  sublabel?: string
  selected: boolean
  onClick:  () => void
  children: React.ReactNode
  index:    number
  dimmed?:  boolean
}

export default function StyleCard({ label, sublabel, selected, onClick, children, index, dimmed }: StyleCardProps) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? T.color.accentLight : T.color.surface,
        border: `2px solid ${selected ? T.color.accent : hovered ? T.color.accentMuted : T.color.border}`,
        borderRadius: T.radius.lg, cursor: dimmed ? "not-allowed" : "pointer",
        transition: "all 200ms cubic-bezier(0,0,0.2,1), opacity 300ms ease, transform 300ms ease",
        boxShadow: selected ? T.shadow.md : hovered ? T.shadow.sm : T.shadow.xs,
        overflow: "hidden", position: "relative",
        opacity: !visible ? 0 : dimmed ? 0.4 : 1,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {selected && (
        <div style={{ position: "absolute", top: T.space["2"], right: T.space["2"], width: "20px", height: "20px", borderRadius: T.radius.full, background: T.color.accent, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      <div style={{ aspectRatio: "4/3", background: T.color.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {children}
      </div>
      <div style={{ padding: `${T.space["3"]} ${T.space["4"]}` }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary }}>{label}</div>
        {sublabel && <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: "2px" }}>{sublabel}</div>}
      </div>
    </div>
  )
}
