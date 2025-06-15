// app/api/vpn/route.ts
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'),
})

const VPN_KEYWORDS = ['vpn', 'proxy', 'tor', 'anonymous']

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'anonymous'
    
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const time = searchParams.get('time')
    const os = searchParams.get('os')
    const tzOffset = searchParams.get('tzOffset')
    const userAgent = request.headers.get('user-agent')
    const hostname = searchParams.get('hostname')

    // Validate time
    if (!time || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(time)) {
      return NextResponse.json(
        { error: 'Invalid time format' },
        { status: 400 }
      )
    }

    // Calculate time difference
    const clientTime = new Date(time)
    const serverTime = new Date()
    const timeDiff = Math.abs(serverTime.getTime() - clientTime.getTime())

    // Risk calculation
    const risks = {
      timeRisk: timeDiff > 60000 ? 3 : 0,
      osRisk: os && VPN_KEYWORDS.some(k => os.toLowerCase().includes(k)) ? 3 : 0,
      userAgentRisk: userAgent && VPN_KEYWORDS.some(k => userAgent.toLowerCase().includes(k)) ? 2 : 0,
      tzRisk: tzOffset && Math.abs(Number(tzOffset)) > 360 ? 2 : 0,
      hostnameRisk: hostname && VPN_KEYWORDS.some(k => hostname.toLowerCase().includes(k)) ? 2 : 0
    }

    const riskScore = Object.values(risks).reduce((a, b) => a + b, 0)

    return NextResponse.json({
      riskScore,
      isSuspicious: riskScore >= 4,
      risks,
      clientIp: ip
    })

  } catch (error) {
    console.error('VPN detection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'