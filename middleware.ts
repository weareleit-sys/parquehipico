import { NextRequest, NextResponse } from 'next/server';
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from '@/lib/auth-session';

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // En desarrollo, permitir sin token
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return NextResponse.next();
  }

  const isDashboardLogin = pathname.startsWith('/dashboard/login');
  const isProtectedDashboard = pathname.startsWith('/dashboard') && !isDashboardLogin;
  const isProtectedApi = pathname.startsWith('/api/leads') || pathname.startsWith('/api/outreach');
  const isProtectedRoute = isProtectedDashboard || isProtectedApi;

  if (!isProtectedRoute && !isDashboardLogin) {
    return NextResponse.next();
  }

  const urlToken = request.nextUrl.searchParams.get('token');
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const dashboardToken = process.env.DASHBOARD_TOKEN;
  const validToken = !!dashboardToken && (urlToken === dashboardToken || headerToken === dashboardToken);
  const session = await verifyDashboardSession(request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value);

  if (isDashboardLogin && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Proteger dashboard, API de leads y outreach
  if (isProtectedRoute && !validToken && !session) {
    if (isProtectedDashboard) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/leads/:path*', '/api/outreach/:path*'],
};
