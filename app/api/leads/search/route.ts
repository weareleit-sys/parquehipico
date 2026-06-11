import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { getLeadCategoryDefinition, normalizeLeadCategoryValue } from '@/lib/lead-categories';

const ALLOWED_SECTORES = new Set(['temuco', 'lacustre', 'sur', 'costa', 'norte', 'lagos', 'externo']);

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

function cleanGeminiJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.includes('```json')) {
    cleaned = cleaned.split('```json')[1].split('```')[0].trim();
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.split('```')[1].split('```')[0].trim();
  }
  return cleaned;
}

function parseLeadArray(text: string): any[] {
  const cleaned = cleanGeminiJson(text);
  if (!cleaned) throw new Error('Gemini returned empty response');

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Failed to parse Gemini response');
  }
}

function clampSearchLimit(value: any): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 10;
  return Math.min(parsed, 10);
}

function sanitizePromptText(value: any, fallback: string): string {
  const text = String(value || fallback)
    .replace(/[\r\n{}[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return text || fallback;
}

function isProductOnlyFamilyEventLead(lead: any): boolean {
  const text = `${lead?.empresa || ''} ${lead?.website || ''} ${lead?.email || ''} ${lead?.ubicacion || ''}`.toLowerCase();
  const banned = [
    'cotillon', 'cotillón', 'globo', 'globos', 'torta', 'tortas', 'piñata', 'pinata',
    'piñateria', 'piñatería', 'dulceria', 'dulcería', 'jugueteria', 'juguetería',
    'regalos', 'sorpresas', 'articulos de fiesta', 'artículos de fiesta',
  ];
  return banned.some(word => text.includes(word));
}

function hasLocalSignal(text: string): boolean {
  return /(villarrica|puc[oó]n|lican ray|molco|caburgua|curarrehue|coñaripe|conaripe|araucan[ií]a|temuco|padre las casas|vilc[uú]n|freire|pitrufqu[eé]n|nueva imperial|cholchol|galvarino|caj[oó]n|loncoche|gorbea|tolt[eé]n|teodoro schmidt|carahue|puerto saavedra|victoria|curacaut[ií]n|lautaro|collipulli|angol|lonquimay|panguipulli|lanco|mariquina|zona sur|sur de chile|la araucan[ií]a)/.test(text);
}

function isRemoteOnlyLead(text: string): boolean {
  const remote = /(santiago|valpara[ií]so|viña|vina|ohiggins|o'higgins|rancagua|concepci[oó]n|la serena|chile$)/.test(text);
  return remote && !hasLocalSignal(text);
}

function isTourismOrVenueSignal(text: string): boolean {
  return /(hotel|cabaña|cabañas|cabanas|hostal|turismo|tur[ií]stic|viajes|operador|outdoor|aventura|centro de eventos|sal[oó]n|venue|resort|camping|restaurant|restaurante|parque|termas|experiencia)/.test(text);
}

function buildLeadQuality(lead: any, categoria: string, cleanTel: string, site: string, isWap: boolean) {
  const text = `${lead?.empresa || ''} ${lead?.website || ''} ${lead?.email || ''} ${lead?.ubicacion || ''} ${lead?.instagram || ''} ${lead?.facebook || ''}`.toLowerCase();
  const notes: string[] = [];
  let score = 5;
  let role = 'cliente directo';

  if (isWap) { score += 2; notes.push('WhatsApp'); }
  else if (cleanTel) { score += 1; notes.push('teléfono fijo'); }
  if (site) { score += 1; notes.push('web'); }
  if (lead?.email) { score += 1; notes.push('email'); }
  if (lead?.instagram || lead?.facebook || lead?.tiktok) { score += 1; notes.push('redes'); }

  if (hasLocalSignal(text)) {
    score += 1;
    notes.push('zona útil');
  }
  if (isRemoteOnlyLead(text)) {
    role = 'fuera de zona / revisar';
    score -= 5;
    notes.push('sin señal clara en Araucanía');
  }

  if (isTourismOrVenueSignal(text)) {
    role = 'aliado o venue complementario';
    score += categoria === 'turismo' ? 2 : 1;
    notes.push('podría derivar o necesitar espacio mayor');
  }

  if (categoria === 'turismo' && /productora|producciones|eventos/.test(text) && !isTourismOrVenueSignal(text)) {
    role = 'revisar categoría';
    score -= 3;
    notes.push('parece productora, no turismo/venue');
  }

  if (/(productora|producciones|banqueter|catering|planner|eventos|fiestas|celebraciones)/.test(text)) {
    score += 2;
    notes.push('organiza eventos');
  }
  if (categoria === 'comunidad' && /(club|junta de vecinos|iglesia|parroquia|fundaci[oó]n|ong|adulto mayor|c[aá]mara|asociaci[oó]n|agrupaci[oó]n|comunidad)/.test(text)) {
    role = 'organización comunitaria';
    score += 2;
    notes.push('convoca comunidad');
  }
  if (categoria === 'educacion' && /(colegio|liceo|escuela|universidad|instituto|jard[ií]n|fundaci[oó]n|centro de padres)/.test(text)) {
    role = 'institución convocante';
    score += 2;
    notes.push('convoca comunidad');
  }
  if (categoria === 'municipal' && /(municipal|gobierno|delegaci[oó]n|seremi|corporaci[oó]n|servicio p[uú]blico|cultura|turismo)/.test(text)) {
    role = 'institución pública';
    score += 2;
    notes.push('organiza actividades públicas');
  }

  score = Math.max(1, Math.min(10, score));
  const tier = score >= 8 ? 'alta' : score >= 6 ? 'media' : 'baja';

  return { score, tier, role, notes };
}

function inferLeadSector(lead: any, requestedSector: string): string {
  const text = `${lead?.empresa || ''} ${lead?.ubicacion || ''} ${lead?.website || ''} ${lead?.email || ''}`.toLowerCase();
  if (isRemoteOnlyLead(text)) return 'externo';
  if (/(villarrica|puc[oó]n|lican ray|molco|caburgua|curarrehue|coñaripe|conaripe)/.test(text)) return 'lacustre';
  if (/(temuco|padre las casas|vilc[uú]n|freire|pitrufqu[eé]n|nueva imperial|cholchol|galvarino|caj[oó]n)/.test(text)) return 'temuco';
  if (/(loncoche|gorbea|tolt[eé]n|teodoro schmidt)/.test(text)) return 'sur';
  if (/(carahue|puerto saavedra)/.test(text)) return 'costa';
  if (/(victoria|curacaut[ií]n|lautaro|collipulli|angol|lonquimay)/.test(text)) return 'norte';
  if (/(panguipulli|lanco|mariquina)/.test(text)) return 'lagos';
  return requestedSector;
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
    const normalizedCategoria = normalizeLeadCategoryValue(categoria);
    const categoryDefinition = getLeadCategoryDefinition(normalizedCategoria);
    if (!categoryDefinition) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });
    }
    const safeLimit = clampSearchLimit(limit);
    const safeUbicacion = sanitizePromptText(ubicacion, 'Temuco');
    const safeSector = ALLOWED_SECTORES.has(sector) ? sector : 'temuco';

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const prompt = `Soy Alberto del Parque Hípico La Montaña, un recinto outdoor en Villarrica. ARRENDAMOS EL TERRENO/ESPACIO FÍSICO para eventos masivos: 3 hectáreas planas (30.000 m²), capacidad 5.000+ personas, 400+ estacionamientos, luz trifásica T1. SOMOS UN VENUE, no hacemos shows de caballos. El nombre es histórico.

Busca hasta ${safeLimit} empresas, productoras u organizaciones reales en ${safeUbicacion}, Región de la Araucanía, que podrían NECESITAR arrendar un espacio outdoor masivo. La categoría es "${normalizedCategoria}".
Prioriza contactos de Villarrica, Pucón, Temuco y comunas cercanas. Si no hay suficientes leads locales buenos, devuelve menos resultados antes que rellenar con empresas lejanas. Solo incluye empresas de Santiago, Valparaíso u otras regiones si su información muestra claramente que trabajan en la Araucanía o zona sur.

Definición de la categoría "${categoryDefinition.label}": ${categoryDefinition.searchPrompt}

IMPORTANTE: Busca teléfonos de contacto REALES, preferentemente móviles con WhatsApp (+56 9). Busca en Google Maps, páginas amarillas, Facebook, Instagram. Si no encuentras teléfono, déjalo vacío "".
El sitio web debe ser un dominio real (ej: "www.empresa.cl"), NO pongas emails como website. Si hay email, usa campo "email".
Instagram, Facebook y TikTok: usuario o URL real. Si no encuentras, string vacío "".

Responde SOLO un JSON array sin Markdown con objetos: {"empresa","telefono","website","email","ubicacion","instagram","facebook","tiktok"}`;

    const controller = new AbortController();
    const timeoutMs = 75000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
            generationConfig: { temperature: 0.1, maxOutputTokens: 8000 }
          }),
          signal: controller.signal,
        }
      );
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return NextResponse.json({ error: 'La búsqueda tardó más de 75 segundos. Probá con menos resultados o una ciudad más grande.' }, { status: 504 });
      }
      return NextResponse.json({ error: 'Error de conexión con Gemini. Revisá tu internet.' }, { status: 502 });
    }

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      return NextResponse.json({ error: `Gemini no respondió correctamente (${geminiRes.status}). Reintentá en unos segundos.` }, { status: 502 });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let leads: any[];
    try {
      leads = parseLeadArray(rawText);
    } catch (parseError: any) {
      return NextResponse.json({
        error: parseError.message || 'Failed to parse Gemini response',
        finishReason: data.candidates?.[0]?.finishReason || null,
        raw: cleanGeminiJson(rawText).substring(0, 500)
      }, { status: 502 });
    }

    // Validar, limpiar y guardar cada lead
    const saved: any[] = [];
    const seenNames = new Set<string>();
    const seenPhones = new Set<string>();

    for (let i = 0; i < Math.min(leads.length, safeLimit); i++) {
      const lead = leads[i];
      const normalizedName = normalizeName(lead.empresa);
      const empresaOriginal = (lead.empresa || '').trim();
      const rawTel = (lead.telefono || '').trim();
      const cleanPhone = rawTel.replace(/\D/g, '');

      if (normalizedCategoria === 'cumpleanos' && isProductOnlyFamilyEventLead(lead)) {
        console.warn(`[QUALITY] Saltando tienda/producto no apto para eventos familiares: ${empresaOriginal}`);
        continue;
      }

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
      const quality = buildLeadQuality(lead, normalizedCategoria, cleanTel, site, isWap);
      const leadSector = inferLeadSector(lead, safeSector);

      let finalEmail = email;
      if (!finalEmail && lead.website && lead.website.includes('@')) {
        if (isValidEmail(lead.website)) finalEmail = lead.website.trim();
      }

      // Si ya existe, hacer UPDATE (no duplicar)
      const recordId = existingDb?.id || null;
      const updateData: any = {
        categoria: normalizedCategoria,
        categorias: [normalizedCategoria],
        telefono: cleanTel || existingDb?.telefono || '',
        website: site || existingDb?.website || '',
        email: finalEmail || existingDb?.email || '',
        ubicacion: lead.ubicacion || '',
        sector: leadSector,
        instagram: (lead.instagram || '').trim() || existingDb?.instagram || '',
        facebook: (lead.facebook || '').trim() || existingDb?.facebook || '',
        tiktok: (lead.tiktok || '').trim() || existingDb?.tiktok || '',
        score: quality.score,
        raw_data: JSON.stringify({
          ...lead,
          _validated: true,
          _isWhatsApp: isWap,
          _websiteOk: !!site,
          _qualityScore: quality.score,
          _qualityTier: quality.tier,
          _leadRole: quality.role,
          _qualityNotes: quality.notes,
        }),
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
        sector: leadSector,
        email: finalEmail,
        website: site,
        telefono: cleanTel,
        _isWhatsApp: isWap,
        _websiteOk: !!site,
        _qualityScore: quality.score,
        _qualityTier: quality.tier,
        _leadRole: quality.role,
        _qualityNotes: quality.notes,
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
