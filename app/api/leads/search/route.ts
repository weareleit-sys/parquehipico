import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { getLeadCategoryDefinition, normalizeLeadCategoryValue } from '@/lib/lead-categories';
import { cleanSocialHandle, cleanWebsite } from '@/lib/lead-links';
import { verifyLeadData } from '@/lib/lead-verification';

const ALLOWED_SECTORES = new Set(['temuco', 'lacustre', 'sur', 'costa', 'norte', 'lagos', 'externo']);
const LEAD_LOOKUP_FIELDS = 'id, empresa, estado_lead, telefono, website, email, instagram, facebook, tiktok, guion, raw_data, web_status';

// Normalizar nombre de empresa para deduplicación
function normalizeName(name: string): string {
  return (name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // solo letras, números, espacios
    .replace(/\s+/g, ' ')       // normalizar espacios
    .trim();
}

async function findExistingLeadByName(supabase: any, normalizedName: string) {
  if (!normalizedName) return null;
  const words = normalizedName
    .split(' ')
    .filter(word => word.length >= 4)
    .slice(0, 4);

  let query = supabase.from('leads').select(LEAD_LOOKUP_FIELDS).limit(25);
  if (words.length > 0) {
    query = query.or(words.map(word => `empresa.ilike.%${word}%`).join(','));
  } else {
    query = query.ilike('empresa', `%${normalizedName.substring(0, Math.min(20, normalizedName.length))}%`);
  }

  const { data } = await query;
  const exactMatches = data?.filter((lead: any) => normalizeName(lead.empresa) === normalizedName) || [];
  return exactMatches.find((lead: any) => lead.estado_lead !== 'descartado') || exactMatches[0] || null;
}

// Validar email
function isValidEmail(email: string): boolean {
  return !!(email && email.includes('@') && email.includes('.') && !email.includes(' '));
}

// Detectar si un teléfono es móvil chileno (compatible con WhatsApp)
function splitPhones(phone: string): string[] {
  return (phone || '').split(/[,;\/]\s*/).filter(Boolean);
}

function phoneDigits(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

function isPlaceholderPhone(phone: string): boolean {
  return !phone || phone.includes('...') || phone.trim() === '+';
}

function isMobileDigits(digits: string): boolean {
  return (digits.startsWith('569') && digits.length === 11) || (digits.startsWith('9') && digits.length === 9);
}

function isCallableDigits(digits: string): boolean {
  if (isMobileDigits(digits)) return true;
  if (digits.startsWith('56')) return digits.length >= 10 && digits.length <= 11;
  if (digits.length === 8 && digits.startsWith('9')) return false;
  return digits.length >= 8 && digits.length <= 9;
}

function isWhatsAppCompatible(tel: string): boolean {
  return splitPhones(tel).some(phone => !isPlaceholderPhone(phone) && isMobileDigits(phoneDigits(phone)));
}

// Normalizar teléfono chileno a formato internacional
function normalizePhone(tel: string): string {
  if (!tel || !tel.trim()) return '';
  const phones = splitPhones(tel).filter(phone => !isPlaceholderPhone(phone));
  const best = phones.find(phone => isMobileDigits(phoneDigits(phone)))
    || phones.find(phone => isCallableDigits(phoneDigits(phone)))
    || '';
  let digits = phoneDigits(best);
  if (!digits) return '';
  if (digits.startsWith('569') && digits.length === 11) return '+' + digits;
  if (digits.startsWith('9') && digits.length === 9) return '+56' + digits;
  if (digits.startsWith('56') && digits.length >= 10 && digits.length <= 11) return '+' + digits;
  if (digits.length === 8 && digits.startsWith('9')) return '';
  if (digits.length >= 8 && digits.length <= 9) return '+56' + digits;
  return '';
}

async function findExistingLeadByPhone(supabase: any, phone: string) {
  const digits = phoneDigits(phone);
  if (digits.length < 8) return null;

  const { data } = await supabase
    .from('leads')
    .select(LEAD_LOOKUP_FIELDS)
    .not('telefono', 'is', null)
    .limit(500);

  const matches = (data || []).filter((lead: any) => {
    const existingDigits = phoneDigits(lead.telefono);
    if (existingDigits.length < 8) return false;
    return existingDigits === digits ||
      existingDigits.endsWith(digits.slice(-8)) ||
      digits.endsWith(existingDigits.slice(-8));
  });

  return matches.find((lead: any) => lead.estado_lead !== 'descartado') || matches[0] || null;
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

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeSearchText(value: any): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isProductOnlyFamilyEventLead(lead: any): boolean {
  const text = normalizeSearchText(`${lead?.empresa || ''} ${lead?.actividad || ''} ${lead?.motivo || ''} ${lead?.descripcion || ''} ${lead?.website || ''} ${lead?.email || ''} ${lead?.ubicacion || ''}`);
  const banned = [
    'cotillon', 'globo', 'globos', 'torta', 'tortas', 'pinata', 'pinateria',
    'dulceria', 'jugueteria', 'regalo', 'regalos', 'sorpresas',
    'articulos de fiesta', 'decoracion', 'decoraciones', 'balloon', 'cake',
    'pasteleria', 'reposteria', 'inflable', 'inflables', 'disfraz', 'disfraces',
  ];
  return banned.some(word => text.includes(word));
}

function hasEventOrVenueSignal(text: string): boolean {
  return /(evento|eventos|productora|producciones|banqueter|catering|planner|celebracion|celebraciones|fiesta|fiestas|salon|centro de eventos|venue|hotel|cabana|cabanas|restaurant|restaurante|parcela|quincho|resort|camping|cervecer|turismo|outdoor|experiencia|centro turistico|termas)/.test(text);
}

function hasWeddingOrVenueSignal(text: string): boolean {
  return /(wedding|matrimonio|matrimonios|novios|novias|banqueter|planner|eventos|centro de eventos|salon|venue|hotel|parcela|quincho|catering)/.test(text);
}

function hasEducationSignal(text: string): boolean {
  return /(colegio|liceo|escuela|universidad|instituto|jardin|educacion|educativo|educativa|fundacion educativa|centro de padres|preuniversitario|capacitacion)/.test(text);
}

function hasPublicInstitutionSignal(text: string): boolean {
  return /(municipal|municipalidad|gobierno|delegacion|seremi|ministerio|servicio publico|corporacion|dideco|cultura|turismo|deporte|biblioteca|centro cultural)/.test(text);
}

function hasCommunitySignal(text: string): boolean {
  return /(club|junta de vecinos|iglesia|parroquia|fundacion|ong|adulto mayor|camara|asociacion|agrupacion|comunidad|corporacion|club deportivo|social|cultural)/.test(text);
}

function getCategoryFitRejection(lead: any, categoria: string): string {
  const text = normalizeSearchText(`${lead?.empresa || ''} ${lead?.actividad || ''} ${lead?.motivo || ''} ${lead?.descripcion || ''} ${lead?.website || ''} ${lead?.email || ''} ${lead?.ubicacion || ''} ${lead?.instagram || ''} ${lead?.facebook || ''} ${lead?.tiktok || ''}`);

  if (categoria === 'cumpleanos') {
    if (isProductOnlyFamilyEventLead(lead)) return 'vende productos de fiesta, no organiza ni deriva eventos';
    if (!hasEventOrVenueSignal(text)) return 'sin señal de organización, banquetería, venue, hotel o espacio para eventos familiares';
  }

  if (categoria === 'matrimonios' && !hasWeddingOrVenueSignal(text)) {
    return 'sin señal clara de matrimonios, banquetería, planner o venue';
  }

  if (categoria === 'turismo' && !isTourismOrVenueSignal(text)) {
    return 'sin señal de turismo, hotel, venue o espacio complementario';
  }

  if (categoria === 'educacion' && !hasEducationSignal(text)) {
    return 'sin señal de institución educativa o comunidad escolar';
  }

  if (categoria === 'municipal' && !hasPublicInstitutionSignal(text)) {
    return 'sin señal de entidad pública, municipal o comunitaria institucional';
  }

  if (categoria === 'comunidad' && !hasCommunitySignal(text)) {
    return 'sin señal de organización comunitaria con convocatoria';
  }

  return '';
}

function hasLocalSignal(text: string): boolean {
  return /(villarrica|puc[oó]n|lican ray|molco|caburgua|curarrehue|coñaripe|conaripe|araucan[ií]a|temuco|padre las casas|vilc[uú]n|freire|pitrufqu[eé]n|nueva imperial|cholchol|galvarino|caj[oó]n|loncoche|gorbea|tolt[eé]n|teodoro schmidt|carahue|puerto saavedra|victoria|curacaut[ií]n|lautaro|collipulli|angol|lonquimay|panguipulli|lanco|mariquina|zona sur|sur de chile|la araucan[ií]a)/.test(text);
}

function isRemoteOnlyLead(text: string): boolean {
  const remote = /(santiago|valpara[ií]so|viña|vina|ohiggins|o'higgins|rancagua|concepci[oó]n|la serena|chile$)/.test(text);
  return remote && !hasLocalSignal(text);
}

function hasUncertainLocalFit(text: string): boolean {
  return /(confirmar servicio|confirmar cobertura|sin se[nñ]al clara|por confirmar|opera remoto|servicio en villarrica\?)/.test(text);
}

function isTourismOrVenueSignal(text: string): boolean {
  return /(hotel|cabaña|cabana|cabañas|cabanas|hostal|turismo|tur[ií]stic|centro turistico|viajes|operador|outdoor|aventura|centro de eventos|sal[oó]n|salon|venue|resort|camping|restaurant|restaurante|parque|termas|experiencia|parcela|quincho|cervecer)/.test(text);
}

function isTechnicalSupplierSignal(text: string): boolean {
  return /(sonido|audio|audiovisual|amplificaci[oó]n|iluminaci[oó]n|pantalla|escenario|dj|backline|fotograf[ií]a|video|filmaci[oó]n|streaming)/.test(text);
}

function buildLeadQuality(lead: any, categoria: string, cleanTel: string, site: string, isWap: boolean) {
  const text = normalizeSearchText(`${lead?.empresa || ''} ${lead?.actividad || ''} ${lead?.motivo || ''} ${lead?.descripcion || ''} ${lead?.website || ''} ${lead?.email || ''} ${lead?.ubicacion || ''} ${lead?.instagram || ''} ${lead?.facebook || ''}`);
  const notes: string[] = [];
  let score = 5;
  let role = 'cliente directo';
  const remoteOnly = isRemoteOnlyLead(text);
  const uncertainLocalFit = hasUncertainLocalFit(text);

  if (isWap) { score += 2; notes.push('WhatsApp'); }
  else if (cleanTel) { score += 1; notes.push('teléfono fijo'); }
  if (site) { score += 1; notes.push('web'); }
  if (lead?.email) { score += 1; notes.push('email'); }
  if (lead?.instagram || lead?.facebook || lead?.tiktok) { score += 1; notes.push('redes'); }

  if (hasLocalSignal(text)) {
    score += 1;
    notes.push('zona útil');
  }
  if (remoteOnly) {
    role = 'fuera de zona / revisar';
    score -= 5;
    notes.push('sin señal clara en Araucanía');
  }
  if (uncertainLocalFit) {
    role = 'fuera de zona / revisar';
    score -= 4;
    notes.push('cobertura local dudosa');
  }

  if (!remoteOnly && !uncertainLocalFit && isTourismOrVenueSignal(text)) {
    role = 'aliado o venue complementario';
    score += categoria === 'turismo' ? 2 : 1;
    notes.push('podría derivar o necesitar espacio mayor');
  }

  if (categoria === 'turismo' && /productora|producciones|eventos/.test(text) && !isTourismOrVenueSignal(text)) {
    role = 'revisar categoría';
    score -= 3;
    notes.push('parece productora, no turismo/venue');
  }

  if (categoria === 'productoras' && isTechnicalSupplierSignal(text)) {
    role = 'proveedor técnico / aliado';
    score -= 2;
    notes.push('apoyo técnico, no necesariamente decide venue');
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
  const text = normalizeSearchText(`${lead?.empresa || ''} ${lead?.ubicacion || ''} ${lead?.website || ''} ${lead?.email || ''}`);
  if (hasUncertainLocalFit(text)) return 'externo';
  if (isRemoteOnlyLead(text)) return 'externo';
  if (/(villarrica|puc[oó]n|lican ray|molco|caburgua|curarrehue|coñaripe|conaripe)/.test(text)) return 'lacustre';
  if (/(temuco|padre las casas|vilc[uú]n|freire|pitrufqu[eé]n|nueva imperial|cholchol|galvarino|caj[oó]n)/.test(text)) return 'temuco';
  if (/(loncoche|gorbea|tolt[eé]n|teodoro schmidt)/.test(text)) return 'sur';
  if (/(carahue|puerto saavedra)/.test(text)) return 'costa';
  if (/(victoria|curacaut[ií]n|lautaro|collipulli|angol|lonquimay)/.test(text)) return 'norte';
  if (/(panguipulli|lanco|mariquina)/.test(text)) return 'lagos';
  return requestedSector;
}

function getSectorSearchGuidance(sector: string, ubicacion: string): string {
  switch (sector) {
    case 'lacustre':
      return `SOLO zona lacustre: ${ubicacion}, Pucon, Villarrica, Lican Ray, Molco, Caburgua, Curarrehue o Conaripe. No uses Temuco para rellenar resultados.`;
    case 'temuco':
      return `SOLO Temuco y alrededores directos: ${ubicacion}, Temuco, Padre Las Casas, Cajon, Vilcun, Freire, Pitrufquen o Nueva Imperial.`;
    case 'sur':
      return `SOLO zona sur de La Araucania: ${ubicacion}, Loncoche, Gorbea, Tolten o Teodoro Schmidt.`;
    case 'costa':
      return `SOLO costa de La Araucania: ${ubicacion}, Carahue, Puerto Saavedra, Nueva Imperial o alrededores costeros.`;
    case 'norte':
      return `SOLO Malleco y zona norte: ${ubicacion}, Victoria, Curacautin, Lautaro, Collipulli, Angol o Lonquimay.`;
    case 'lagos':
      return `SOLO zona de Los Rios cercana: ${ubicacion}, Panguipulli, Lanco, Mariquina o comunas cercanas.`;
    default:
      return `${ubicacion}, Region de la Araucania.`;
  }
}

function isOutsideRequestedSector(leadSector: string, requestedSector: string): boolean {
  if (!requestedSector || requestedSector === 'externo') return false;
  return leadSector !== requestedSector;
}

function shouldAutoDiscardLead(quality: ReturnType<typeof buildLeadQuality>, sector: string): boolean {
  return sector === 'externo' || quality.score <= 4;
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
    const sectorGuidance = getSectorSearchGuidance(safeSector, safeUbicacion);

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const prompt = `Soy Alberto del Parque Hípico La Montaña, un recinto outdoor en Villarrica. ARRENDAMOS EL TERRENO/ESPACIO FÍSICO para eventos masivos: 3 hectáreas planas (30.000 m²), capacidad 5.000+ personas, 400+ estacionamientos, luz trifásica T1. SOMOS UN VENUE, no hacemos shows de caballos. El nombre es histórico.

Busca hasta ${safeLimit} empresas, productoras u organizaciones reales en esta zona: ${sectorGuidance}
La categoría es "${normalizedCategoria}". Deben poder NECESITAR arrendar un espacio outdoor masivo.
Respeta la zona seleccionada. Si no hay suficientes leads buenos en esa zona, devuelve menos resultados antes que rellenar con empresas de otra ciudad. Solo incluye empresas de Santiago, Valparaíso u otras regiones si su información muestra claramente sede, operación o cobertura directa en la zona seleccionada.

Definición de la categoría "${categoryDefinition.label}": ${categoryDefinition.searchPrompt}

Regla global de calidad: no incluyas negocios que solo venden productos o servicios puntuales si no pueden decidir, recomendar o necesitar un recinto. Evita tiendas de artículos de fiesta, decoración, globos, tortas, regalos, fotografía aislada, sonido aislado o arriendo de equipos si no organizan eventos completos.

IMPORTANTE: Busca teléfonos de contacto REALES, preferentemente móviles con WhatsApp (+56 9). Busca en Google Maps, páginas amarillas, Facebook, Instagram. Si no encuentras teléfono, déjalo vacío "".
Cada lead debe tener al menos un canal accionable: teléfono, email, sitio web real o red social real. No incluyas leads donde solo tengas nombre y dirección.
El sitio web debe ser un dominio real (ej: "www.empresa.cl"), NO pongas emails como website. Si hay email, usa campo "email".
Instagram, Facebook y TikTok: solo usuario o URL real visible. Si no encuentras una red verificable, usa string vacío "". No inventes usuarios y no mezcles URLs, por ejemplo nunca respondas "instagram.com/https://...".

Agrega "actividad" con el rubro comprobado y "motivo" con una frase corta de por qué podría necesitar o derivar el recinto. Si no puedes justificarlo, no incluyas el lead.

Responde SOLO un JSON array sin Markdown con objetos: {"empresa","telefono","website","email","ubicacion","instagram","facebook","tiktok","actividad","motivo"}`;

    let leads: any[] = [];
    let lastGeminiStatus = 0;
    let lastFinishReason: string | null = null;
    let lastRawText = '';
    let lastError = '';

    for (let attempt = 1; attempt <= 2; attempt++) {
      const controller = new AbortController();
      const timeoutMs = 75000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const geminiRes = await fetch(
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
        clearTimeout(timeoutId);
        lastGeminiStatus = geminiRes.status;

        if (!geminiRes.ok) {
          lastError = `Gemini no respondio correctamente (${geminiRes.status}).`;
          if (attempt < 2 && (geminiRes.status === 429 || geminiRes.status >= 500)) {
            await delay(1200);
            continue;
          }
          break;
        }

        const data = await geminiRes.json();
        lastFinishReason = data.candidates?.[0]?.finishReason || null;
        lastRawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        try {
          leads = parseLeadArray(lastRawText);
          lastError = '';
          break;
        } catch (parseError: any) {
          lastError = parseError.message || 'Failed to parse Gemini response';
          if (attempt < 2) {
            await delay(1200);
            continue;
          }
        }
      } catch (e: any) {
        clearTimeout(timeoutId);
        lastError = e.name === 'AbortError'
          ? 'La busqueda tardo mas de 75 segundos.'
          : 'Error de conexion con Gemini.';
        if (attempt < 2) {
          await delay(1200);
          continue;
        }
      }
    }

    if (lastError) {
      return NextResponse.json({
        error: `${lastError} Reintenta en unos segundos.`,
        finishReason: lastFinishReason,
        geminiStatus: lastGeminiStatus || null,
        raw: cleanGeminiJson(lastRawText).substring(0, 500),
      }, { status: lastError.includes('75 segundos') ? 504 : 502 });
    }

    // Validar, limpiar y guardar cada lead
    const saved: any[] = [];
    const seenNames = new Set<string>();
    const seenPhones = new Set<string>();
    const seenSites = new Set<string>();
    let skippedOutOfZone = 0;
    let skippedBadFit = 0;

    for (let i = 0; i < Math.min(leads.length, safeLimit); i++) {
      const lead = leads[i];
      const normalizedName = normalizeName(lead.empresa);
      const empresaOriginal = (lead.empresa || '').trim();
      const rawTel = (lead.telefono || '').trim();
      const cleanPhone = rawTel.replace(/\D/g, '');
      const candidateSite = cleanWebsite(lead.website || '');

      if (!empresaOriginal || normalizedName.length < 3) {
        skippedBadFit++;
        console.warn('[QUALITY] Saltando lead sin nombre de empresa util.');
        continue;
      }

      const categoryFitRejection = getCategoryFitRejection(lead, normalizedCategoria);
      if (categoryFitRejection) {
        skippedBadFit++;
        console.warn(`[QUALITY] Saltando lead poco apto (${categoryFitRejection}): ${empresaOriginal}`);
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
      if (candidateSite && seenSites.has(candidateSite)) {
        console.warn(`[DEDUP] Saltando duplicado por web: ${empresaOriginal} (${candidateSite})`);
        continue;
      }
      seenNames.add(normalizedName);
      if (cleanPhone) seenPhones.add(cleanPhone);
      if (candidateSite) seenSites.add(candidateSite);

      const leadSector = inferLeadSector(lead, safeSector);
      if (isOutsideRequestedSector(leadSector, safeSector)) {
        skippedOutOfZone++;
        console.warn(`[QUALITY] Saltando lead fuera de zona (${leadSector} != ${safeSector}): ${empresaOriginal}`);
        continue;
      }

      // Verificar si ya existe en BD por nombre similar o mismo teléfono
      let existingDb: any = await findExistingLeadByName(supabase, normalizedName);
      if (!existingDb && cleanPhone) existingDb = await findExistingLeadByPhone(supabase, cleanPhone);
      if (!existingDb && candidateSite) {
        const { data: byWebsite } = await supabase
          .from('leads')
          .select(LEAD_LOOKUP_FIELDS)
          .eq('website', candidateSite)
          .limit(1);
        if (byWebsite && byWebsite.length > 0) existingDb = byWebsite[0];
      }

      // Validar y limpiar campos
      const email = isValidEmail(lead.email) ? lead.email.trim() : '';
      const cleanTel = normalizePhone(rawTel);
      const isWap = isWhatsAppCompatible(rawTel);
      const site = candidateSite;
      const instagram = cleanSocialHandle(lead.instagram, 'instagram')
        || cleanSocialHandle(lead.website, 'instagram')
        || existingDb?.instagram
        || '';
      const facebook = cleanSocialHandle(lead.facebook, 'facebook')
        || cleanSocialHandle(lead.website, 'facebook')
        || existingDb?.facebook
        || '';
      const tiktok = cleanSocialHandle(lead.tiktok, 'tiktok')
        || cleanSocialHandle(lead.website, 'tiktok')
        || existingDb?.tiktok
        || '';
      const quality = buildLeadQuality(lead, normalizedCategoria, cleanTel, site, isWap);
      const autoDiscard = shouldAutoDiscardLead(quality, leadSector);

      let finalEmail = email;
      if (!finalEmail && lead.website && lead.website.includes('@')) {
        if (isValidEmail(lead.website)) finalEmail = lead.website.trim();
      }

      const hasActionableContact = !!(
        cleanTel ||
        existingDb?.telefono ||
        finalEmail ||
        existingDb?.email ||
        site ||
        existingDb?.website ||
        instagram ||
        facebook ||
        tiktok
      );
      if (!hasActionableContact) {
        skippedBadFit++;
        console.warn(`[QUALITY] Saltando lead sin canal accionable: ${empresaOriginal}`);
        continue;
      }

      // Si ya existe, hacer UPDATE (no duplicar)
      const recordId = existingDb?.id || null;
      const rawData = JSON.stringify({
        ...lead,
        _validated: true,
        _isWhatsApp: isWap,
        _websiteOk: !!site,
        _qualityScore: quality.score,
        _qualityTier: quality.tier,
        _leadRole: quality.role,
        _qualityNotes: quality.notes,
      });
      const nextEstadoLead = recordId
        ? (autoDiscard && ['nuevo', 'en_proceso'].includes(existingDb?.estado_lead) ? 'descartado' : undefined)
        : (autoDiscard ? 'descartado' : 'nuevo');
      const nextWebStatus = isWap ? (site ? 'activa' : 'sin_web') : 'fijo';

      const updateData: any = {
        categoria: normalizedCategoria,
        categorias: [normalizedCategoria],
        telefono: cleanTel || existingDb?.telefono || '',
        website: site || existingDb?.website || '',
        email: finalEmail || existingDb?.email || '',
        ubicacion: lead.ubicacion || '',
        sector: leadSector,
        instagram,
        facebook,
        tiktok,
        score: quality.score,
        raw_data: rawData,
        estado_lead: nextEstadoLead,
        web_status: nextWebStatus,
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

      const savedLeadForResponse = {
        ...lead,
        id: finalId,
        categoria: normalizedCategoria,
        categorias: [normalizedCategoria],
        estado_lead: nextEstadoLead || existingDb?.estado_lead || 'nuevo',
        sector: leadSector,
        email: finalEmail,
        website: site,
        telefono: cleanTel,
        instagram,
        facebook,
        tiktok,
        capacidad_estimada: null,
        web_status: nextWebStatus,
        score: quality.score,
        redes: '',
        guion: existingDb?.guion || '',
        raw_data: rawData,
        created_at: new Date().toISOString(),
        _lastOutreach: null,
        _isWhatsApp: isWap,
        _websiteOk: !!site,
        _qualityScore: quality.score,
        _qualityTier: quality.tier,
        _leadRole: quality.role,
        _qualityNotes: quality.notes,
      };

      saved.push(savedLeadForResponse);
    }

    const verifiedSaved = await Promise.all(saved.map(async (lead) => {
      try {
        const { updates, verification } = await verifyLeadData(lead);
        if (lead.id && Object.keys(updates).length > 0) {
          await supabase.from('leads').update(updates).eq('id', lead.id);
        }
        return {
          ...lead,
          ...updates,
          raw_data: updates.raw_data || lead.raw_data,
          verification,
        };
      } catch (error) {
        console.warn(`[VERIFY] No se pudo verificar ${lead.empresa}:`, error);
        return lead;
      }
    }));

    return NextResponse.json({
      success: true,
      leads: verifiedSaved,
      total: verifiedSaved.length,
      remaining_searches: remaining,
      stats: {
        withPhone: verifiedSaved.filter(l => l.telefono).length,
        withWhatsApp: verifiedSaved.filter((l: any) => (l.telefono || '').startsWith('+569')).length,
        withWebsite: verifiedSaved.filter((l: any) => cleanWebsite(l.website)).length,
        withEmail: verifiedSaved.filter(l => l.email).length,
        filteredOut: skippedOutOfZone,
        filteredBadFit: skippedBadFit,
      }
    });
  } catch (error: any) {
    console.error('Search Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
