import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { token } = await req.json()
  
  try {
    // Decode the JWT payload only (we don't need full verification for email check)
    const payload = token.split('.')[1]
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64').toString()
    )

    const isAdmin = decodedPayload.email === 'nikodola@gmail.com'
    
    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}