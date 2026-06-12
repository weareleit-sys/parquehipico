import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cleanSocialHandle, cleanWebsite } from '@/lib/lead-links';

function normalizePhone(tel: string): string {
  if (!tel || !tel.trim()) return '';
  let digits = tel.replace(/\D/g, '');
  if (digits.startsWith('569')) return '+' + digits;
  if (digits.startsWith('9') && digits.length === 9) return '+56' + digits;
  if (digits.startsWith('56')) return '+' + digits;
  return digits ? '+' + digits : '';
}

function cleanGeminiJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.includes('```json')) {
    cleaned = cleaned.split('```json')[1].split('```')[0].trim();
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.split('```')[1].split('```')[0].trim();
  }
  return cleaned;
}

function parseContactObject(text: string): any {
  const cleaned = cleanGeminiJson(text);
  if (!cleaned) throw new Error('Gemini returned empty response');

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Failed to parse Gemini response');
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();

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
- Instagram (solo usuario o URL real visible; si no hay fuente confiable, vacío)
- Facebook (solo usuario/página o URL real visible; si no hay fuente confiable, vacío)
- TikTok (solo usuario o URL real visible; si no hay fuente confiable, vacío)

Si el teléfono no está disponible, al menos encontrá email e Instagram. Buscá con DETALLE, no te rindas rápido.
No inventes redes sociales y no mezcles URLs, por ejemplo nunca respondas "instagram.com/https://...".

Responde SOLO un JSON: {"telefono":"","email":"","instagram":"","facebook":"","tiktok":"","website":""}. Strings vacíos si no encontrás. Sin Markdown.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let geminiRes: Response;
    try {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 2000 }
          }),
          signal: controller.signal,
        }
      );
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return NextResponse.json({ error: 'La búsqueda de contacto tardó más de 60 segundos. Reintentá más tarde.' }, { status: 504 });
      }
      return NextResponse.json({ error: 'Error de conexión con Gemini.' }, { status: 502 });
    }

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      return NextResponse.json({ error: `Gemini API error: ${geminiRes.status}` }, { status: 502 });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let contacto: any;
    try {
      contacto = parseContactObject(rawText);
    } catch (parseError: any) {
      return NextResponse.json({ error: parseError.message || 'Failed to parse', raw: cleanGeminiJson(rawText).substring(0, 200) }, { status: 502 });
    }

    // Actualizar lead con los datos encontrados
    const updates: any = { updated_at: new Date().toISOString() };
    if (contacto.telefono) updates.telefono = normalizePhone(contacto.telefono);
    if (contacto.email) updates.email = contacto.email;
    const website = cleanWebsite(contacto.website);
    const instagram = cleanSocialHandle(contacto.instagram, 'instagram')
      || cleanSocialHandle(contacto.website, 'instagram');
    const facebook = cleanSocialHandle(contacto.facebook, 'facebook')
      || cleanSocialHandle(contacto.website, 'facebook');
    const tiktok = cleanSocialHandle(contacto.tiktok, 'tiktok')
      || cleanSocialHandle(contacto.website, 'tiktok');
    if (contacto.website !== undefined) updates.website = website;
    if (contacto.instagram !== undefined || instagram) updates.instagram = instagram;
    if (contacto.facebook !== undefined || facebook) updates.facebook = facebook;
    if (contacto.tiktok !== undefined || tiktok) updates.tiktok = tiktok;

    const admin = getSupabaseAdmin();
    const { error: updateError } = await admin.from('leads').update(updates).eq('id', lead_id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contacto: {
        ...contacto,
        website,
        instagram,
        facebook,
        tiktok,
      },
      lead_id
    });
  } catch (error: any) {
    console.error('Find Contact Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
