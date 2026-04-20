"use client"
import { useState } from "react"
import Skills from "./Skills"

export default function SkillsSection() {
  const [loading, setLoading] = useState(true)

  return (
    <section
      style={{
        opacity: loading ? 0 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: loading ? "none" : "auto",
      }}
    >
      <Skills onLoadComplete={() => setLoading(false)} />
    </section>
  )
}
