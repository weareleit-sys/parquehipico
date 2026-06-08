import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { categoria, ubicacion = 'Temuco, Araucanía', limit = 10 } = await req.json();
    const supabase = getSupabase();

    if (!categoria) {
      return NextResponse.json({ error: 'Falta campo requerido: categoria' }, { status: 400 });
    }

    // 1. Crear job
    const { data: job, error: jobError } = await supabase
      .from('search_jobs')
      .insert({
        status: 'pending',
        rubro: categoria,
        ubicacion,
        total_leads: limit
      })
      .select('id')
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'No se pudo crear el job en la base de datos' }, { status: 500 });
    }

    // 2. Disparar ejecución en background (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') 
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    fetch(`${baseUrl}/api/leads/search/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id, categoria, ubicacion, limit }),
    }).catch((err) => {
      console.error('Background job dispatch failed:', err);
    });

    // 3. Responder inmediatamente para evitar el timeout de Vercel (10s)
    return NextResponse.json({
      job_id: job.id,
      status: 'pending',
      poll_url: `/api/leads/job-status/${job.id}`,
      estimated_time_s: limit * 8,
      estimated_cost_clp: limit * 15,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
