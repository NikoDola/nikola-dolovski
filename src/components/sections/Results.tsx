"use client"
import { useEffect, useRef, useState } from "react"
import { FaMedal, FaHandshake, FaChartLine } from "react-icons/fa"
import type { IconType } from "react-icons"
import Link from "next/link"
import Image from "next/image"
import "./Results.css"

type Stat = {
  label: string
  value: number
  suffix: string
  variant: "primary" | "secondary"
  href: string
  Icon?: IconType
  imgSrc?: string
}

const stats: Stat[] = [
  { label: "Contest Winner", value: 350, suffix: "", Icon: FaMedal, variant: "primary", href: "/about#contest-winner" },
  { label: "Partners", value: 130, suffix: "", Icon: FaHandshake, variant: "secondary", href: "/our-clients" },
  { label: "Projects Completed", value: 500, suffix: "+", imgSrc: "/icons/race-flag.svg", variant: "primary", href: "/portfolio" },
  { label: "Years of Experience", value: 14, suffix: "", Icon: FaChartLine, variant: "secondary", href: "/about#experience" },
]

function StatBox({ label, value, suffix, Icon, imgSrc, variant, href, active }: Stat & { active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame = 0
    const duration = 1800
    const fps = 60
    const total = Math.round(duration / (1000 / fps))
    const timer = setInterval(() => {
      frame++
      const progress = frame / total
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (frame >= total) {
        setCount(value)
        clearInterval(timer)
      }
    }, 1000 / fps)
    return () => clearInterval(timer)
  }, [active, value])

  return (
    <div className={`rsBox rsBox--${variant}`}>
      {Icon && <Icon className="rsBox__icon" />}
      {imgSrc && <Image src={imgSrc} alt={label} width={40} height={40} className="rsBox__icon rsBox__img-icon" />}
      <span className="rsBox__number">{count}{suffix}</span>
      <span className="rsBox__label">{label}</span>
      <Link href={href} className="rsBox__readmore">
        Read More<span className="sr-only"> about {label}</span>
      </Link>
    </div>
  )
}

export default function Results() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-full rsWrapper" ref={ref}>
      {stats.map((stat) => (
        <StatBox key={stat.label} {...stat} active={active} />
      ))}
    </section>
  )
}
