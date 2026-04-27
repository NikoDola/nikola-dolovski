"use client"
import { useState } from "react"
import { T } from "../tokens"

interface TextInputProps {
  label:       string
  placeholder?: string
  value:        string
  onChange:     (v: string) => void
  required?:    boolean
  hint?:        string
  error?:       string
  note?:        string
  multiline?:   boolean
  rows?:        number
}

export default function TextInput({ label, placeholder, value, onChange, required, hint, error, note, multiline, rows = 5 }: TextInputProps) {
  const [focused, setFocused] = useState(false)

  const inputStyle: React.CSSProperties = {
    fontFamily: T.font.sans, fontSize: T.fontSize.base,
    padding: `${T.space["3"]} ${T.space["4"]}`,
    border: `1.5px solid ${error ? T.color.error : focused ? T.color.accent : T.color.border}`,
    borderRadius: T.radius.md, background: T.color.surface, color: T.color.textPrimary,
    outline: "none", transition: "border-color 180ms ease, box-shadow 180ms ease",
    boxShadow: focused ? T.shadow.focus : "none", width: "100%",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space["2"] }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary }}>
          {label}{required && <span style={{ color: T.color.accent, marginLeft: "3px" }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: T.fontSize.xs, color: T.color.textMuted }}>{hint}</span>}
      </div>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...inputStyle, resize: "vertical" }} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle} />
      }
      {error && <span style={{ fontSize: T.fontSize.xs, color: T.color.error }}>{error}</span>}
      {note && (
        <div style={{ display: "flex", gap: T.space["2"], alignItems: "flex-start", background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.md, padding: T.space["3"] }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}><circle cx="7" cy="7" r="6" stroke={T.color.accent} strokeWidth="1.4"/><path d="M7 6v4M7 4.5v.5" stroke={T.color.accent} strokeWidth="1.4" strokeLinecap="round"/></svg>
          <span style={{ fontSize: T.fontSize.xs, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>{note}</span>
        </div>
      )}
    </div>
  )
}
