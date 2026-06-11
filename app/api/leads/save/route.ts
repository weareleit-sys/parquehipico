import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function addIfPresent(target: Record<string, any>, key: string, value: any) {
  if (value !== undefined) target[key] = value;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const {
      id,
      empresa,
      categoria,
      categorias,
      estado_lead,
      telefono,
      website,
      email,
      ubicacion,
      capacidad_estimada,
      web_status,
      score,
      redes,
      raw_data,
      guion
    } = body;

    if (!id && (!empresa || !categoria)) {
      return NextResponse.json({ error: 'Faltan campos requeridos (empresa, categoria)' }, { status: 400 });
    }

    const leadData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    addIfPresent(leadData, 'empresa', empresa);
    addIfPresent(leadData, 'categoria', categoria);
    addIfPresent(leadData, 'categorias', categorias || (categoria ? [categoria] : undefined));
    addIfPresent(leadData, 'estado_lead', estado_lead);
    addIfPresent(leadData, 'telefono', telefono);
    addIfPresent(leadData, 'website', website);
    addIfPresent(leadData, 'email', email);
    addIfPresent(leadData, 'ubicacion', ubicacion);
    addIfPresent(leadData, 'capacidad_estimada', capacidad_estimada !== undefined ? parseInt(capacidad_estimada.toString()) : undefined);
    addIfPresent(leadData, 'web_status', web_status);
    addIfPresent(leadData, 'score', score !== undefined ? parseInt(score.toString()) : undefined);
    addIfPresent(leadData, 'redes', redes);
    addIfPresent(leadData, 'raw_data', typeof raw_data === 'object' ? JSON.stringify(raw_data) : raw_data);
    addIfPresent(leadData, 'guion', guion);

    let result;
    if (id) {
      // Modificar existente
      result = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', id)
        .select()
        .single();
    } else {
      // Crear nuevo usando upsert por empresa
      result = await supabase
        .from('leads')
        .upsert({
          ...leadData,
          empresa,
          categoria,
          categorias: categorias || [categoria],
          estado_lead: estado_lead || 'nuevo',
          web_status: web_status || 'sin_web',
          created_at: new Date().toISOString()
        }, { onConflict: 'empresa' })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
