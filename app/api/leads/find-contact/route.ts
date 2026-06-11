import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase';

function normalizePhone(tel: string): string {
  let digits = tel.replace(/\D/g, '');
  if (digits.startsWith('569')) return '+' + digits;
  if (digits.startsWith('9') && digits.length <= 9) return '+56' + digits;
  if (digits.length === 8) return '+569' + digits;
  return digits;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase(); // solo lectura para obtener el lead

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return NextResponse.json({ error: 'Falta lead_id' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    // Obtener el lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const prompt = `Busca exhaustivamente en internet TODOS los datos de contacto de esta empresa: "${lead.empresa}" en ${lead.ubicacion || 'Chile'}, Región de la Araucanía.

Buscá en TODAS estas fuentes:
- Google Maps y Google My Business
- Su sitio web oficial (${lead.website || 'buscá el sitio web también'})
- Instagram, Facebook, TikTok
- Páginas amarillas, guías locales, datos de contacto en portales chilenos
- Passline, Welive, u otras ticketeras chilenas si es un centro de eventos

Necesito encontrar:
- Teléfono de contacto (prioridad máxima, formato chileno +56 9)
- Email de contacto
- Instagram (nombre de usuario o URL)
- Facebook (nombre o URL)
- TikTok (nombre o URL)

Si el teléfono no está disponible, al menos encontrá email e Instagram. Buscá con DETALLE, no te rindas rápido.

Responde SOLO un JSON: {"telefono":"","email":"","instagram":"","facebook":"","tiktok":"","website":""}. Strings vacíos si no encontrás. Sin Markdown.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2000 }
        }),
      }
    );

    if (!geminiRes.ok) {
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

    let contacto: any;
    try {
      contacto = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse', raw: cleaned.substring(0, 200) }, { status: 502 });
    }

    // Actualizar lead con los datos encontrados
    const updates: any = { updated_at: new Date().toISOString() };
    if (contacto.telefono) updates.telefono = normalizePhone(contacto.telefono);
    if (contacto.email) updates.email = contacto.email;
    if (contacto.website) updates.website = contacto.website;
    if (contacto.instagram) updates.instagram = contacto.instagram;
    if (contacto.facebook) updates.facebook = contacto.facebook;
    if (contacto.tiktok) updates.tiktok = contacto.tiktok;

    const admin = getSupabaseAdmin();
    await admin.from('leads').update(updates).eq('id', lead_id);

    return NextResponse.json({ success: true, contacto, lead_id });
  } catch (error: any) {
    console.error('Find Contact Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
