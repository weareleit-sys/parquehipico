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

    // Filtro por categoría (usando ANY sobre el array categorias)
    if (categoria && categoria !== 'todos') {
      query = query.filter('categorias', 'cs', `{${categoria}}`);
    }

    // Filtro por estado
    if (estado && estado !== 'todos') {
      query = query.eq('estado_lead', estado);
    }

    // Filtro por sector
    if (sector && sector !== 'todos') {
      query = query.eq('sector', sector);
    }

    // Filtro de búsqueda por texto (nombre de la empresa o ubicación)
    if (search) {
      query = query.or(`empresa.ilike.%${search}%,ubicacion.ilike.%${search}%`);
    }

    const { data: leads, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
