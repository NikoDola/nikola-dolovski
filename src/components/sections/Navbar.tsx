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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
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

        <button
          className={`navbar__burger${menuOpen ? " navbar__burger--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`navbar__drawer${menuOpen ? " navbar__drawer--open" : ""}`}>
        <button
          className="navbar__drawer-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <span />
          <span />
        </button>
        <ul className="navbar__drawer-links">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`navbar__drawer-link${pathname === href ? " navbar__drawer-link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
