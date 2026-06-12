import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { verifyLeadData } from '@/lib/lead-verification';

export const dynamic = 'force-dynamic';

function parseRawData(rawData: unknown): Record<string, any> {
  if (!rawData || typeof rawData !== 'string') return {};
  try {
    return JSON.parse(rawData);
  } catch {
    return {};
  }
}

function hasVerification(rawData: unknown): boolean {
  return !!parseRawData(rawData).verification?.status;
}

function parseLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 10;
  return Math.min(parsed, 10);
}

export async function POST(req: NextRequest) {
  try {
    const { limit } = await req.json().catch(() => ({}));
    const safeLimit = parseLimit(limit);
    const supabase = getSupabaseAdmin();

    const { data: candidates, error } = await supabase
      .from('leads')
      .select('*')
      .order('updated_at', { ascending: true })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const targets = (candidates || [])
      .filter((lead: any) => !hasVerification(lead.raw_data))
      .slice(0, safeLimit);

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
        results.push({ id: lead.id, empresa: lead.empresa, ok: false, error: error.message || 'Error verificando lead' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      verified: results.filter(item => item.ok && item.status === 'verificado').length,
      partial: results.filter(item => item.ok && item.status === 'parcial').length,
      review: results.filter(item => item.ok && item.status !== 'verificado' && item.status !== 'parcial').length,
      failed: results.filter(item => !item.ok).length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
