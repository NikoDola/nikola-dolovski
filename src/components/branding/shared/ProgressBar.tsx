"use client"
import { Fragment } from "react"
import { T } from "../tokens"

interface ProgressBarProps {
  steps:   string[]
  current: number
}

export default function ProgressBar({ steps, current }: ProgressBarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: T.space["3"], width: "100%" }}>
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: T.space["1"] }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: T.radius.full,
                background: done ? T.color.accent : active ? T.color.accentLight : T.color.surfaceAlt,
                border: `2px solid ${done || active ? T.color.accent : T.color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: `all ${T.duration.normal} ${T.easing.smooth}`,
              }}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={T.color.textInverse} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: active ? T.color.accent : T.color.textMuted }}>{i + 1}</span>
                }
              </div>
              <span style={{
                fontSize: T.fontSize.xs,
                fontWeight: active ? T.fontWeight.semibold : T.fontWeight.regular,
                color: active ? T.color.textPrimary : T.color.textMuted,
                whiteSpace: "nowrap",
              }}>{label}</span>
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
