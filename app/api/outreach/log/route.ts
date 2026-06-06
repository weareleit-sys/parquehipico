import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, contactado_por, canal, resultado, notas, nuevo_estado_lead } = body;

    if (!lead_id) {
      return NextResponse.json({ error: 'Falta campo requerido (lead_id)' }, { status: 400 });
    }

    // Insertar registro en outreach
    const { data: outreach, error: outreachError } = await supabase
      .from('outreach')
      .insert({
        lead_id,
        contactado_por: contactado_por || 'Alberto',
        canal: canal || 'whatsapp',
        resultado: resultado || 'pendiente',
        notas
      })
      .select()
      .single();

    if (outreachError) {
      return NextResponse.json({ error: outreachError.message }, { status: 500 });
    }

    // Actualizar el estado del lead de forma opcional (si nuevo_estado_lead es enviado)
    if (nuevo_estado_lead) {
      const { error: leadError } = await supabase
        .from('leads')
        .update({ estado_lead: nuevo_estado_lead })
        .eq('id', lead_id);

      if (leadError) {
        return NextResponse.json({ error: leadError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ outreach });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lead_id = searchParams.get('lead_id');

    if (!lead_id) {
      return NextResponse.json({ error: 'Falta campo requerido (lead_id)' }, { status: 400 });
    }

    const { data: list, error } = await supabase
      .from('outreach')
      .select('*')
      .eq('lead_id', lead_id)
      .order('fecha_contacto', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ outreach: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
