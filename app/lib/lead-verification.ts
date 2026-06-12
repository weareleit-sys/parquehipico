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
  raw_data?: string;
}

interface VerifyLeadOutput {
  updates: Record<string, any>;
  verification: VerificationResult;
}

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

async function fetchOfficialWebsite(website: string): Promise<{
  source: string;
  email: string;
  telefono: string;
  instagram: string;
  facebook: string;
  tiktok: string;
} | null> {
  const clean = cleanWebsite(website);
  if (!clean) return null;

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
      const emails = extractEmails(html);
      const phones = extractPhones(html);
      return {
        source: url,
        email: emails[0] || '',
        telefono: phones.find(phone => phone.startsWith('+569')) || phones[0] || '',
        instagram: extractSocial(html, 'instagram'),
        facebook: extractSocial(html, 'facebook'),
        tiktok: extractSocial(html, 'tiktok'),
      };
    } catch {
      // Try the next protocol.
    }
  }
  return null;
}

async function fetchGooglePlace(lead: VerifyLeadInput): Promise<{
  place_id: string;
  business_status: string;
  formatted_address: string;
  telefono: string;
  website: string;
} | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  const query = `${lead.empresa} ${lead.ubicacion || ''}`.trim();
  if (!query) return null;

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
        maxResultCount: 1,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      place_id: place.id || '',
      business_status: place.businessStatus || '',
      formatted_address: place.formattedAddress || '',
      telefono: normalizePhone(place.internationalPhoneNumber || place.nationalPhoneNumber || ''),
      website: cleanWebsite(place.websiteUri || ''),
    };
  } catch {
    return null;
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

  const google = await fetchGooglePlace(lead);
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
  const web = await fetchOfficialWebsite(websiteForCrawler);
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
  } else if (websiteForCrawler) {
    notes.push('No se pudo rastrear la web oficial o no expuso datos utiles.');
  }

  const cleanedInstagram = cleanSocialHandle(lead.instagram, 'instagram');
  const cleanedFacebook = cleanSocialHandle(lead.facebook, 'facebook');
  const cleanedTiktok = cleanSocialHandle(lead.tiktok, 'tiktok');
  if (!fields.instagram && cleanedInstagram) setField(fields, 'instagram', cleanedInstagram, 'gemini_limpio', 'media');
  if (!fields.facebook && cleanedFacebook) setField(fields, 'facebook', cleanedFacebook, 'gemini_limpio', 'media');
  if (!fields.tiktok && cleanedTiktok) setField(fields, 'tiktok', cleanedTiktok, 'gemini_limpio', 'media');

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
    google_business_status: google?.business_status || undefined,
    sources,
    fields,
    notes,
  };

  updates.raw_data = mergeRawData(lead.raw_data, verification);
  updates.updated_at = new Date().toISOString();

  return { updates, verification };
}
