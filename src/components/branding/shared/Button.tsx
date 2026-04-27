"use client"
import { useState } from "react"
import { T } from "../tokens"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

export default function Button({ children, onClick, variant = "primary", size = "md", disabled = false, fullWidth = false, icon }: ButtonProps) {
  const [hovered, setHovered] = useState(false)

  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: T.space["2"], fontFamily: T.font.sans, fontWeight: T.fontWeight.medium,
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: T.radius.full, transition: `all ${T.duration.normal} ${T.easing.smooth}`,
    opacity: disabled ? 0.5 : 1, width: fullWidth ? "100%" : "auto",
    textDecoration: "none",
  }

  const sizes: Record<string, React.CSSProperties> = {
    sm: { fontSize: T.fontSize.sm, padding: `${T.space["2"]} ${T.space["4"]}`, height: "34px" },
    md: { fontSize: T.fontSize.base, padding: `${T.space["3"]} ${T.space["6"]}`, height: "44px" },
    lg: { fontSize: T.fontSize.md, padding: `${T.space["4"]} ${T.space["8"]}`, height: "52px" },
  }

  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: T.color.accent, color: T.color.textInverse },
    secondary: { background: T.color.surfaceAlt, color: T.color.textPrimary, border: `1px solid ${T.color.border}` },
    ghost:     { background: "transparent", color: T.color.textSecondary },
    danger:    { background: T.color.error, color: T.color.textInverse },
  }

  const hoverStyle: React.CSSProperties = hovered && !disabled
    ? variant === "primary"
      ? { background: T.color.accentHover, transform: "translateY(-1px)", boxShadow: T.shadow.md }
      : { opacity: 0.85 }
    : {}

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant], ...hoverStyle }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  )
}
