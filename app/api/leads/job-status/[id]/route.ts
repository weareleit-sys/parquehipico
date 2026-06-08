import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase();
    const { data: job, error } = await supabase
      .from('search_jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: 'Job no encontrado o error en base de datos' }, { status: 404 });
    }

    const progress = job.total_leads > 0 
      ? Math.min(Math.round((job.leads_done / job.total_leads) * 100), 100) 
      : 0;

    let phase = 'Pendiente';
    if (job.status === 'running') {
      phase = `Buscando y guardando empresas de ${job.rubro} en ${job.ubicacion || 'la Araucanía'}...`;
    } else if (job.status === 'done') {
      phase = 'Completado';
    } else if (job.status === 'error') {
      phase = 'Error';
    }

    const newLeads = typeof job.leads_found === 'string' 
      ? JSON.parse(job.leads_found) 
      : (job.leads_found || []);

    return NextResponse.json({
      job_id: job.id,
      status: job.status,
      progress,
      phase,
      leads_found: job.total_leads,
      leads_analyzed: job.leads_done,
      new_leads: newLeads,
      error: job.error,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
