"use client"
import { Fragment, useState, useEffect } from "react"
import "./ProgressBar.css"
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

  const circleClass = [
    "progress-step__circle",
    done    ? "progress-step__circle--done"    : "",
    active  ? "progress-step__circle--active"  : "",
    hovered === index ? "progress-step__circle--hovered" : "",
  ].filter(Boolean).join(" ")

  const numberClass = [
    "progress-step__number",
    done   ? "progress-step__number--done"   : "",
    active ? "progress-step__number--active" : "",
  ].filter(Boolean).join(" ")

  const labelClass = [
    "progress-step__label",
    active ? "progress-step__label--active" : "",
    done   ? "progress-step__label--done"   : "",
  ].filter(Boolean).join(" ")

  return (
    <div
      className={`progress-step${clickable ? " progress-step--clickable" : ""}`}
      onClick={clickable ? () => onStepClick!(index) : undefined}
      onMouseEnter={() => clickable && onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={circleClass}>
        <span className={numberClass}>{index + 1}</span>
      </div>
      <div className="progress-step__label-row">
        {done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="progress-step__check">
            <path d="M2 6l3 3 5-5" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span className={labelClass}>{label}</span>
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

    const navArrowClass = (show: boolean, active: boolean) => [
      "progress-nav-arrow",
      show && active ? "progress-nav-arrow--clickable" : "",
      !show          ? "progress-nav-arrow--hidden"    : "",
      show && !active? "progress-nav-arrow--disabled"  : "",
    ].filter(Boolean).join(" ")

    return (
      <div className="progress-bar--mobile">
        <span
          className={navArrowClass(hasPrev, true)}
          onClick={hasPrev ? () => onStepClick?.(prevIdx) : undefined}
        >&lt;</span>

        <div className="progress-bar__steps">
          {visible.map((i, vi) => (
            <Fragment key={i}>
              {vi > 0 && (
                <div className={`progress-connector${visible[vi - 1] < highWater ? " progress-connector--done" : ""}`} />
              )}
              <StepDot index={i} current={current} highWater={highWater} hovered={hovered} onStepClick={onStepClick} onHover={setHovered} label={steps[i]} />
            </Fragment>
          ))}
        </div>

        <span
          className={navArrowClass(hasNext, nextReady)}
          onClick={hasNext && nextReady ? () => onStepClick?.(nextIdx) : undefined}
        >&gt;</span>
      </div>
    )
  }

  return (
    <div className="progress-bar">
      {steps.map((label, i) => {
        const done      = i !== current && (i < current || i <= highWater)
        const active    = i === current
        const clickable = done && !!onStepClick

        return (
          <Fragment key={i}>
            <div
              className={`progress-step${clickable ? " progress-step--clickable" : ""}`}
              onClick={clickable ? () => onStepClick(i) : undefined}
              onMouseEnter={() => clickable && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={[
                "progress-step__circle",
                done   ? "progress-step__circle--done"    : "",
                active ? "progress-step__circle--active"  : "",
                hovered === i ? "progress-step__circle--hovered" : "",
              ].filter(Boolean).join(" ")}>
                <span className={[
                  "progress-step__number",
                  done   ? "progress-step__number--done"   : "",
                  active ? "progress-step__number--active" : "",
                ].filter(Boolean).join(" ")}>{i + 1}</span>
              </div>
              <div className="progress-step__label-row">
                {done && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="progress-step__check">
                    <path d="M2 6l3 3 5-5" stroke={T.color.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <span className={[
                  "progress-step__label",
                  active ? "progress-step__label--active" : "",
                  done   ? "progress-step__label--done"   : "",
                ].filter(Boolean).join(" ")}>{label}</span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`progress-connector progress-connector--desktop${i < highWater ? " progress-connector--done" : ""}`} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
