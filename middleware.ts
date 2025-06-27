import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // 1. Redirect unauthenticated admin access
  if (isAdminRoute && !session) {
    const response = NextResponse.redirect(new URL('/auth', request.url))
    
    // Correct cookie deletion syntax
    response.cookies.set({
      name: 'admin_session',
      value: '',
      maxAge: 0,
      path: '/',
    })
    
    return response
  }

  // 2. Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Content-Security-Policy', "default-src 'self'")
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: '/admin/:path*'
}