import { getSupabaseAdmin } from '@/lib/supabase';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MINUTES = 5;

export async function checkRateLimit(ip: string, endpoint: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_ip: ip,
      p_endpoint: endpoint,
      p_max: RATE_LIMIT_MAX,
      p_window_min: RATE_LIMIT_WINDOW_MINUTES,
    });

    if (error || !data || data.length === 0) {
      console.error('Rate limit RPC error:', error);
      return { allowed: true, remaining: RATE_LIMIT_MAX };
    }

    const count = data[0].count || 0;
    return {
      allowed: count <= RATE_LIMIT_MAX,
      remaining: Math.max(0, RATE_LIMIT_MAX - count),
    };
  } catch (err) {
    console.error('Rate limit exception:', err);
    return { allowed: true, remaining: RATE_LIMIT_MAX };
  }
}
