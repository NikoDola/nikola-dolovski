"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

interface Props {
  backHref?: string
  backLabel?: string
  sectionLabel?: string
}

export default function AdminNav({ backHref, backLabel, sectionLabel }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    try { await signOut(auth) } catch { /* already signed out */ }
    await fetch("/api/admin-auth", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <nav className="admin-nav">
      <div className="admin-nav__left">
        {backHref ? (
          <Link href={backHref} className="admin-nav__back">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {backLabel || "Back"}
          </Link>
        ) : (
          <span className="admin-nav__brand">Admin</span>
        )}
        {sectionLabel && (
          <>
            <div className="admin-nav__divider" />
            <span className="admin-nav__section">{sectionLabel}</span>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Link href="/" className="admin-nav__logout" title="Go to homepage">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 6.5L8 2l6 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>
        <button onClick={handleLogout} className="admin-nav__logout">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3M9 9.5l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Log out
        </button>
      </div>
    </nav>
  )
}
