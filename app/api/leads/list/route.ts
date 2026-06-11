import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const estado = searchParams.get('estado');
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 50);

    // Base query para contar total
    let countQuery = supabase.from('leads').select('*', { count: 'exact', head: true });
    if (categoria && categoria !== 'todos') countQuery = countQuery.filter('categorias', 'cs', `{${categoria}}`);
    if (estado && estado !== 'todos') {
      if (estado === 'pendientes') {
        countQuery = countQuery.in('estado_lead', ['nuevo', 'en_proceso']);
      } else {
        countQuery = countQuery.eq('estado_lead', estado);
      }
    }
    if (sector && sector !== 'todos') countQuery = countQuery.eq('sector', sector);
    if (search) countQuery = countQuery.or(`empresa.ilike.%${search}%,ubicacion.ilike.%${search}%`);

    const { count: total, error: countError } = await countQuery;
    if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

    // Query paginada
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('leads').select('*').range(from, to).order('created_at', { ascending: false });
    if (categoria && categoria !== 'todos') query = query.filter('categorias', 'cs', `{${categoria}}`);
    if (estado && estado !== 'todos') {
      if (estado === 'pendientes') {
        query = query.in('estado_lead', ['nuevo', 'en_proceso']);
      } else {
        query = query.eq('estado_lead', estado);
      }
    }
    if (sector && sector !== 'todos') query = query.eq('sector', sector);
    if (search) query = query.or(`empresa.ilike.%${search}%,ubicacion.ilike.%${search}%`);

    const { data: leads, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!leads || leads.length === 0) {
      return NextResponse.json({ leads: [], total: total || 0, page, totalPages: 0 });
    }

    // Outreach data
    const leadIds = leads.map((l: any) => l.id);
    let outreachByLead: Record<string, any> = {};
    try {
      const { data: outreachData } = await supabase
        .from('outreach').select('lead_id, resultado, fecha_contacto')
        .in('lead_id', leadIds).order('fecha_contacto', { ascending: false });
      if (outreachData) {
        for (const o of outreachData) {
          if (!outreachByLead[o.lead_id]) outreachByLead[o.lead_id] = o;
        }
      }
    } catch { /* sin outreach, seguimos */ }

    const enrichedLeads = leads.map((lead: any) => ({
      ...lead,
      _lastOutreach: outreachByLead[lead.id] || null
    }));

    return NextResponse.json({
      leads: enrichedLeads,
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
