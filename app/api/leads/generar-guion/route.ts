import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

async function callGemini(prompt: string, key: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2000 }
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseGeminiJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.includes('```json')) cleaned = cleaned.split('```json')[1].split('```')[0].trim();
  else if (cleaned.includes('```')) cleaned = cleaned.split('```')[1].split('```')[0].trim();
  if (!cleaned) throw new Error('Respuesta vacía de Gemini');
  return JSON.parse(cleaned);
}

function parseRawData(rawData: unknown): Record<string, any> {
  if (!rawData || typeof rawData !== 'string') return {};
  try {
    return JSON.parse(rawData);
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();

  try {
    const { lead_id } = await req.json();
    if (!lead_id) return NextResponse.json({ error: 'Falta lead_id' }, { status: 400 });

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return NextResponse.json({ error: 'Gemini no está configurado' }, { status: 500 });

    const { data: lead, error: leadError } = await supabase
      .from('leads').select('*').eq('id', lead_id).single();
    if (leadError || !lead) return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });

    const website = lead.website || '';
    const empresa = lead.empresa;
    const ciudad = lead.ubicacion || 'la Araucanía';
    const categoria = lead.categoria;

    // Prompt principal (con web si existe, sino sin referencia)
    const mainPrompt = `Sos Alberto. ARRENDAMOS ESPACIO FÍSICO para eventos masivos: 3 hectáreas planas, capacidad 5.000+ personas, luz trifásica, 400+ estacionamientos. SOMOS UN VENUE/TERRENO, no hacemos shows de caballos ni servicios ecuestres. El nombre "Parque Hípico" es histórico, NO significa que trabajemos con caballos.

Investigá "${empresa}" (${website || 'sin web'}) en ${ciudad}. Categoría: ${categoria}.
Respondé JSON:
{"perfil":"1 línea describiendo qué hace ESTA EMPRESA (no nosotros)","guion":"mensaje WhatsApp 3 líneas. Gancho sobre ELLOS. Problema que resolvemos (espacio outdoor masivo). CTA informal. PROHIBIDO mencionar caballos, equitación, shows ecuestres, hectáreas, trifásica. Firmá: soy Alberto del Parque Hípico La Montaña."}`;

    const fallbackPrompt = `ARRENDAMOS ESPACIO FÍSICO PARA EVENTOS (no caballos, no shows ecuestres). Escribí mensaje WhatsApp 2 líneas para "${empresa}" (${categoria}) en ${ciudad}. Respondé JSON: {"perfil":"Breve","guion":"mensaje aquí. PROHIBIDO mencionar caballos o ecuestre. Firmá: soy Alberto del Parque Hípico La Montaña."}`;

    let result: any = null;
    let lastError = '';

    // Intento 1: prompt principal
    try {
      const text = await callGemini(mainPrompt, geminiKey);
      result = parseGeminiJson(text);
    } catch (e: any) {
      lastError = e.message;
      console.warn('[GenerarGuion] Intento 1 falló:', lastError);

      // Intento 2: fallback simplificado
      try {
        const text = await callGemini(fallbackPrompt, geminiKey);
        result = parseGeminiJson(text);
      } catch (e2: any) {
        console.error('[GenerarGuion] Intento 2 falló:', e2.message);
        return NextResponse.json({
          error: 'No se pudo generar el mensaje. Gemini no está respondiendo. Probá de nuevo en unos segundos.',
          detail: lastError
        }, { status: 502 });
      }
    }

    const guion = result?.guion?.trim();
    if (!guion) return NextResponse.json({ error: 'Gemini devolvió un mensaje vacío. Reintentá.' }, { status: 502 });

    const perfil = result?.perfil?.trim() || '';

    // Guardar
    const { error: updateError } = await supabase.from('leads').update({
      guion,
      raw_data: JSON.stringify({ ...parseRawData(lead.raw_data), perfil_ia: perfil }),
      updated_at: new Date().toISOString()
    }).eq('id', lead_id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ success: true, guion, perfil });
  } catch (error: any) {
    console.error('[GenerarGuion] Error crítico:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
