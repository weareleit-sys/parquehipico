import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase';

async function callGemini(prompt: string, key: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

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
    const mainPrompt = website
      ? `Sos Alberto del Parque Hípico La Montaña, recinto outdoor más grande del sur de Chile. Investigá "${empresa}" (${website}) en ${ciudad}. Categoría: ${categoria}. Respondé JSON: {"perfil":"1 línea de qué hacen","guion":"mensaje WhatsApp 3 líneas. Gancho sobre ELLOS, no sobre nosotros. Problema que resolvemos. CTA informal. Firmá: soy Alberto del Parque Hípico La Montaña. PROHIBIDO mencionar hectáreas o trifásica."}`
      : `Sos Alberto del Parque Hípico La Montaña. Escribí un mensaje para "${empresa}" en ${ciudad}, categoría ${categoria}. Respondé JSON: {"perfil":"1 línea describiendo esta empresa","guion":"mensaje WhatsApp 3 líneas. Gancho sobre su rubro. Problema que resolvemos. CTA informal. Firmá: soy Alberto del Parque Hípico La Montaña."}`;

    // Fallback simple si el principal falla
    const fallbackPrompt = `Escribí un mensaje de WhatsApp de 2 líneas para "${empresa}" (${categoria}) en ${ciudad}. Ofrecé espacio outdoor para eventos masivos. Tono chileno, informal. Firmá: soy Alberto del Parque Hípico La Montaña. Respondé JSON: {"perfil":"Breve descripción","guion":"mensaje aquí"}`;

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
    const admin = getSupabaseAdmin();
    await admin.from('leads').update({
      guion,
      raw_data: JSON.stringify({ ...(lead.raw_data ? JSON.parse(lead.raw_data) : {}), perfil_ia: perfil }),
      updated_at: new Date().toISOString()
    }).eq('id', lead_id);

    return NextResponse.json({ success: true, guion, perfil });
  } catch (error: any) {
    console.error('[GenerarGuion] Error crítico:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
