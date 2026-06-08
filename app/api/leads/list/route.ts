import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const estado = searchParams.get('estado');
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoria && categoria !== 'todos') {
      query = query.filter('categorias', 'cs', `{${categoria}}`);
    }
    if (estado && estado !== 'todos') {
      query = query.eq('estado_lead', estado);
    }
    if (sector && sector !== 'todos') {
      query = query.eq('sector', sector);
    }
    if (search) {
      query = query.or(`empresa.ilike.%${search}%,ubicacion.ilike.%${search}%`);
    }

    const { data: leads, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ leads: [] });
    }

    // Obtener último outreach por lead
    const leadIds = leads.map((l: any) => l.id);
    const { data: outreachData } = await supabase
      .from('outreach')
      .select('lead_id, resultado, fecha_contacto')
      .in('lead_id', leadIds)
      .order('fecha_contacto', { ascending: false });

    // Agrupar outreach por lead_id (quedarse con el más reciente)
    const outreachByLead: Record<string, any> = {};
    if (outreachData) {
      for (const o of outreachData) {
        if (!outreachByLead[o.lead_id]) {
          outreachByLead[o.lead_id] = o;
        }
      }
    }

    const enrichedLeads = leads.map((lead: any) => ({
      ...lead,
      _lastOutreach: outreachByLead[lead.id] || null
    }));

    return NextResponse.json({ leads: enrichedLeads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
