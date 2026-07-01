import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, isValidSessionCookieValue } from '@/lib/auth';

// Next.js 16 renombró middleware.ts -> proxy.ts (export proxy() + proxyConfig,
// en vez de middleware() + config). Misma idea: gate de /admin/* por contraseña.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!isValidSessionCookieValue(cookie)) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/admin/:path*'],
};
