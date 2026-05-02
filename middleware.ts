// middleware.ts – Route protection
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin-only routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Block suspended/pending users from dashboard
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      if (token?.status === 'PENDING') {
        return NextResponse.redirect(new URL('/login?error=Account+pending+admin+approval', req.url));
      }
      if (token?.status === 'REJECTED' || token?.status === 'SUSPENDED') {
        return NextResponse.redirect(new URL('/login?error=Account+access+restricted', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public paths - always allow
        if (
          pathname === '/' ||
          pathname.startsWith('/alumni') ||
          pathname.startsWith('/events') ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/jobs') && req.method === 'GET' ||
          pathname.startsWith('/api/events') && req.method === 'GET' ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/icons') ||
          pathname.startsWith('/images') ||
          pathname === '/manifest.json' ||
          pathname === '/favicon.ico'
        ) {
          return true;
        }
        // Protected paths require auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json).*)',
  ],
};
