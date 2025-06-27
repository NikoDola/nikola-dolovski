import { NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

export async function POST(request: Request) {
  const { token } = await request.json()

  try {
    // Verify JWT
    const JWKS = createRemoteJWKSet(
      new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
    )

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })

    // Verify admin email
    if (payload.email !== 'nikodola@gmail.com') {
      return NextResponse.json({ isAdmin: false }, { status: 403 })
    }

    // Set production-ready cookie
    const response = NextResponse.json({ isAdmin: true })
    
    // Vercel-specific cookie settings
    const isProduction = process.env.NODE_ENV === 'production'
    const domain = isProduction ? '.nikodola.com' : undefined
    
    response.cookies.set('admin_session', token, { // Using the token as value
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      domain
    })

    return response

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Authentication failed' },
      { status: 401 }
    )
  }
}