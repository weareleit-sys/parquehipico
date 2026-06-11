import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // En desarrollo, permitir sin token
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return NextResponse.next();
  }

  // Proteger dashboard, API de leads y outreach
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/leads') || pathname.startsWith('/api/outreach')) {
    const urlToken = request.nextUrl.searchParams.get('token');
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const validToken = urlToken === process.env.DASHBOARD_TOKEN || headerToken === process.env.DASHBOARD_TOKEN;

    if (!validToken) {
      return new NextResponse('No autorizado', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/leads/:path*', '/api/outreach/:path*'],
};
