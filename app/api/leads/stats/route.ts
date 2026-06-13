import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLeadCategoryValue } from '@/lib/lead-categories';
import { hasCurrentLeadVerification } from '@/lib/lead-verification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .select('estado_lead, score, sector, categoria, raw_data');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const leads = data || [];
    const pending = leads.filter((lead: any) => ['nuevo', 'en_proceso'].includes(lead.estado_lead)).length;
    const contacted = leads.filter((lead: any) => lead.estado_lead === 'contactado').length;
    const replied = leads.filter((lead: any) => lead.estado_lead === 'respondio').length;
    const scheduled = leads.filter((lead: any) => lead.estado_lead === 'agendado').length;
    const highPriority = leads.filter((lead: any) => Number(lead.score || 0) >= 8).length;
    const needsVerification = leads.filter((lead: any) => !hasCurrentLeadVerification(lead.raw_data)).length;
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
      total: leads.length,
      pending,
      contacted,
      replied,
      scheduled,
      highPriority,
      needsVerification,
      review,
      byCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
