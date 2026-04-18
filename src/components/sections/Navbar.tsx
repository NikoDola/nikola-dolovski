"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Logo from "@/components/ui/Logo"
import "./Navbar.css"

const links = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "My Clients", href: "/our-clients" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__left">
        <div className="navbar__logo-wrap">
          <Logo size="48px" link="/" />
        </div>
        <Link href="/" className="navbar__brand">NIKO DOLA</Link>
      </div>

      <ul className="navbar__links">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={`navbar__link${pathname === href ? " navbar__link--active" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
