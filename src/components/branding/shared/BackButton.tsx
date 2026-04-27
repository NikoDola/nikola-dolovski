"use client"
import { T } from "../tokens"

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: T.space["2"],
        background: "none", border: "none", cursor: "pointer",
        color: T.color.textSecondary, fontSize: T.fontSize.sm,
        fontFamily: T.font.sans, marginBottom: T.space["8"], padding: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
  )
}
