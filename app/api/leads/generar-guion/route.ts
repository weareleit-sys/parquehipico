import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return NextResponse.json({ error: 'Falta lead_id' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const website = lead.website || '';
    const empresa = lead.empresa;
    const ciudad = lead.ubicacion || 'la Araucanía';
    const categoria = lead.categoria;

    const prompt = `Sos Alberto del Parque Hípico La Montaña, el recinto outdoor más grande del sur de Chile (3 hectáreas planas, 5.000 personas, luz trifásica, 400+ estacionamientos, cancha de carreras certificada). Arrendamos el espacio para eventos masivos.

Investigá "${empresa}" (${website || 'sin web'}) en ${ciudad}, categoría: ${categoria}.

Respondé EXACTAMENTE en este formato JSON, sin Markdown adicional:
{
  "perfil": "1 línea describiendo qué hace esta empresa y qué tipo de eventos organiza",
  "guion": "mensaje de WhatsApp de 3 líneas. Reglas OBLIGATORIAS: (1) PRIMERA LÍNEA debe ser un gancho sobre algo concreto que viste de ELLOS, tipo 'Vi que hacen X para Y personas'. NUNCA empieces con 'Tenemos 3 hectáreas' ni menciones features del parque en la primera línea. (2) SEGUNDA LÍNEA: planteá el problema que resolvemos ('si necesitan más espacio', 'si el venue les queda chico', 'si buscan algo outdoor masivo'). (3) TERCERA LÍNEA: llamado a la acción ('conversemos', 'te tinca verlo'). Tono directo, chileno, informal. Firmá: 'soy Alberto del Parque Hípico La Montaña'. PROHIBIDO mencionar '3 hectáreas', 'trifásica' o '5.000 personas' a menos que sea estrictamente necesario para responder una pregunta implícita del lead."
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2000 }
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${geminiRes.status}` }, { status: 502 });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let cleaned = rawText.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1].split('```')[0].trim();
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1].split('```')[0].trim();
    }

    if (!cleaned) {
      return NextResponse.json({ error: 'Gemini returned empty response' }, { status: 502 });
    }

    let result: any;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse', raw: cleaned.substring(0, 300) }, { status: 502 });
    }

    const guion = result.guion?.trim() || '';
    const perfil = result.perfil?.trim() || '';

    if (!guion) {
      return NextResponse.json({ error: 'Gemini returned empty guion' }, { status: 502 });
    }

    // Guardar en BD con admin
    const admin = getSupabaseAdmin();
    await admin.from('leads').update({
      guion: guion,
      raw_data: JSON.stringify({ ...(lead.raw_data ? JSON.parse(lead.raw_data) : {}), perfil_ia: perfil }),
      updated_at: new Date().toISOString()
    }).eq('id', lead_id);

    return NextResponse.json({ success: true, guion, perfil });
  } catch (error: any) {
    console.error('Generar Guion Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
