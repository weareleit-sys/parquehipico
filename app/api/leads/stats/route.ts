import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLeadCategoryValue } from '@/lib/lead-categories';
import { LEAD_VERIFICATION_VERSION } from '@/lib/lead-verification-version';

export const dynamic = 'force-dynamic';

function hasCurrentVerification(rawData: unknown): boolean {
  if (!rawData) return false;
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData as any;
    const verification = parsed?.verification;
    return !!verification?.status && Number(verification.version || 0) >= LEAD_VERIFICATION_VERSION;
  } catch {
    return false;
  }
}

function getCurrentVerificationStatus(rawData: unknown): string {
  if (!rawData) return '';
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData as any;
    const verification = parsed?.verification;
    if (!verification?.status || Number(verification.version || 0) < LEAD_VERIFICATION_VERSION) return '';
    return String(verification.status);
  } catch {
    return '';
  }
}

function hasCurrentFailedAttempt(rawData: unknown): boolean {
  if (!rawData) return false;
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData as any;
    const attempt = parsed?.verification_attempt;
    return attempt?.status === 'failed' && Number(attempt.version || 0) >= LEAD_VERIFICATION_VERSION;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error, count } = await supabase
      .from('leads')
      .select('estado_lead, score, sector, categoria, raw_data', { count: 'exact' })
      .range(0, 999);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const leads = data || [];
    const pending = leads.filter((lead: any) => ['nuevo', 'en_proceso'].includes(lead.estado_lead)).length;
    const contacted = leads.filter((lead: any) => lead.estado_lead === 'contactado').length;
    const replied = leads.filter((lead: any) => lead.estado_lead === 'respondio').length;
    const scheduled = leads.filter((lead: any) => lead.estado_lead === 'agendado').length;
    const goodCandidates = leads.filter((lead: any) => Number(lead.score || 0) >= 9).length;
    const highPriority = leads.filter((lead: any) =>
      Number(lead.score || 0) >= 9 && hasCurrentVerification(lead.raw_data)
    ).length;
    const needsVerification = leads.filter((lead: any) => !hasCurrentVerification(lead.raw_data)).length;
    const verified = leads.filter((lead: any) => getCurrentVerificationStatus(lead.raw_data) === 'verificado').length;
    const partial = leads.filter((lead: any) => getCurrentVerificationStatus(lead.raw_data) === 'parcial').length;
    const conflict = leads.filter((lead: any) => ['conflicto', 'sin_verificar'].includes(getCurrentVerificationStatus(lead.raw_data))).length;
    const verificationFailed = leads.filter((lead: any) => hasCurrentFailedAttempt(lead.raw_data)).length;
    const review = leads.filter((lead: any) =>
      lead.sector === 'externo' ||
      lead.estado_lead === 'descartado' ||
      (lead.score !== null && lead.score !== undefined && Number(lead.score) <= 5)
    ).length;

    const byCategory = leads.reduce((acc: Record<string, number>, lead: any) => {
      const key = normalizeLeadCategoryValue(lead.categoria) || 'sin_categoria';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      total: count ?? leads.length,
      pending,
      contacted,
      replied,
      scheduled,
      goodCandidates,
      highPriority,
      needsVerification,
      verified,
      partial,
      conflict,
      verificationFailed,
      review,
      byCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
