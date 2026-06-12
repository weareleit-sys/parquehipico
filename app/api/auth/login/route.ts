import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  getDashboardCookieOptions,
} from '@/lib/auth-session';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return (forwardedFor?.split(',')[0] || realIp || 'unknown').trim() || 'unknown';
}

function getSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase auth environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit(ip, 'login');
    if (!allowed) {
      return NextResponse.json({ error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 });
    }

    const { email, password } = await request.json();
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const safePassword = typeof password === 'string' ? password : '';

    if (!safeEmail || !safePassword) {
      return NextResponse.json({ error: 'Ingresa correo y contraseña' }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: safeEmail,
      password: safePassword,
    });

    if (error || !data.user?.id || !data.user.email) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    const session = await createDashboardSession({
      sub: data.user.id,
      email: data.user.email,
    });

    const response = NextResponse.json({ success: true, email: data.user.email });
    response.cookies.set(DASHBOARD_SESSION_COOKIE, session, getDashboardCookieOptions());
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'No se pudo iniciar sesión' }, { status: 500 });
  }
}
