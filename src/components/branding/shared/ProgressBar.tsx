"use client"
import { Fragment, useState, useEffect } from "react"
import { T } from "../tokens"

interface ProgressBarProps {
  steps:        string[]
  current:      number
  maxReached?:  number
  onStepClick?: (index: number) => void
}

function StepDot({ index, current, highWater, hovered, onStepClick, onHover, label }: {
  index: number; current: number; highWater: number; hovered: number | null
  onStepClick?: (i: number) => void; onHover: (i: number | null) => void; label: string
}) {
  const done      = index !== current && (index < current || index <= highWater)
  const active    = index === current
  const clickable = done && !!onStepClick

  return (
    <div
      onClick={clickable ? () => onStepClick!(index) : undefined}
      onMouseEnter={() => clickable && onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: T.space["1"], cursor: clickable ? "pointer" : "default" }}
    >
      <div style={{
        width: "28px", height: "28px", borderRadius: T.radius.full,
        background: done ? T.color.accent : active ? T.color.accentLight : T.color.surfaceAlt,
        border: `2px solid ${done || active ? T.color.accent : T.color.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: `all ${T.duration.normal} ${T.easing.smooth}`,
        transform: hovered === index ? "scale(1.15)" : "scale(1)",
        boxShadow: hovered === index ? `0 0 0 3px ${T.color.accentMuted}` : "none",
      }}>
        <span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semibold, color: done ? T.color.textInverse : active ? T.color.accent : T.color.textMuted }}>{index + 1}</span>
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
  )
}

export default function ProgressBar({ steps, current, maxReached, onStepClick }: ProgressBarProps) {
  const [hovered, setHovered]   = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const highWater = maxReached ?? current

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (isMobile) {
    const prevIdx   = current - 1
    const nextIdx   = current + 1
    const hasPrev   = prevIdx >= 0
    const hasNext   = nextIdx < steps.length
    const nextReady = hasNext && nextIdx <= highWater

    const visible: number[] = []
    if (hasPrev) visible.push(prevIdx)
    visible.push(current)
    if (hasNext) visible.push(nextIdx)

    const navText = (label: string, show: boolean, active: boolean, onClick: () => void) => (
      <span
        onClick={show && active ? onClick : undefined}
        style={{
          fontSize: T.fontSize.xs,
          fontWeight: T.fontWeight.semibold,
          color: T.color.textMuted,
          cursor: show && active ? "pointer" : "default",
          opacity: !show ? 0 : active ? 1 : 0.3,
          flexShrink: 0,
          userSelect: "none",
          marginTop: "6px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    )

    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: T.space["3"], width: "100%" }}>
        {navText("<", hasPrev, true, () => onStepClick?.(prevIdx))}

        <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
          {visible.map((i, vi) => (
            <Fragment key={i}>
              {vi > 0 && (
                <div style={{
                  flex: 1, height: "2px", marginTop: "13px",
                  background: visible[vi - 1] < highWater ? T.color.accent : T.color.border,
                  borderRadius: "1px",
                  transition: `background ${T.duration.slow} ${T.easing.smooth}`,
                }} />
              )}
              <StepDot index={i} current={current} highWater={highWater} hovered={hovered} onStepClick={onStepClick} onHover={setHovered} label={steps[i]} />
            </Fragment>
          ))}
        </div>

        {navText(">", hasNext, nextReady, () => onStepClick?.(nextIdx))}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: T.space["3"], width: "100%" }}>
      {steps.map((label, i) => {
        const done      = i !== current && (i < current || i <= highWater)
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
              <div style={{ flex: 1, height: "2px", background: i < highWater ? T.color.accent : T.color.border, borderRadius: "1px", marginBottom: "18px", transition: `background ${T.duration.slow} ${T.easing.smooth}` }} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
