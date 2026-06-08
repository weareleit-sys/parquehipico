import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

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

// Detectar si un teléfono es WhatsApp (+56 9 en Chile)
function isWhatsAppCompatible(tel: string): boolean {
  const digits = tel.replace(/\D/g, '');
  return digits.startsWith('569') || digits.length === 9;
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

IMPORTANTE: El teléfono de contacto es OBLIGATORIO. Busca en Google, Facebook, Instagram, páginas amarillas, guías locales hasta encontrar un número. Prefiere teléfonos móviles chilenos (+56 9). Si absolutamente no encuentras teléfono, usa string vacío "".

El sitio web debe ser un dominio real (ej: "www.empresa.cl"), NO pongas emails como website.
Si encuentras email de contacto, agrégalo en un campo "email" aparte.

Para cada resultado incluye: empresa, telefono, website, email, ubicacion, instagram, facebook, tiktok (string vacío si no encuentra). Responde SOLO un JSON array sin Markdown.`;

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

    // Validar, limpiar y guardar cada lead
    const saved: any[] = [];
    const seenNames = new Set<string>();

    for (let i = 0; i < Math.min(leads.length, limit); i++) {
      const lead = leads[i];
      const normalizedName = normalizeName(lead.empresa);
      const empresaOriginal = (lead.empresa || '').trim();

      // Saltar duplicados en esta misma búsqueda
      if (seenNames.has(normalizedName)) {
        console.warn(`[DEDUP] Saltando duplicado en búsqueda: ${empresaOriginal}`);
        continue;
      }
      seenNames.add(normalizedName);

      // Verificar si ya existe un lead similar en la BD
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('id, empresa, telefono, website, email, instagram, facebook, tiktok')
        .ilike('empresa', `%${normalizedName.substring(0, Math.min(20, normalizedName.length))}%`)
        .limit(1);

      // Validar y limpiar campos
      const email = isValidEmail(lead.email) ? lead.email.trim() : '';
      const cleanTel = (lead.telefono || '').trim();
      const isWap = isWhatsAppCompatible(cleanTel);
      const site = cleanWebsite(lead.website || '');

      let finalEmail = email;
      if (!finalEmail && lead.website && lead.website.includes('@')) {
        if (isValidEmail(lead.website)) finalEmail = lead.website.trim();
      }

      // Si ya existe, hacer UPDATE (no duplicar)
      const recordId = existingLeads && existingLeads.length > 0 ? existingLeads[0].id : null;
      const updateData: any = {
        categoria: categoria,
        categorias: [categoria],
        telefono: cleanTel || (recordId ? existingLeads?.[0]?.telefono : ''),
        website: site || (recordId ? existingLeads?.[0]?.website : ''),
        email: finalEmail || (recordId ? existingLeads?.[0]?.email : ''),
        ubicacion: lead.ubicacion || '',
        sector: sector,
        instagram: (lead.instagram || '').trim() || (recordId ? existingLeads?.[0]?.instagram : ''),
        facebook: (lead.facebook || '').trim() || (recordId ? existingLeads?.[0]?.facebook : ''),
        tiktok: (lead.tiktok || '').trim() || (recordId ? existingLeads?.[0]?.tiktok : ''),
        raw_data: JSON.stringify({ ...lead, _validated: true, _isWhatsApp: isWap, _websiteOk: !!site }),
        estado_lead: recordId ? undefined : 'nuevo', // no pisar estado de leads existentes
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
