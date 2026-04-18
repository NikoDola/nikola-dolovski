'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const ALLOWED_EMAIL = 'nikodola@gmail.com'

async function validateAndRedirect(token: string) {
  const response = await fetch('/api/validate-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Admin validation failed')
  window.location.href = '/admin'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (cred.user.email !== ALLOWED_EMAIL) {
        await signOut(auth)
        throw new Error('Access denied. Not an authorised account.')
      }
      const token = await cred.user.getIdToken()
      await validateAndRedirect(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      if (cred.user.email !== ALLOWED_EMAIL) {
        await signOut(auth)
        throw new Error('Access denied. Only nikodola@gmail.com can log in.')
      }
      const token = await cred.user.getIdToken()
      await validateAndRedirect(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2.5rem', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.8rem', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>
          Admin Login
        </h1>

        {error && (
          <p style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem', marginBottom: '1.5rem',
            background: 'var(--secondary-color)', color: 'var(--primary-color)',
            border: 'none', fontFamily: 'Oswald, sans-serif', fontSize: '0.95rem',
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          Sign in with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
        </div>

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required
            style={{ padding: '0.6rem 0.75rem', border: '1px solid #ddd', fontSize: '0.9rem' }}
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required
            style={{ padding: '0.6rem 0.75rem', border: '1px solid #ddd', fontSize: '0.9rem' }}
          />
          <button
            type="submit" disabled={loading}
            style={{
              padding: '0.75rem', background: '#f0f0f0', color: 'var(--secondary-color)',
              border: 'none', fontFamily: 'Oswald, sans-serif', fontSize: '0.9rem',
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
          </button>
        </form>
      </div>
    </div>
  )
}
