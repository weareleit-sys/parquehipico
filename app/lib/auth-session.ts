export const DASHBOARD_SESSION_COOKIE = 'ph_dashboard_session';
export const DASHBOARD_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface DashboardSession {
  sub: string;
  email: string;
  exp: number;
}

function getSessionSecret(): string {
  return process.env.DASHBOARD_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function sign(value: string): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error('Missing dashboard session secret');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function createDashboardSession(input: { sub: string; email: string }): Promise<string> {
  const payload: DashboardSession = {
    sub: input.sub,
    email: input.email,
    exp: Math.floor(Date.now() / 1000) + DASHBOARD_SESSION_TTL_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifyDashboardSession(value?: string | null): Promise<DashboardSession | null> {
  if (!value) return null;
  const [encodedPayload, signature] = value.split('.');
  if (!encodedPayload || !signature) return null;

  try {
    const expectedSignature = await sign(encodedPayload);
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as DashboardSession;
    if (!payload.email || !payload.sub || !payload.exp) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getDashboardCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DASHBOARD_SESSION_TTL_SECONDS,
  };
}
