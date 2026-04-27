"use client"
import { useState, useEffect } from "react"
import { T } from "../tokens"
import ServiceCard from "../shared/ServiceCard"
import "./ServiceSelection.css"

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
      <div className="service-sel__header">
        <div className="service-sel__badge">
          <div className="service-sel__badge-dot" />
          <span className="service-sel__badge-label">Logo Services</span>
        </div>
        <h1 className="service-sel__title">
          What can we help you with?
        </h1>
        <p className="service-sel__subtitle">
          Choose how you&apos;d like to approach your logo project. Both options include the same care and attention.
        </p>
      </div>

      <div className="service-sel__cards">
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
