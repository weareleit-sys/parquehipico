import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hasCurrentLeadVerification, parseLeadRawData, verifyLeadData } from '@/lib/lead-verification';
import { LEAD_VERIFICATION_VERSION } from '@/lib/lead-verification-version';

export const dynamic = 'force-dynamic';

const MAX_BATCH_SIZE = 5;
const FAILED_RETRY_AFTER_MS = 12 * 60 * 60 * 1000;

function parseLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return MAX_BATCH_SIZE;
  return Math.min(parsed, MAX_BATCH_SIZE);
}

function hasRecentFailedAttempt(rawData: unknown): boolean {
  const attempt = parseLeadRawData(rawData).verification_attempt;
  if (!attempt || attempt.status !== 'failed') return false;
  if (Number(attempt.version || 0) < LEAD_VERIFICATION_VERSION) return false;
  const checkedAt = new Date(attempt.checked_at || 0).getTime();
  return Number.isFinite(checkedAt) && Date.now() - checkedAt < FAILED_RETRY_AFTER_MS;
}

function buildFailedAttemptRawData(rawData: unknown, error: string): string {
  return JSON.stringify({
    ...parseLeadRawData(rawData),
    verification_attempt: {
      version: LEAD_VERIFICATION_VERSION,
      status: 'failed',
      checked_at: new Date().toISOString(),
      retry_after_hours: FAILED_RETRY_AFTER_MS / 3600000,
      error: error.slice(0, 500),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { limit } = await req.json().catch(() => ({}));
    const safeLimit = parseLimit(limit);
    const supabase = getSupabaseAdmin();

    const { data: candidates, error } = await supabase
      .from('leads')
      .select('*')
      .in('estado_lead', ['nuevo', 'en_proceso', 'contactado', 'respondio', 'agendado'])
      .order('score', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: true })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allOutdated = (candidates || [])
      .filter((lead: any) => !hasCurrentLeadVerification(lead.raw_data));
    const targets = allOutdated
      .filter((lead: any) => !hasRecentFailedAttempt(lead.raw_data))
      .slice(0, safeLimit);
    const skippedRecentFailures = allOutdated.length - allOutdated.filter((lead: any) => !hasRecentFailedAttempt(lead.raw_data)).length;

    const results = [];
    for (const lead of targets) {
      try {
        const { updates, verification } = await verifyLeadData(lead);
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update(updates)
          .eq('id', lead.id)
          .select('id, empresa, raw_data, website, instagram, facebook, telefono, email')
          .single();

        if (updateError) {
          await supabase
            .from('leads')
            .update({
              raw_data: buildFailedAttemptRawData(lead.raw_data, updateError.message),
              updated_at: new Date().toISOString(),
            })
            .eq('id', lead.id);
          results.push({ id: lead.id, empresa: lead.empresa, ok: false, error: updateError.message });
          continue;
        }

        results.push({
          id: lead.id,
          empresa: lead.empresa,
          ok: true,
          status: verification.status,
          sources: verification.sources,
          lead: updatedLead,
        });
      } catch (error: any) {
        const errorMessage = error.message || 'Error verificando lead';
        await supabase
          .from('leads')
          .update({
            raw_data: buildFailedAttemptRawData(lead.raw_data, errorMessage),
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);
        results.push({ id: lead.id, empresa: lead.empresa, ok: false, error: errorMessage });
      }
    }

    return NextResponse.json({
      success: true,
      batchLimit: MAX_BATCH_SIZE,
      processed: results.length,
      verified: results.filter(item => item.ok && item.status === 'verificado').length,
      partial: results.filter(item => item.ok && item.status === 'parcial').length,
      review: results.filter(item => item.ok && item.status !== 'verificado' && item.status !== 'parcial').length,
      failed: results.filter(item => !item.ok).length,
      skippedRecentFailures,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
