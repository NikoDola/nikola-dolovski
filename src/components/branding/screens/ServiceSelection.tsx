"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"
import ServiceCard from "../shared/ServiceCard"

interface Props {
  onSelect: (type: "design" | "redesign") => void
  submitRef?: { current: (() => void) | null }
  setNextDisabled?: (v: boolean) => void
}

export default function ServiceSelection({ onSelect, submitRef, setNextDisabled }: Props) {
  const [selected, setSelected] = useState<"design" | "redesign" | null>(null)

  useEffect(() => {
    if (submitRef) submitRef.current = selected ? () => onSelect(selected) : null
    setNextDisabled?.(!selected)
  })

  return (
    <div className="screen-enter">
      <div style={{ marginBottom: T.space["10"] }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: T.space["2"], background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.full, padding: `${T.space["1"]} ${T.space["4"]}`, marginBottom: T.space["5"] }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.color.accent }} />
          <span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: T.color.accent, letterSpacing: T.letterSpacing.wider, textTransform: "uppercase" }}>Logo Services</span>
        </div>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          What can we help you with?
        </h1>
        <p style={{ fontSize: T.fontSize.md, color: T.color.textSecondary, lineHeight: T.lineHeight.normal, maxWidth: "480px" }}>
          Choose how you&apos;d like to approach your logo project. Both options include the same care and attention.
        </p>
      </div>

      <div style={{ display: "flex", gap: T.space["5"], marginBottom: T.space["10"] }}>
        <ServiceCard
          title="Logo Design"
          description="Start fresh. We'll craft a completely new logo identity tailored to your brand vision from the ground up."
          price="150"
          icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="2" width="32" height="32" rx="8" fill={T.color.accentLight} stroke={T.color.accentMuted} strokeWidth="1.5"/><path d="M18 9v18M9 18h18" stroke={T.color.accent} strokeWidth="2.5" strokeLinecap="round"/><circle cx="18" cy="18" r="4" fill={T.color.accent} opacity="0.3"/></svg>}
          selected={selected === "design"}
          onClick={() => setSelected("design")}
        />
        <ServiceCard
          title="Logo Redesign"
          description="Give your brand a fresh start — we'll refresh your existing logo while keeping the essence of what makes it yours."
          price="150"
          icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="2" width="32" height="32" rx="8" fill={T.color.accentLight} stroke={T.color.accentMuted} strokeWidth="1.5"/><path d="M26 18a8 8 0 1 1-2.34-5.66" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round"/><path d="M26 11v5.5h-5.5" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          selected={selected === "redesign"}
          onClick={() => setSelected("redesign")}
          badge="Upload your logo"
        />
      </div>

    </div>
  )
}
