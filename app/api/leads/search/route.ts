import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

// Normalizar nombre de empresa para deduplicación
function normalizeName(name: string): string {
  return (name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // solo letras, números, espacios
    .replace(/\s+/g, ' ')       // normalizar espacios
    .trim();
}

// Validar email
function isValidEmail(email: string): boolean {
  return !!(email && email.includes('@') && email.includes('.') && !email.includes(' '));
}

// Detectar si un teléfono es móvil chileno (compatible con WhatsApp)
function isWhatsAppCompatible(tel: string): boolean {
  const digits = tel.replace(/\D/g, '');
  if (digits.startsWith('569')) return true;
  if (digits.startsWith('9') && digits.length === 9) return true;
  return false;
}

// Normalizar teléfono chileno a formato internacional
function normalizePhone(tel: string): string {
  if (!tel || !tel.trim()) return '';
  const phones = tel.split(/[,;\/]\s*/);
  let best = phones[0];
  for (const p of phones) {
    const d = p.replace(/\D/g, '');
    if (d.startsWith('569') || (d.startsWith('9') && d.length <= 9)) {
      best = p; break;
    }
  }
  let digits = best.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('569')) return '+' + digits;
  if (digits.startsWith('9') && digits.length === 9) return '+56' + digits;
  if (digits.startsWith('56')) return '+' + digits;
  return '+' + digits;
}

// Limpiar website (detectar emails metidos como web, urls inválidas)
function cleanWebsite(url: string): string {
  if (!url) return '';
  const trimmed = url.trim().toLowerCase();
  // Detectar emails puestos como website
  if (trimmed.includes('@') && !trimmed.startsWith('http')) return '';
  // Quitar prefijos raros
  let clean = trimmed.replace(/^(https?:\/\/)?(www\.)?/, '');
  clean = clean.replace(/\/$/, ''); // quitar slash final
  // Si no tiene .algo, probablemente no es un dominio real
  if (!clean.includes('.') || clean.length < 4) return '';
  return clean;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const { allowed, remaining } = await checkRateLimit(ip, 'search');
  if (!allowed) {
    return NextResponse.json({ error: `Límite de búsquedas alcanzado. Esperá unos minutos.` }, { status: 429 });
  }

  try {
    const { categoria, ubicacion = 'Temuco', sector = 'temuco', limit = 10 } = await req.json();

    if (!categoria) {
      return NextResponse.json({ error: 'Falta campo requerido: categoria' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const prompt = `Soy Alberto del Parque Hípico La Montaña, un recinto outdoor en Villarrica. ARRENDAMOS EL TERRENO/ESPACIO FÍSICO para eventos masivos: 3 hectáreas planas (30.000 m²), capacidad 5.000+ personas, 400+ estacionamientos, luz trifásica T1. SOMOS UN VENUE, no hacemos shows de caballos. El nombre es histórico.

Busca ${limit} empresas, productoras u organizaciones reales en ${ubicacion}, Región de la Araucanía, que podrían NECESITAR arrendar un espacio outdoor masivo. La categoría es "${categoria}".

Si la categoría es "productoras": busca productoras de eventos, festivales, conciertos. Necesitan venues para los eventos de SUS clientes. Nosotros somos el venue.
Si la categoría es "corporativo": busca empresas que organicen team building, cenas de fin de año, convenciones o eventos corporativos. EXCLUYE empresas agrícolas, ganaderas, forestales o industriales que no organizan eventos.
Si la categoría es "matrimonios": busca wedding planners, centros de eventos, organizadores de bodas que busquen locaciones outdoor.
Si la categoría es "cumpleanos": busca SOLO centros de eventos, quintas de recreo, salones de fiesta, animadores infantiles y organizadores de celebraciones. EXCLUYE tiendas de artículos para fiestas, cotillón, decoración y venta de productos.
Si la categoría es "municipal": busca municipalidades, corporaciones de turismo y cultura que organicen ferias costumbristas, eventos masivos.

IMPORTANTE: Busca teléfonos de contacto REALES, preferentemente móviles con WhatsApp (+56 9). Busca en Google Maps, páginas amarillas, Facebook, Instagram. Si no encuentras teléfono, déjalo vacío "".
El sitio web debe ser un dominio real (ej: "www.empresa.cl"), NO pongas emails como website. Si hay email, usa campo "email".
Instagram, Facebook y TikTok: usuario o URL real. Si no encuentras, string vacío "".

Responde SOLO un JSON array sin Markdown con objetos: {"empresa","telefono","website","email","ubicacion","instagram","facebook","tiktok"}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

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
            generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
          }),
          signal: controller.signal,
        }
      );
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return NextResponse.json({ error: 'La búsqueda tardó más de 45 segundos. Probá con menos resultados o una ciudad más grande.' }, { status: 504 });
      }
      return NextResponse.json({ error: 'Error de conexión con Gemini. Revisá tu internet.' }, { status: 502 });
    }

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      return NextResponse.json({ error: `Gemini no respondió correctamente (${geminiRes.status}). Reintentá en unos segundos.` }, { status: 502 });
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

    // Validar, limpiar y guardar cada lead
    const saved: any[] = [];
    const seenNames = new Set<string>();
    const seenPhones = new Set<string>();

    for (let i = 0; i < Math.min(leads.length, limit); i++) {
      const lead = leads[i];
      const normalizedName = normalizeName(lead.empresa);
      const empresaOriginal = (lead.empresa || '').trim();
      const rawTel = (lead.telefono || '').trim();
      const cleanPhone = rawTel.replace(/\D/g, '');

      // Saltar duplicados por nombre en esta misma búsqueda
      if (seenNames.has(normalizedName)) {
        console.warn(`[DEDUP] Saltando duplicado por nombre: ${empresaOriginal}`);
        continue;
      }
      // Saltar duplicados por teléfono en esta misma búsqueda
      if (cleanPhone && seenPhones.has(cleanPhone)) {
        console.warn(`[DEDUP] Saltando duplicado por teléfono: ${empresaOriginal} (${cleanPhone})`);
        continue;
      }
      seenNames.add(normalizedName);
      if (cleanPhone) seenPhones.add(cleanPhone);

      // Verificar si ya existe en BD por nombre similar o mismo teléfono
      let existingDb: any = null;
      const { data: byName } = await supabase
        .from('leads')
        .select('id, empresa, telefono, website, email, instagram, facebook, tiktok')
        .ilike('empresa', `%${normalizedName.substring(0, Math.min(20, normalizedName.length))}%`)
        .limit(1);
      if (byName && byName.length > 0) {
        existingDb = byName[0];
      } else if (cleanPhone) {
        const { data: byPhone } = await supabase
          .from('leads')
          .select('id, empresa, telefono, website, email, instagram, facebook, tiktok')
          .eq('telefono', `+${cleanPhone}`)
          .limit(1);
        if (byPhone && byPhone.length > 0) existingDb = byPhone[0];
      }

      // Validar y limpiar campos
      const email = isValidEmail(lead.email) ? lead.email.trim() : '';
      const cleanTel = normalizePhone(rawTel);
      const isWap = isWhatsAppCompatible(rawTel);
      const site = cleanWebsite(lead.website || '');

      let finalEmail = email;
      if (!finalEmail && lead.website && lead.website.includes('@')) {
        if (isValidEmail(lead.website)) finalEmail = lead.website.trim();
      }

      // Si ya existe, hacer UPDATE (no duplicar)
      const recordId = existingDb?.id || null;
      const updateData: any = {
        categoria: categoria,
        categorias: [categoria],
        telefono: cleanTel || existingDb?.telefono || '',
        website: site || existingDb?.website || '',
        email: finalEmail || existingDb?.email || '',
        ubicacion: lead.ubicacion || '',
        sector: sector,
        instagram: (lead.instagram || '').trim() || existingDb?.instagram || '',
        facebook: (lead.facebook || '').trim() || existingDb?.facebook || '',
        tiktok: (lead.tiktok || '').trim() || existingDb?.tiktok || '',
        raw_data: JSON.stringify({ ...lead, _validated: true, _isWhatsApp: isWap, _websiteOk: !!site }),
        estado_lead: recordId ? undefined : 'nuevo',
        web_status: isWap ? (site ? 'activa' : 'sin_web') : 'fijo',
        updated_at: new Date().toISOString(),
      };

      let finalId: string;
      if (recordId) {
        // Actualizar existente (conservar el nombre original que tiene en BD)
        const { error: updateError } = await supabase
          .from('leads').update(updateData).eq('id', recordId);
        if (updateError) {
          console.error(`Error updating lead ${empresaOriginal}:`, updateError.message);
          continue;
        }
        finalId = recordId;
      } else {
        // Insertar nuevo
        const { data: savedLead, error: upsertError } = await supabase
          .from('leads')
          .upsert({
            empresa: empresaOriginal,
            ...updateData,
          }, { onConflict: 'empresa' })
          .select('id')
          .single();

        if (upsertError) {
          console.error(`Error saving lead ${empresaOriginal}:`, upsertError.message);
          continue;
        }
        finalId = savedLead?.id;
      }

      saved.push({
        ...lead,
        id: finalId,
        sector,
        email: finalEmail,
        website: site,
        telefono: cleanTel,
        _isWhatsApp: isWap,
        _websiteOk: !!site,
      });
    }

    return NextResponse.json({
      success: true,
      leads: saved,
      total: saved.length,
      remaining_searches: remaining,
      stats: {
        withPhone: saved.filter(l => l.telefono).length,
        withWhatsApp: saved.filter((l: any) => l._isWhatsApp).length,
        withWebsite: saved.filter((l: any) => l._websiteOk).length,
        withEmail: saved.filter(l => l.email).length,
      }
    });
  } catch (error: any) {
    console.error('Search Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
