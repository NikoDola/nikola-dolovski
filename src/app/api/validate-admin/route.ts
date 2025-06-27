import { NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

export async function POST(request: Request) {
  const { token } = await request.json()

  try {
    // 1. Verify JWT using Firebase's public keys
    const JWKS = createRemoteJWKSet(
      new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
    )

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })

    // 2. Validate admin email
    if (payload.email !== 'nikodola@gmail.com') {
      return NextResponse.json({ isAdmin: false }, { status: 403 })
    }

    // 3. Set production-ready cookie (updated for Vercel)
    const response = NextResponse.json({ isAdmin: true })
    response.cookies.set('admin_session', 'valid', {
      httpOnly: true,
      secure: true, // Always true for Vercel
      sameSite: 'lax', // Changed from strict for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      domain: process.env.VERCEL_ENV === 'production' 
        ? '.yourdomain.com' // Your production domain
        : undefined // Localhost
    })

    return response

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { 
        isAdmin: false, 
        error: error instanceof Error ? error.message : 'Invalid token' 
      },
      { status: 401 }
    )
  }
}