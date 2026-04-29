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
          description="Give your brand a fresh start, we'll refresh your existing logo while keeping the essence of what makes it yours."
          price="150"
          icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="2" width="32" height="32" rx="8" fill={T.color.accentLight} stroke={T.color.accentMuted} strokeWidth="1.5"/><path d="M26 18a8 8 0 1 1-2.34-5.66" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round"/><path d="M26 11v5.5h-5.5" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          selected={selected === "redesign"}
          onClick={() => setSelected("redesign")}
          badge="Upload your logo"
        />
      </div>

      <div className="hiw">
        
        <h2 className="hiw__title">How it Works</h2>
        <div className="hiw__eyebrow">Simple process. No risk. Clear pricing</div>
        <div className="hiw__grid">
          {[
            { n: 1, heading: "Fill out the order form",    body: "Choose logo design or redesign, and tell us about your brand, pick your style direction, color palette, and variations. The whole thing takes about 3 minutes." },
            { n: 2, heading: "Pay a 35% deposit",          body: "You only pay 35% upfront to get started. The remaining balance is due when your logo is ready for delivery." },
            { n: 3, heading: "We get to work",             body: "Your brief lands in our studio and we start designing. We study your brand, competitors, and target audience before touching the pen." },
            { n: 4, heading: "First draft delivery",       body: "You receive your first logo concept within 5 business days, delivered as a clean presentation with full context and reasoning." },
            { n: 5, heading: "Revisions",                  body: "Two rounds of revisions are included. You tell us what to tweak and we refine until it feels exactly right." },
            { n: 6, heading: "Final files and handoff",    body: "Once you approve, we deliver the full file package: SVG, PNG, and PDF in all the formats you need to go live." },
          ].map(step => (
            <div key={step.n} className="hiw__step">
              <div className="hiw__step-number">{step.n}</div>
              <div className="hiw__step-heading">{step.heading}</div>
              <div className="hiw__step-body">{step.body}</div>
            </div>
          ))}
        </div>
        <div className="hiw__note">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="hiw__note-icon"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        If it’s not hitting the mark after the included revisions, you’re free to cancel and only the deposit applies. Want to keep going? Extra revision rounds can be added for $15 each.
        </div>
      </div>

    </div>
  )
}
