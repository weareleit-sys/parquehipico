import { cleanSocialHandle, cleanWebsite } from './lead-links';

type VerificationConfidence = 'alta' | 'media' | 'baja';
type VerificationStatus = 'verificado' | 'parcial' | 'sin_verificar' | 'conflicto';

interface VerificationField {
  value: string;
  source: string;
  confidence: VerificationConfidence;
}

interface VerificationResult {
  status: VerificationStatus;
  checked_at: string;
  google_configured: boolean;
  google_place_id?: string;
  google_place_name?: string;
  google_formatted_address?: string;
  google_match_score?: number;
  google_business_status?: string;
  sources: string[];
  fields: {
    telefono?: VerificationField;
    website?: VerificationField;
    email?: VerificationField;
    instagram?: VerificationField;
    facebook?: VerificationField;
    tiktok?: VerificationField;
  };
  notes: string[];
}

interface VerifyLeadInput {
  id?: string;
  empresa: string;
  ubicacion?: string;
  telefono?: string;
  website?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  sector?: string;
  categoria?: string;
  raw_data?: string;
}

interface VerifyLeadOutput {
  updates: Record<string, any>;
  verification: VerificationResult;
}

type GooglePlaceMatch = {
  place_id: string;
  display_name: string;
  business_status: string;
  formatted_address: string;
  telefono: string;
  website: string;
  match_score: number;
};

type GooglePlaceLookup = {
  place: GooglePlaceMatch | null;
  notes: string[];
};

type WebsiteLookup = {
  data: {
    source: string;
    email: string;
    telefono: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  } | null;
  rejected: boolean;
  reason?: string;
};

function normalizePhone(value: string | null | undefined): string {
  if (!value || !value.trim()) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('569')) return `+${digits}`;
  if (digits.startsWith('9') && digits.length === 9) return `+56${digits}`;
  if (digits.startsWith('56')) return `+${digits}`;
  if (digits.length === 8) return `+56${digits}`;
  return `+${digits}`;
}

function parseRawData(rawData: unknown): Record<string, any> {
  if (!rawData || typeof rawData !== 'string') return {};
  try {
    return JSON.parse(rawData);
  } catch {
    return {};
  }
}

function sameHost(a: string, b: string): boolean {
  const cleanA = cleanWebsite(a).replace(/^www\./, '');
  const cleanB = cleanWebsite(b).replace(/^www\./, '');
  return !!cleanA && !!cleanB && (cleanA === cleanB || cleanA.endsWith(`.${cleanB}`) || cleanB.endsWith(`.${cleanA}`));
}

function normalizeText(value: string | null | undefined): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GENERIC_TOKENS = new Set([
  'ag', 'a', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'en', 'para', 'por',
  'chile', 'spa', 'ltda', 'limitada', 'sa', 'sociedad', 'empresa',
  'productora', 'producciones', 'eventos', 'servicios', 'servicio',
  'camara', 'comercio', 'turismo', 'turistico', 'turistica',
  'fundacion', 'asociacion', 'corporacion', 'departamento', 'direccion',
  'unidad', 'municipalidad', 'municipal', 'ilustre', 'cultura',
  'comunidad', 'comunitario', 'dideco', 'colegio', 'liceo', 'escuela',
  'complejo', 'educacional', 'centro', 'hotel', 'camping', 'hostal',
]);

function meaningfulTokens(value: string | null | undefined): string[] {
  return normalizeText(value)
    .split(' ')
    .filter(token => token.length >= 3 && !GENERIC_TOKENS.has(token));
}

function tokenOverlapScore(source: string, target: string): number {
  const tokens = meaningfulTokens(source);
  if (tokens.length === 0) return 0;
  const targetText = normalizeText(target);
  const matches = tokens.filter(token => targetText.includes(token)).length;
  return matches / tokens.length;
}

const SECTOR_LOCATION_TERMS: Record<string, string[]> = {
  temuco: ['temuco', 'padre las casas', 'cajon', 'vilcun', 'freire', 'pitrufquen', 'nueva imperial', 'cholchol', 'galvarino'],
  lacustre: ['villarrica', 'pucon', 'lican ray', 'molco', 'caburgua', 'curarrehue', 'conaripe'],
  sur: ['loncoche', 'gorbea', 'tolten', 'teodoro schmidt', 'hualpin'],
  costa: ['carahue', 'puerto saavedra', 'saavedra', 'trovolhue', 'nehuentue'],
  norte: ['victoria', 'curacautin', 'lautaro', 'collipulli', 'angol', 'lonquimay', 'traiguen', 'ercilla', 'purén', 'puren'],
  lagos: ['panguipulli', 'lanco', 'mariquina', 'valdivia'],
};

const KNOWN_OUTSIDE_LOCATION_TERMS = [
  'santiago',
  'valparaiso',
  'vina del mar',
  'concepcion',
  'los angeles',
  'rancagua',
  'osorno',
  'puerto montt',
  'mutriku',
  'espana',
  'spain',
  'eus',
  'bulegoa',
];

function includesPhrase(text: string, phrase: string): boolean {
  const normalizedText = ` ${normalizeText(text)} `;
  const normalizedPhrase = ` ${normalizeText(phrase)} `;
  return normalizedPhrase.trim().length > 0 && normalizedText.includes(normalizedPhrase);
}

function locationTermsForLead(lead: VerifyLeadInput): string[] {
  const terms = new Set<string>();
  for (const token of meaningfulTokens(lead.ubicacion || '')) terms.add(token);
  const sectorTerms = lead.sector ? SECTOR_LOCATION_TERMS[lead.sector] || [] : [];
  for (const term of sectorTerms) terms.add(term);
  return [...terms].filter(term => term.length >= 3);
}

function hasLeadLocationSignal(text: string, lead: VerifyLeadInput): boolean {
  const terms = locationTermsForLead(lead);
  return terms.some(term => includesPhrase(text, term));
}

function hasOutsideLocationSignal(text: string, lead: VerifyLeadInput): boolean {
  const normalizedLead = normalizeText(`${lead.empresa || ''} ${lead.ubicacion || ''}`);
  return KNOWN_OUTSIDE_LOCATION_TERMS.some(term => {
    const normalizedTerm = normalizeText(term);
    return !normalizedLead.includes(normalizedTerm) && includesPhrase(text, normalizedTerm);
  });
}

function scoreGoogleCandidate(place: any, lead: VerifyLeadInput): {
  accepted: boolean;
  score: number;
  reason: string;
} {
  const displayName = place?.displayName?.text || '';
  const formattedAddress = place?.formattedAddress || '';
  const website = cleanWebsite(place?.websiteUri || '');
  const candidateText = `${displayName} ${formattedAddress} ${website}`;
  const nameScore = tokenOverlapScore(lead.empresa, displayName);
  const locationExpected = locationTermsForLead(lead).length > 0;
  const locationMatches = hasLeadLocationSignal(candidateText, lead);
  const outsideLocation = hasOutsideLocationSignal(candidateText, lead);
  const websiteMatches = sameHost(lead.website || '', website);
  const score = Math.round((nameScore * 65) + (locationMatches ? 25 : 0) + (websiteMatches ? 10 : 0));

  if (outsideLocation && !locationMatches) {
    return { accepted: false, score, reason: 'resultado apunta a otra ciudad o pais' };
  }
  if (locationExpected && !locationMatches && nameScore < 0.8) {
    return { accepted: false, score, reason: 'resultado no coincide con la zona solicitada' };
  }
  if (nameScore >= 0.45 && (locationMatches || !locationExpected)) {
    return { accepted: true, score, reason: 'nombre y zona coinciden' };
  }
  if (nameScore >= 0.8 && websiteMatches && !outsideLocation) {
    return { accepted: true, score, reason: 'nombre y dominio coinciden' };
  }
  return { accepted: false, score, reason: 'nombre insuficientemente parecido' };
}

function isWebsiteRelevantToLead(host: string, html: string, lead: VerifyLeadInput): { accepted: boolean; reason: string } {
  const sample = `${host} ${html.slice(0, 120000)}`;
  const nameScore = tokenOverlapScore(lead.empresa, sample);
  const locationExpected = locationTermsForLead(lead).length > 0;
  const locationMatches = hasLeadLocationSignal(sample, lead);
  const outsideLocation = hasOutsideLocationSignal(sample, lead);

  if (outsideLocation && !locationMatches) {
    return { accepted: false, reason: 'web apunta a otra ciudad o pais' };
  }
  if (nameScore >= 0.67) {
    return { accepted: true, reason: 'nombre coincide en la web' };
  }
  if (nameScore >= 0.34 && (!locationExpected || locationMatches)) {
    return { accepted: true, reason: 'nombre y zona coinciden en la web' };
  }
  if (locationExpected && !locationMatches) {
    return { accepted: false, reason: 'web no menciona la zona del lead' };
  }
  return { accepted: false, reason: 'web no contiene senales suficientes del lead' };
}

function isSocialHandleRelevant(handle: string, lead: VerifyLeadInput): boolean {
  if (!handle) return true;
  const text = normalizeText(handle);
  const tokens = meaningfulTokens(lead.empresa);
  const hasNameToken = tokens.some(token => text.includes(token));
  const hasLocationToken = locationTermsForLead(lead).some(term => text.includes(normalizeText(term).replace(/\s+/g, '')));
  const hasOutsideToken = KNOWN_OUTSIDE_LOCATION_TERMS.some(term => text.includes(normalizeText(term).replace(/\s+/g, '')));
  return hasNameToken || hasLocationToken || !hasOutsideToken;
}

function timeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

function extractEmails(html: string): string[] {
  const matches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const emails = [...new Set(matches.map(email => email.toLowerCase()))]
    .filter(email => !/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(email));
  const preferred = ['ventas', 'contacto', 'info', 'reservas', 'comercial', 'eventos'];
  return emails.sort((a, b) => {
    const aScore = preferred.findIndex(prefix => a.startsWith(`${prefix}@`));
    const bScore = preferred.findIndex(prefix => b.startsWith(`${prefix}@`));
    const normalizedA = aScore === -1 ? 99 : aScore;
    const normalizedB = bScore === -1 ? 99 : bScore;
    return normalizedA - normalizedB;
  });
}

function extractPhones(html: string): string[] {
  const matches = html.match(/(?:\+?56\s?)?(?:9\s?)?\d(?:[\s.-]?\d){7,8}/g) || [];
  return [...new Set(matches.map(normalizePhone).filter(Boolean))];
}

function extractSocial(html: string, network: 'instagram' | 'facebook' | 'tiktok'): string {
  const host = network === 'facebook' ? '(?:facebook|fb)\\.com' : `${network}\\.com`;
  const regex = new RegExp(`https?:\\/\\/(?:www\\.)?${host}\\/[^"'\\s<>]+`, 'ig');
  const matches = html.match(regex) || [];
  for (const match of matches) {
    const handle = cleanSocialHandle(match, network);
    if (handle) return handle;
  }
  return '';
}

async function fetchOfficialWebsite(website: string, lead: VerifyLeadInput): Promise<WebsiteLookup> {
  const clean = cleanWebsite(website);
  if (!clean) return { data: null, rejected: false };

  const urls = [`https://${clean}`, `http://${clean}`];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        signal: timeoutSignal(7000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ParqueHipicoLeadVerifier/1.0)',
        },
      });
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) continue;
      const html = await res.text();
      const relevance = isWebsiteRelevantToLead(clean, html, lead);
      if (!relevance.accepted) {
        return { data: null, rejected: true, reason: `${relevance.reason}: ${clean}` };
      }
      const emails = extractEmails(html);
      const phones = extractPhones(html);
      return {
        data: {
          source: url,
          email: emails[0] || '',
          telefono: phones.find(phone => phone.startsWith('+569')) || phones[0] || '',
          instagram: extractSocial(html, 'instagram'),
          facebook: extractSocial(html, 'facebook'),
          tiktok: extractSocial(html, 'tiktok'),
        },
        rejected: false,
      };
    } catch {
      // Try the next protocol.
    }
  }
  return { data: null, rejected: false };
}

async function fetchGooglePlace(lead: VerifyLeadInput): Promise<GooglePlaceLookup> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return { place: null, notes: [] };

  const query = `${lead.empresa} ${lead.ubicacion || ''}`.trim();
  if (!query) return { place: null, notes: [] };

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      signal: timeoutSignal(8000),
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.nationalPhoneNumber',
          'places.internationalPhoneNumber',
          'places.websiteUri',
          'places.businessStatus',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'es',
        regionCode: 'CL',
        maxResultCount: 5,
      }),
    });
    if (!res.ok) {
      return { place: null, notes: [`Google Places respondio ${res.status}.`] };
    }
    const data = await res.json();
    const places = Array.isArray(data?.places) ? data.places : [];
    if (places.length === 0) return { place: null, notes: [] };

    const scored = places
      .map((place: any) => {
        const match = scoreGoogleCandidate(place, lead);
        return { place, ...match };
      })
      .sort((a: any, b: any) => b.score - a.score);
    const best = scored.find((candidate: any) => candidate.accepted) || null;
    if (!best) {
      const top = scored[0];
      const topName = top?.place?.displayName?.text || 'sin nombre';
      const topAddress = top?.place?.formattedAddress || 'sin direccion';
      return {
        place: null,
        notes: [`Google Places descarto mejor coincidencia (${topName}, ${topAddress}): ${top?.reason || 'sin razon'}.`],
      };
    }

    const place = best.place;
    return {
      place: {
        place_id: place.id || '',
        display_name: place.displayName?.text || '',
        business_status: place.businessStatus || '',
        formatted_address: place.formattedAddress || '',
        telefono: normalizePhone(place.internationalPhoneNumber || place.nationalPhoneNumber || ''),
        website: cleanWebsite(place.websiteUri || ''),
        match_score: best.score,
      },
      notes: [],
    };
  } catch {
    return { place: null, notes: ['Google Places no respondio dentro del tiempo esperado.'] };
  }
}

function setField(
  fields: VerificationResult['fields'],
  key: keyof VerificationResult['fields'],
  value: string,
  source: string,
  confidence: VerificationConfidence
) {
  if (!value) return;
  fields[key] = { value, source, confidence };
}

function mergeRawData(rawData: unknown, verification: VerificationResult): string {
  return JSON.stringify({
    ...parseRawData(rawData),
    verification,
  });
}

export async function verifyLeadData(lead: VerifyLeadInput): Promise<VerifyLeadOutput> {
  const googleConfigured = !!process.env.GOOGLE_MAPS_API_KEY;
  const sources: string[] = [];
  const notes: string[] = [];
  const fields: VerificationResult['fields'] = {};
  const updates: Record<string, any> = {};

  const googleLookup = await fetchGooglePlace(lead);
  const google = googleLookup.place;
  notes.push(...googleLookup.notes);
  if (google) {
    sources.push('google_places');
    setField(fields, 'telefono', google.telefono, 'google_places', 'alta');
    setField(fields, 'website', google.website, 'google_places', 'alta');
    if (google.telefono && (!lead.telefono || !normalizePhone(lead.telefono).startsWith('+569'))) {
      updates.telefono = google.telefono;
      updates.web_status = google.telefono.startsWith('+569') ? 'activa' : 'fijo';
    }
    if (google.website && (!lead.website || !sameHost(lead.website, google.website))) {
      updates.website = google.website;
    }
  } else if (googleConfigured) {
    notes.push('Google Places no encontro coincidencia confiable.');
  } else {
    notes.push('GOOGLE_MAPS_API_KEY no configurada; se omitio verificacion Google.');
  }

  const websiteForCrawler = updates.website || google?.website || lead.website || '';
  const webLookup = await fetchOfficialWebsite(websiteForCrawler, lead);
  const web = webLookup.data;
  if (web) {
    sources.push('website_crawl');
    setField(fields, 'email', web.email, 'website_crawl', 'alta');
    setField(fields, 'telefono', fields.telefono?.value || web.telefono, fields.telefono?.source || 'website_crawl', fields.telefono?.confidence || 'alta');
    setField(fields, 'instagram', web.instagram, 'website_crawl', 'alta');
    setField(fields, 'facebook', web.facebook, 'website_crawl', 'alta');
    setField(fields, 'tiktok', web.tiktok, 'website_crawl', 'alta');

    if (web.email && !lead.email) updates.email = web.email;
    if (web.telefono && !lead.telefono) {
      updates.telefono = web.telefono;
      updates.web_status = web.telefono.startsWith('+569') ? 'activa' : 'fijo';
    }
    if (web.instagram) updates.instagram = web.instagram;
    if (web.facebook) updates.facebook = web.facebook;
    if (web.tiktok) updates.tiktok = web.tiktok;
  } else if (webLookup.rejected) {
    notes.push(`Web descartada: ${webLookup.reason || 'no coincide con el lead'}.`);
    const clearConflictingWebsite = (webLookup.reason || '').includes('otra ciudad o pais');
    if (clearConflictingWebsite && lead.website && sameHost(lead.website, websiteForCrawler)) {
      updates.website = '';
    }
    const leadInstagram = cleanSocialHandle(lead.instagram, 'instagram');
    const leadFacebook = cleanSocialHandle(lead.facebook, 'facebook');
    const leadTiktok = cleanSocialHandle(lead.tiktok, 'tiktok');
    if (clearConflictingWebsite && leadInstagram && !isSocialHandleRelevant(leadInstagram, lead)) updates.instagram = '';
    if (clearConflictingWebsite && leadFacebook && !isSocialHandleRelevant(leadFacebook, lead)) updates.facebook = '';
    if (clearConflictingWebsite && leadTiktok && !isSocialHandleRelevant(leadTiktok, lead)) updates.tiktok = '';
  } else if (websiteForCrawler) {
    notes.push('No se pudo rastrear la web oficial o no expuso datos utiles.');
  }

  const cleanedInstagram = cleanSocialHandle(lead.instagram, 'instagram');
  const cleanedFacebook = cleanSocialHandle(lead.facebook, 'facebook');
  const cleanedTiktok = cleanSocialHandle(lead.tiktok, 'tiktok');
  if (!fields.instagram && cleanedInstagram && updates.instagram !== '') setField(fields, 'instagram', cleanedInstagram, 'gemini_limpio', 'media');
  if (!fields.facebook && cleanedFacebook && updates.facebook !== '') setField(fields, 'facebook', cleanedFacebook, 'gemini_limpio', 'media');
  if (!fields.tiktok && cleanedTiktok && updates.tiktok !== '') setField(fields, 'tiktok', cleanedTiktok, 'gemini_limpio', 'media');

  const highConfidenceCount = Object.values(fields).filter(field => field?.confidence === 'alta').length;
  const status: VerificationStatus = highConfidenceCount >= 2
    ? 'verificado'
    : highConfidenceCount === 1
    ? 'parcial'
    : Object.keys(fields).length > 0
    ? 'sin_verificar'
    : 'sin_verificar';

  const verification: VerificationResult = {
    status,
    checked_at: new Date().toISOString(),
    google_configured: googleConfigured,
    google_place_id: google?.place_id || undefined,
    google_place_name: google?.display_name || undefined,
    google_formatted_address: google?.formatted_address || undefined,
    google_match_score: google?.match_score || undefined,
    google_business_status: google?.business_status || undefined,
    sources,
    fields,
    notes,
  };

  updates.raw_data = mergeRawData(lead.raw_data, verification);
  updates.updated_at = new Date().toISOString();

  return { updates, verification };
}
