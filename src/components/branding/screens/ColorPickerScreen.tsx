"use client"
import { useState, useRef, useEffect } from "react"
import BackButton from "../shared/BackButton"
import { COLOR_FAMILIES } from "../data"
import { hsvToHex, hexToHsv } from "../utils"
import type { ServiceType } from "../types"
import Button from "../shared/Button"
import "./ColorPickerScreen.css"

interface ColorInfo { colorFamilies: string[]; customColors: string[]; useSameColors: boolean }
interface Props { onBack: () => void; onNext: (info: ColorInfo) => void; serviceType: ServiceType; submitRef?: { current: (() => void) | null } }

function ColorPickerModal({ onAdd, onClose }: { onAdd: (hex: string) => void; onClose: () => void }) {
  const [hue, setHue] = useState(210)
  const [sat, setSat] = useState(80)
  const [val, setVal] = useState(90)
  const [hexIn, setHexIn] = useState("")
  const [hexErr, setHexErr] = useState("")
  const squareRef = useRef<HTMLDivElement>(null)
  const hueRef    = useRef<HTMLDivElement>(null)
  const popupRef  = useRef<HTMLDivElement>(null)
  const dragging  = useRef<string | null>(null)
  const currentHex = hsvToHex(hue, sat, val)

  useEffect(() => { setHexIn(hsvToHex(hue, sat, val).slice(1)) }, [hue, sat, val])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    const onOut = (e: MouseEvent) => { if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose() }
    window.addEventListener("keydown", onKey); document.addEventListener("mousedown", onOut)
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onOut) }
  }, [onClose])
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !squareRef.current || !hueRef.current) return
      if (dragging.current === "square") { const r = squareRef.current.getBoundingClientRect(); setSat(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100)); setVal(Math.round(Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)) * 100)) }
      else { const r = hueRef.current.getBoundingClientRect(); setHue(Math.round(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * 360)) }
    }
    const onUp = () => { dragging.current = null }
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [])

  const handleAdd = () => { if (hexIn.length !== 6) { setHexErr("Complete the hex code"); return }; onAdd(currentHex) }
  const hueColor = `hsl(${hue}, 100%, 50%)`

  return (
    <div ref={popupRef} className="color-picker__modal">
      <div className="color-picker__modal-header">
        <span className="color-picker__modal-title">Select a color</span>
        <button onClick={onClose} className="color-picker__modal-close">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="color-picker__modal-pickers">
        <div
          ref={squareRef}
          onMouseDown={e => {
            dragging.current = "square"
            if (squareRef.current) {
              const r = squareRef.current.getBoundingClientRect()
              setSat(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100))
              setVal(Math.round(Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)) * 100))
            }
          }}
          className="color-picker__square"
          style={{ background: hueColor, boxShadow: `inset 0 0 0 1px var(--color-border)` }}
        >
          <div className="color-picker__square-white" />
          <div className="color-picker__square-black" />
          <div
            className="color-picker__square-cursor"
            style={{ left: `${sat}%`, top: `${100 - val}%`, background: currentHex }}
          />
        </div>
        <div className="color-picker__hue-track">
          <div
            ref={hueRef}
            onMouseDown={e => {
              dragging.current = "hue"
              if (hueRef.current) {
                const r = hueRef.current.getBoundingClientRect()
                setHue(Math.round(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * 360))
              }
            }}
            className="color-picker__hue-bar"
          />
          <div className="color-picker__hue-thumb" style={{ top: `${(hue / 360) * 100}%` }} />
        </div>
      </div>
      <div className="color-picker__hex-row">
        <div className="color-picker__hex-preview" style={{ background: currentHex }} />
        <div className={`color-picker__hex-input-wrap${hexErr ? " color-picker__hex-input-wrap--error" : ""}`}>
          <span className="color-picker__hex-hash">#</span>
          <input
            value={hexIn}
            onChange={e => {
              const v = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6)
              setHexIn(v)
              setHexErr("")
              if (v.length === 6) { const h = hexToHsv("#" + v); if (h) { setHue(h.h); setSat(h.s); setVal(h.v) } }
            }}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") onClose() }}
            placeholder="D97757"
            className="color-picker__hex-input"
          />
        </div>
        <Button onClick={handleAdd} size="sm">Add</Button>
      </div>
      {hexErr && <div className="color-picker__hex-error">{hexErr}</div>}
    </div>
  )
}

export default function ColorPickerScreen({ onBack, onNext, serviceType, submitRef }: Props) {
  const MAX_COLORS = 5
  const [selected, setSelected]     = useState<string[]>([])
  const [useSameColors, setUseSame] = useState(false)
  const [customColors, setCustom]   = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= MAX_COLORS ? prev : [...prev, id])

  useEffect(() => {
    if (submitRef) submitRef.current = () => onNext({ colorFamilies: selected, customColors, useSameColors })
  })

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div className="color-picker__header">
        <h1 className="color-picker__title">
          Choose a color direction
        </h1>
        <p className="color-picker__subtitle">
          Pick up to <strong>5 palettes</strong>, add custom hex colors, or both.
        </p>
      </div>

      {serviceType === "redesign" && (
        <div
          onClick={() => setUseSame(v => !v)}
          className={`color-picker__same-toggle${useSameColors ? " color-picker__same-toggle--active" : ""}`}
        >
          <div className={`color-picker__same-radio${useSameColors ? " color-picker__same-radio--active" : ""}`}>
            {useSameColors && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <div className={`color-picker__same-label${useSameColors ? " color-picker__same-label--active" : ""}`}>Keep my current brand colors</div>
            <div className="color-picker__same-hint">We&apos;ll carry over your existing palette into the refreshed logo</div>
          </div>
        </div>
      )}

      <div className="color-picker__grid">
        {COLOR_FAMILIES.map((family) => {
          const sel = selected.includes(family.id)
          const dimmed = selected.length >= MAX_COLORS && !sel
          return (
            <div
              key={family.id}
              onClick={() => !dimmed && toggle(family.id)}
              className={`color-picker__family-card${sel ? " color-picker__family-card--selected" : ""}${dimmed ? " color-picker__family-card--dimmed" : ""}`}
            >
              {sel && (
                <div className="color-picker__family-check">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
              <div className="color-picker__family-swatches">
                {family.colors.map((hex, j) => (
                  <div key={j} className="color-picker__family-swatch" style={{ background: hex }} />
                ))}
              </div>
              <div className="color-picker__family-info">
                <div className="color-picker__family-name">{family.label}</div>
                <div className="color-picker__family-sublabel">{family.sublabel}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="color-picker__custom">
        <div className="color-picker__custom-label">Custom colors</div>
        <div className="color-picker__custom-row">
          {customColors.map((hex, i) => (
            <div
              key={i}
              className="color-picker__custom-swatch"
              style={{ background: hex }}
              onClick={() => setCustom(c => c.filter((_, j) => j !== i))}
              title="Click to remove"
            />
          ))}
          <button onClick={() => setShowPicker(v => !v)} className="color-picker__custom-add">+</button>
        </div>
        {showPicker && <ColorPickerModal onAdd={hex => { setCustom(c => [...c, hex]); setShowPicker(false) }} onClose={() => setShowPicker(false)} />}
      </div>

    </div>
  )
}
