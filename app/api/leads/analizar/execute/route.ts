import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  let jobId: string | null = null;
  const supabase = getSupabase();

  try {
    const { job_id, lead_id, empresa, categoria, website } = await req.json();
    jobId = job_id;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      throw new Error('Missing GEMINI_API_KEY environment variable');
    }

    // Marcar running
    await supabase.from('search_jobs').update({ status: 'running' }).eq('id', job_id);

    // Prompt adaptado con el scoring, contexto del parque y guion
    const prompt = `Eres Alberto del Parque Hípico La Montaña (Villarrica, Araucanía). Evalúa este potencial cliente para arriendo de espacios para eventos.

EL PARQUE: 3 hectáreas planas (30.000 m²), capacidad 5.000+ personas, 400+ estacionamientos, luz trifásica T1, cancha de carreras certificada. Ideal para: festivales, conciertos, eventos corporativos, team building, matrimonios, ferias.

CLIENTE: ${empresa} | Tipo: ${categoria} | Web: ${website || 'No especificada'}

SCORING (1-10):
+3 si organiza eventos grandes (>3000 personas)
+2 si necesita electricidad industrial / trifásica
+2 si está en la Araucanía, Los Ríos o Los Lagos
+2 si tiene WhatsApp público detectable
+2 si es cliente recurrente (ya hizo eventos antes)
+1 si presupuesto conocido > $5M CLP
Mínimo 1, máximo 10. Evalúa con criterio realista basado en lo que sabes de esta empresa.

GUION: Redacta un mensaje de WhatsApp directo de 2-3 líneas máximo. Sé claro, amigable y profesional. Menciona hectáreas, capacidad o luz trifásica si son relevantes. Firma: "soy Alberto del Parque Hípico La Montaña". NUNCA uses "24/7", "recepcionista", "diagnóstico gratis", ni saludos robóticos.

Responde EXACTAMENTE este JSON y nada más:
{"perfil":"descripción breve de la empresa","categorias":["${categoria}"],"guion":"mensaje WhatsApp aquí","score":7}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
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
    
    console.log('[ANALIZAR] Raw Gemini text:', rawText.substring(0, 500));
    
    // Limpieza de Markdown del output
    let cleaned = rawText.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1].split('```')[0].trim();
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1].split('```')[0].trim();
    }

    console.log('[ANALIZAR] Cleaned text:', cleaned.substring(0, 500));
    
    if (!cleaned) {
      throw new Error('Gemini returned empty response. Raw: ' + rawText.substring(0, 200));
    }

    const analysisResult = JSON.parse(cleaned);

    // Extraer variables del resultado del JSON estructurado
    const finalScore = analysisResult.score ? parseInt(analysisResult.score.toString()) : 5;
    const finalGuion = analysisResult.guion || '';
    const finalPerfil = analysisResult.perfil || '';
    
    // 2. Actualizar el lead en la base de datos con los resultados del análisis
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        score: finalScore,
        guion: finalGuion,
        raw_data: JSON.stringify(analysisResult),
        ubicacion: finalPerfil.substring(0, 200), // Usar perfil como ubicación o descripción en su defecto
        updated_at: new Date().toISOString()
      })
      .eq('id', lead_id);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    // 3. Marcar el job como completado
    await supabase.from('search_jobs').update({
      status: 'done',
      leads_done: 1,
      leads_found: [analysisResult]
    }).eq('id', job_id);

    return NextResponse.json({ success: true, analysis: analysisResult });
  } catch (error: any) {
    console.error('Execute Analysis Job Error:', error);
    if (jobId) {
      await supabase.from('search_jobs').update({
        status: 'error',
        error: error.message || String(error),
      }).eq('id', jobId);
    }
    return NextResponse.json({ error: error.message || 'Error executing analysis' }, { status: 500 });
  }
}
