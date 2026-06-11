import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isLeadCategoryValue, normalizeLeadCategoryValue } from '@/lib/lead-categories';

function addIfPresent(target: Record<string, any>, key: string, value: any) {
  if (value !== undefined) target[key] = value;
}

const ALLOWED_ESTADOS = new Set(['nuevo', 'en_proceso', 'contactado', 'respondio', 'agendado', 'rechazo', 'descartado']);
const ALLOWED_SECTORES = new Set(['temuco', 'lacustre', 'sur', 'costa', 'norte', 'lagos', 'externo']);

function parseInteger(value: any): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseInt(value.toString(), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeCategories(value: any, fallback?: string): string[] | undefined {
  const source = Array.isArray(value) ? value : fallback ? [fallback] : undefined;
  if (!source) return undefined;
  return source
    .map(item => normalizeLeadCategoryValue(String(item)))
    .filter(Boolean);
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
      sector,
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

    const normalizedCategoria = categoria !== undefined ? normalizeLeadCategoryValue(categoria) : undefined;
    const normalizedCategorias = normalizeCategories(categorias, normalizedCategoria);
    if (normalizedCategoria !== undefined && !isLeadCategoryValue(normalizedCategoria)) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });
    }
    if (normalizedCategorias?.some(item => !isLeadCategoryValue(item))) {
      return NextResponse.json({ error: 'Categorías no válidas' }, { status: 400 });
    }
    if (estado_lead !== undefined && !ALLOWED_ESTADOS.has(estado_lead)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }
    if (sector !== undefined && !ALLOWED_SECTORES.has(sector)) {
      return NextResponse.json({ error: 'Sector no válido' }, { status: 400 });
    }

    const leadData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    addIfPresent(leadData, 'empresa', empresa);
    addIfPresent(leadData, 'categoria', normalizedCategoria);
    addIfPresent(leadData, 'categorias', normalizedCategorias);
    addIfPresent(leadData, 'estado_lead', estado_lead);
    addIfPresent(leadData, 'telefono', telefono);
    addIfPresent(leadData, 'website', website);
    addIfPresent(leadData, 'email', email);
    addIfPresent(leadData, 'ubicacion', ubicacion);
    addIfPresent(leadData, 'sector', sector);
    addIfPresent(leadData, 'capacidad_estimada', parseInteger(capacidad_estimada));
    addIfPresent(leadData, 'web_status', web_status);
    const parsedScore = parseInteger(score);
    addIfPresent(leadData, 'score', parsedScore !== undefined ? Math.max(1, Math.min(10, parsedScore)) : undefined);
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
          categoria: normalizedCategoria,
          categorias: normalizedCategorias || (normalizedCategoria ? [normalizedCategoria] : []),
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
