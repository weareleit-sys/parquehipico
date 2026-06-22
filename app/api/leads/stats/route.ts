import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLeadCategoryValue } from '@/lib/lead-categories';
import { LEAD_VERIFICATION_VERSION } from '@/lib/lead-verification-version';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LeadStatsRow = {
  id: string;
  estado_lead: string | null;
  score: number | null;
  sector: string | null;
  categoria: string | null;
  raw_data: unknown;
};

type SupabaseStatsResponse = {
  data: LeadStatsRow[] | null;
  error: { message: string } | null;
  count: number | null;
};

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

async function fetchAllLeadsForStats(supabase: any): Promise<{ leads: LeadStatsRow[]; total: number }> {
  const pageSize = 1000;
  let from = 0;
  let total: number | null = null;
  const leads: LeadStatsRow[] = [];

  while (true) {
    const response: SupabaseStatsResponse = await supabase
      .from('leads')
      .select('id, estado_lead, score, sector, categoria, raw_data', { count: total === null ? 'exact' : undefined })
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    const data = response.data;
    const error = response.error;
    const returnedCount = response.count;

    if (error) throw error;
    if (total === null) total = returnedCount ?? 0;

    const page = (data || []) as LeadStatsRow[];
    leads.push(...page);

    if (page.length < pageSize) break;
    from += pageSize;
  }

  return { leads, total: Math.max(total ?? 0, leads.length) };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { leads, total } = await fetchAllLeadsForStats(supabase);
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

    // Outreach conversion metrics
    const { data: outreachData } = await supabase
      .from('outreach')
      .select('resultado, respuesta_fecha, fecha_contacto');

    const totalOutreach = outreachData?.length || 0;
    const withResponse = outreachData?.filter((o: any) => o.respuesta_fecha).length || 0;
    const responseRate = totalOutreach > 0 ? Math.round((withResponse / totalOutreach) * 100) : 0;

    let avgResponseHours = 0;
    if (withResponse > 0) {
      const responseTimes = outreachData
        ?.filter((o: any) => o.respuesta_fecha)
        .map((o: any) => (new Date(o.respuesta_fecha).getTime() - new Date(o.fecha_contacto).getTime()) / 3600000) || [];
      avgResponseHours = Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length);
    }

    const byResult = (outreachData || []).reduce((acc: Record<string, number>, o: any) => {
      acc[o.resultado] = (acc[o.resultado] || 0) + 1;
      return acc;
    }, {});

    const byCategory = leads.reduce((acc: Record<string, number>, lead: any) => {
      const key = normalizeLeadCategoryValue(lead.categoria) || 'sin_categoria';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      total,
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
      outreach: {
        totalOutreach,
        withResponse,
        responseRate,
        avgResponseHours,
        byResult,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
