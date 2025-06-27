import { NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'


export async function POST(request: Request) {
  const { token } = await request.json()

  try {
    // 1. Get Firebase's public keys JWKS
    const jwksUri = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
    const JWKS = createRemoteJWKSet(new URL(jwksUri))

    // 2. Verify JWT using Firebase's public keys
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })

    // 3. Validate claims
    if (payload.email !== 'nikodola@gmail.com') {
      return NextResponse.json(
        { isAdmin: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // 4. Set secure cookie
    const response = NextResponse.json({ isAdmin: true })
    response.cookies.set('admin_session', 'valid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/admin'
    })

    return response

  } catch (error) {
    return NextResponse.json(
      { isAdmin: false, error: error instanceof Error ? error.message : 'Invalid token' },
      { status: 401 }
    )
  }
}