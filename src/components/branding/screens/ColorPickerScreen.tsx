"use client"
import { useState, useRef, useEffect } from "react"
import { T } from "../tokens"
import BackButton from "../shared/BackButton"
import { COLOR_FAMILIES } from "../data"
import { hsvToHex, hexToHsv } from "../utils"
import type { ServiceType } from "../types"
import Button from "../shared/Button"

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
    <div ref={popupRef} style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, zIndex: 200, background: T.color.surface, borderRadius: T.radius.xl, boxShadow: T.shadow.xl, padding: T.space["5"], width: "300px", border: `1px solid ${T.color.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: T.space["4"] }}>
        <span style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary }}>Select a color</span>
        <button onClick={onClose} style={{ width: "26px", height: "26px", borderRadius: T.radius.full, border: `1px solid ${T.color.border}`, background: T.color.surfaceAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.color.textSecondary }}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div style={{ display: "flex", gap: T.space["3"], marginBottom: T.space["4"] }}>
        <div ref={squareRef} onMouseDown={e => { dragging.current = "square"; if (squareRef.current) { const r = squareRef.current.getBoundingClientRect(); setSat(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100)); setVal(Math.round(Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height))*100)) } }} style={{ flex: 1, aspectRatio: "1/1", borderRadius: T.radius.md, cursor: "crosshair", position: "relative", overflow: "hidden", userSelect: "none", background: hueColor, boxShadow: `inset 0 0 0 1px ${T.color.border}` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #fff, transparent)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000, transparent)" }} />
          <div style={{ position: "absolute", left: `${sat}%`, top: `${100 - val}%`, width: "13px", height: "13px", borderRadius: "50%", border: "2.5px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)", transform: "translate(-50%,-50%)", pointerEvents: "none", background: currentHex }} />
        </div>
        <div style={{ width: "18px", position: "relative", flexShrink: 0 }}>
          <div ref={hueRef} onMouseDown={e => { dragging.current = "hue"; if (hueRef.current) { const r = hueRef.current.getBoundingClientRect(); setHue(Math.round(Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))*360)) } }} style={{ width: "100%", height: "100%", borderRadius: T.radius.sm, cursor: "pointer", userSelect: "none", background: "linear-gradient(to bottom,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)" }} />
          <div style={{ position: "absolute", left: "-3px", right: "-3px", top: `${(hue / 360) * 100}%`, height: "4px", borderRadius: "2px", background: "#fff", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.25)", pointerEvents: "none", transform: "translateY(-50%)" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: T.space["2"], alignItems: "center" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: T.radius.md, background: currentHex, border: `1px solid ${T.color.border}`, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", border: `1.5px solid ${hexErr ? T.color.error : T.color.border}`, borderRadius: T.radius.md, overflow: "hidden", background: T.color.surfaceAlt }}>
          <span style={{ padding: `0 ${T.space["1"]} 0 ${T.space["3"]}`, fontSize: T.fontSize.sm, color: T.color.textMuted, fontFamily: T.font.mono }}>#</span>
          <input value={hexIn} onChange={e => { const v = e.target.value.replace(/[^0-9A-Fa-f]/g,"").slice(0,6); setHexIn(v); setHexErr(""); if (v.length===6) { const h = hexToHsv("#"+v); if (h) { setHue(h.h); setSat(h.s); setVal(h.v) } } }} onKeyDown={e => { if (e.key==="Enter") handleAdd(); if (e.key==="Escape") onClose() }} placeholder="D97757" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: T.font.mono, fontSize: T.fontSize.sm, color: T.color.textPrimary, padding: `${T.space["2"]} ${T.space["1"]} ${T.space["2"]} 0`, textTransform: "uppercase", width: "100%" }} />
        </div>
        <Button onClick={handleAdd} size="sm">Add</Button>
      </div>
      {hexErr && <div style={{ fontSize: T.fontSize.xs, color: T.color.error, marginTop: T.space["2"] }}>{hexErr}</div>}
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
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>
          Choose a color direction
        </h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>
          Pick up to <strong>5 palettes</strong>, add custom hex colors, or both.
        </p>
      </div>

      {serviceType === "redesign" && (
        <div onClick={() => setUseSame(v => !v)} style={{ display: "flex", alignItems: "center", gap: T.space["4"], background: useSameColors ? T.color.accentLight : T.color.surface, border: `1.5px solid ${useSameColors ? T.color.accent : T.color.border}`, borderRadius: T.radius.lg, padding: T.space["5"], cursor: "pointer", marginBottom: T.space["4"], transition: "all 180ms ease" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: T.radius.full, flexShrink: 0, border: `2px solid ${useSameColors ? T.color.accent : T.color.border}`, background: useSameColors ? T.color.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 180ms ease" }}>
            {useSameColors && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: useSameColors ? T.color.accent : T.color.textPrimary }}>Keep my current brand colors</div>
            <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: "2px" }}>We&apos;ll carry over your existing palette into the refreshed logo</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: T.space["4"], marginBottom: T.space["6"] }}>
        {COLOR_FAMILIES.map((family) => {
          const sel = selected.includes(family.id)
          const dimmed = selected.length >= MAX_COLORS && !sel
          return (
            <div key={family.id} onClick={() => !dimmed && toggle(family.id)} style={{ borderRadius: T.radius.lg, border: `3px solid ${sel ? T.color.accent : "transparent"}`, cursor: dimmed ? "not-allowed" : "pointer", transition: "all 200ms ease", boxShadow: sel ? T.shadow.lg : T.shadow.sm, overflow: "hidden", opacity: dimmed ? 0.35 : 1, position: "relative" }}>
              {sel && <div style={{ position: "absolute", top: 8, right: 8, width: "22px", height: "22px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke={T.color.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", aspectRatio: "1/1" }}>
                {family.colors.map((hex, j) => <div key={j} style={{ background: hex, aspectRatio: "1/1" }} />)}
              </div>
              <div style={{ padding: `${T.space["3"]} ${T.space["4"]}`, background: T.color.surface }}>
                <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary }}>{family.label}</div>
                <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, marginTop: "2px" }}>{family.sublabel}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ position: "relative", marginBottom: T.space["6"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>Custom colors</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: T.space["2"], alignItems: "center" }}>
          {customColors.map((hex, i) => <div key={i} style={{ width: "36px", height: "36px", borderRadius: T.radius.md, background: hex, border: `2px solid ${T.color.border}`, cursor: "pointer" }} onClick={() => setCustom(c => c.filter((_, j) => j !== i))} title="Click to remove" />)}
          <button onClick={() => setShowPicker(v => !v)} style={{ width: "36px", height: "36px", borderRadius: T.radius.md, border: `2px dashed ${T.color.border}`, background: T.color.surfaceAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.color.textMuted, fontSize: "20px", fontFamily: "sans-serif" }}>+</button>
        </div>
        {showPicker && <ColorPickerModal onAdd={hex => { setCustom(c => [...c, hex]); setShowPicker(false) }} onClose={() => setShowPicker(false)} />}
      </div>

    </div>
  )
}
