import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_COOKIE = 'techstore_token'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const { pathname } = request.nextUrl

  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/conta')

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/conta', '/conta/:path*'],
}
