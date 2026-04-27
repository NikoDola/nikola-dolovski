"use client"
import { Fragment, useState } from "react"
import { T } from "../tokens"

interface ProgressBarProps {
  steps:        string[]
  current:      number
  onStepClick?: (index: number) => void
}

export default function ProgressBar({ steps, current, onStepClick }: ProgressBarProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: T.space["3"], width: "100%" }}>
      {steps.map((label, i) => {
        const done      = i < current
        const active    = i === current
        const clickable = done && !!onStepClick

        return (
          <Fragment key={i}>
            <div
              onClick={clickable ? () => onStepClick(i) : undefined}
              onMouseEnter={() => clickable && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: T.space["1"],
                cursor: clickable ? "pointer" : "default",
              }}
            >
              <div style={{
                width: "28px", height: "28px", borderRadius: T.radius.full,
                background: done ? T.color.accent : active ? T.color.accentLight : T.color.surfaceAlt,
                border: `2px solid ${done || active ? T.color.accent : T.color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: `all ${T.duration.normal} ${T.easing.smooth}`,
                transform: hovered === i ? "scale(1.15)" : "scale(1)",
                boxShadow: hovered === i ? `0 0 0 3px ${T.color.accentMuted}` : "none",
              }}>
                <span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: done ? T.color.textInverse : active ? T.color.accent : T.color.textMuted }}>{i + 1}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 6l3 3 5-5" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <span style={{
                  fontSize: T.fontSize.xs,
                  fontWeight: active ? T.fontWeight.semibold : T.fontWeight.regular,
                  color: active ? T.color.textPrimary : done ? T.color.accent : T.color.textMuted,
                  whiteSpace: "nowrap",
                  transition: `color ${T.duration.normal} ${T.easing.smooth}`,
                }}>{label}</span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: "2px", background: done ? T.color.accent : T.color.border, borderRadius: "1px", marginBottom: "18px", transition: `background ${T.duration.slow} ${T.easing.smooth}` }} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
