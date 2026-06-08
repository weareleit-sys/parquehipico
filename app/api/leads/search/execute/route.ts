import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  let jobId: string | null = null;
  const supabase = getSupabase();

  try {
    const { job_id, categoria, ubicacion, limit } = await req.json();
    jobId = job_id;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      throw new Error('Missing GEMINI_API_KEY environment variable');
    }

    // Marcar running
    await supabase.from('search_jobs').update({ status: 'running' }).eq('id', job_id);

    // 1. Gemini grounding: buscar leads reales
    const prompt = `Busca ${limit} empresas reales en ${ubicacion}, Chile que organicen o necesiten espacios para eventos masivos, festivales, conciertos, team building o matrimonios. Para cada una encuentra: nombre, teléfono, sitio web, ciudad. Responde SOLO un JSON array de objetos con las llaves "empresa", "telefono", "website", "ubicacion" sin formato adicional de Markdown.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status} ${await geminiRes.text()}`);
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Limpieza de Markdown del output de Gemini
    let cleaned = rawText.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1].split('```')[0];
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1].split('```')[0];
    }
    
    const leads = JSON.parse(cleaned.trim());

    // 2. Guardar leads en Supabase
    const saved = [];
    for (let i = 0; i < Math.min(leads.length, limit); i++) {
      const lead = leads[i];
      
      const { data: savedLead, error: upsertError } = await supabase
        .from('leads')
        .upsert({
          empresa: lead.empresa,
          categoria: categoria,
          categorias: [categoria],
          telefono: lead.telefono || '',
          website: lead.website || '',
          ubicacion: lead.ubicacion || '',
          raw_data: JSON.stringify(lead),
          estado_lead: 'nuevo'
        }, { onConflict: 'empresa' })
        .select('id')
        .single();

      if (upsertError) {
        console.error(`Error saving lead ${lead.empresa}:`, upsertError.message);
        continue;
      }

      saved.push({ ...lead, id: savedLead?.id });
      
      // Actualizar progreso incrementalmente
      await supabase
        .from('search_jobs')
        .update({
          leads_done: i + 1,
          leads_found: saved,
        })
        .eq('id', job_id);
    }

    // 3. Marcar completado
    await supabase.from('search_jobs').update({
      status: 'done',
      leads_found: saved,
      total_leads: saved.length,
      leads_done: saved.length
    }).eq('id', job_id);

    return NextResponse.json({ success: true, processed: saved.length });
  } catch (error: any) {
    console.error('Execute Job Error:', error);
    if (jobId) {
      await supabase.from('search_jobs').update({
        status: 'error',
        error: error.message || String(error),
      }).eq('id', jobId);
    }
    return NextResponse.json({ error: error.message || 'Error executing job' }, { status: 500 });
  }
}
