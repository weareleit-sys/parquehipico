import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { lead_id, empresa, categoria, website } = await req.json();
    const supabase = getSupabase();

    if (!lead_id || !empresa || !categoria) {
      return NextResponse.json({ error: 'Faltan campos requeridos (lead_id, empresa, categoria)' }, { status: 400 });
    }

    // 1. Crear un job para el análisis
    const { data: job, error: jobError } = await supabase
      .from('search_jobs')
      .insert({
        status: 'pending',
        rubro: categoria,
        ubicacion: empresa,
        total_leads: 1
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

    fetch(`${baseUrl}/api/leads/analizar/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id, lead_id, empresa, categoria, website }),
    }).catch((err) => {
      console.error('Background analysis job dispatch failed:', err);
    });

    // 3. Responder de inmediato
    return NextResponse.json({
      job_id: job.id,
      status: 'pending',
      poll_url: `/api/leads/job-status/${job.id}`,
      estimated_time_s: 15,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
