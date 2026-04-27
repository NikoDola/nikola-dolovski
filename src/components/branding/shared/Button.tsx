"use client"
import "./Button.css"

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
  const className = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    disabled    ? "btn--disabled"    : "",
    fullWidth   ? "btn--full-width"  : "",
  ].filter(Boolean).join(" ")

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  )
}
