"use client"
import { T } from "../tokens"

interface SummaryRowProps {
  label:     string
  value:     string
  highlight?: boolean
}

export default function SummaryRow({ label, value, highlight }: SummaryRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.space["3"]} 0`, borderBottom: `1px solid ${T.color.border}` }}>
      <span style={{ fontSize: T.fontSize.base, color: T.color.textSecondary }}>{label}</span>
      <span style={{
        fontSize: highlight ? T.fontSize.lg : T.fontSize.base,
        fontWeight: highlight ? T.fontWeight.bold : T.fontWeight.medium,
        color: highlight ? T.color.accent : T.color.textPrimary,
      }}>{value}</span>
    </div>
  )
}
