import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  try {
    const { categoria, ubicacion = 'Temuco', sector = 'temuco', limit = 10 } = await req.json();

    if (!categoria) {
      return NextResponse.json({ error: 'Falta campo requerido: categoria' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const prompt = `Busca ${limit} empresas, negocios o servicios reales en ${ubicacion}, Región de la Araucanía, Chile. La categoría es "${categoria}".

Si la categoría es "productoras": busca productoras de eventos, festivales, conciertos, ferias.
Si la categoría es "corporativo": busca empresas grandes que hagan team building, cenas de fin de año, convenciones.
Si la categoría es "matrimonios": busca wedding planners, centros de eventos para bodas, organizadores de matrimonios.
Si la categoría es "cumpleanos": busca salones de eventos, quintas de recreo, lugares para fiestas infantiles y cumpleaños.
Si la categoría es "municipal": busca municipalidades, corporaciones de turismo, organismos públicos que organicen ferias o eventos masivos.

Para cada resultado encuentra: nombre de la empresa/organización, teléfono de contacto, sitio web, ciudad donde operan, y sus redes sociales (instagram, facebook, tiktok si las tienen). Responde SOLO un JSON array de objetos con las llaves "empresa", "telefono", "website", "ubicacion", "instagram", "facebook", "tiktok" sin formato adicional de Markdown.`;

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
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${geminiRes.status} ${errText}` }, { status: 502 });
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
      return NextResponse.json({ error: 'Gemini returned empty response', raw: rawText.substring(0, 300) }, { status: 502 });
    }

    let leads: any[];
    try {
      leads = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse Gemini response', raw: cleaned.substring(0, 300) }, { status: 502 });
    }

    const saved: any[] = [];
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
          sector: sector,
          instagram: lead.instagram || '',
          facebook: lead.facebook || '',
          tiktok: lead.tiktok || '',
          raw_data: JSON.stringify(lead),
          estado_lead: 'nuevo'
        }, { onConflict: 'empresa' })
        .select('id')
        .single();

      if (upsertError) {
        console.error(`Error saving lead ${lead.empresa}:`, upsertError.message);
        continue;
      }

      saved.push({ ...lead, id: savedLead?.id, sector });
    }

    return NextResponse.json({
      success: true,
      leads: saved,
      total: saved.length
    });
  } catch (error: any) {
    console.error('Search Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
