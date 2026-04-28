"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const ALLOWED_EMAIL = "nikodola@gmail.com"

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user

      if (user.email !== ALLOWED_EMAIL) {
        await auth.signOut()
        setError("Access denied. This admin is restricted to one account.")
        setLoading(false)
        return
      }

      const idToken = await user.getIdToken()
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Authentication failed")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="20" height="20" rx="5" stroke="var(--color-accent)" strokeWidth="1.8"/>
            <path d="M9 14h10M14 9v10" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="login-badge">
          <div className="login-badge-dot" />
          <span className="login-badge-label">Admin Access</span>
        </div>

        <h1 className="login-title">Welcome back, Nikola</h1>
        <p className="login-subtitle">Sign in with your Google account to access the admin dashboard.</p>

        <button onClick={handleGoogleSignIn} disabled={loading} className="login-google-btn">
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
              <circle cx="9" cy="9" r="7" stroke="var(--color-border)" strokeWidth="2"/>
              <path d="M9 2a7 7 0 0 1 7 7" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15.2 16.5 19.3 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3c-7.6 0-14.2 4.2-17.7 10.7z" fill="#FF3D00"/>
              <path d="M24 45c5.5 0 10.4-1.8 14.2-4.9l-6.6-5.5C29.7 36.3 27 37 24 37c-5.7 0-10.6-3.1-11.8-8.4L5.3 34c3.5 6.5 10.1 11 18.7 11z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.8C35.3 31.4 34 33.1 32.3 34.3l6.6 5.5C43.3 36.3 45 31 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
            </svg>
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {error && <div className="login-error">{error}</div>}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
