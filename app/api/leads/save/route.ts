import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
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

    if (!empresa || !categoria) {
      return NextResponse.json({ error: 'Faltan campos requeridos (empresa, categoria)' }, { status: 400 });
    }

    const leadData = {
      empresa,
      categoria,
      categorias: categorias || [categoria],
      estado_lead: estado_lead || 'nuevo',
      telefono,
      website,
      email,
      ubicacion,
      capacidad_estimada: capacidad_estimada ? parseInt(capacidad_estimada.toString()) : null,
      web_status: web_status || 'sin_web',
      score: score ? parseInt(score.toString()) : null,
      redes,
      raw_data: typeof raw_data === 'object' ? JSON.stringify(raw_data) : raw_data,
      guion,
      updated_at: new Date().toISOString()
    };

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
        .upsert({ ...leadData, created_at: new Date().toISOString() }, { onConflict: 'empresa' })
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
