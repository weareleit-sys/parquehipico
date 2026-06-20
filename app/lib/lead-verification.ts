import { cleanSocialHandle, cleanWebsite } from './lead-links';
import { LEAD_VERIFICATION_VERSION } from './lead-verification-version';

type VerificationConfidence = 'alta' | 'media' | 'baja';
type VerificationStatus = 'verificado' | 'parcial' | 'sin_verificar' | 'conflicto';

interface VerificationField {
  value: string;
  source: string;
  confidence: VerificationConfidence;
}

interface VerificationResult {
  version: number;
  status: VerificationStatus;
  checked_at: string;
  google_configured: boolean;
  google_place_id?: string;
  google_place_name?: string;
  google_formatted_address?: string;
  google_match_score?: number;
  google_business_status?: string;
  website_health?: WebsiteHealth;
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

interface WebsiteHealth {
  checked_url?: string;
  final_url?: string;
  host?: string;
  final_host?: string;
  status_code?: number;
  ok: boolean;
  redirected?: boolean;
  parked?: boolean;
  reason?: string;
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
  health?: WebsiteHealth;
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

export function parseLeadRawData(rawData: unknown): Record<string, any> {
  if (!rawData) return {};
  if (typeof rawData === 'object') return rawData as Record<string, any>;
  if (typeof rawData !== 'string') return {};
  try {
    return JSON.parse(rawData);
  } catch {
    return {};
  }
}

export function hasCurrentLeadVerification(rawData: unknown): boolean {
  const verification = parseLeadRawData(rawData).verification;
  return !!verification?.status && Number(verification.version || 0) >= LEAD_VERIFICATION_VERSION;
}

function sameHost(a: string, b: string): boolean {
  const cleanA = cleanWebsite(a).replace(/^www\./, '');
  const cleanB = cleanWebsite(b).replace(/^www\./, '');
  return !!cleanA && !!cleanB && (cleanA === cleanB || cleanA.endsWith(`.${cleanB}`) || cleanB.endsWith(`.${cleanA}`));
}

function hostFromUrlish(value: string): string {
  if (!value) return '';
  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return value
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .toLowerCase();
  }
}

function sameHostName(a: string, b: string): boolean {
  const hostA = hostFromUrlish(a);
  const hostB = hostFromUrlish(b);
  return !!hostA && !!hostB && (hostA === hostB || hostA.endsWith(`.${hostB}`) || hostB.endsWith(`.${hostA}`));
}

function isKnownSocialHost(host: string): boolean {
  const clean = host.replace(/^www\./, '').toLowerCase();
  return clean === 'instagram.com' ||
    clean.endsWith('.instagram.com') ||
    clean === 'facebook.com' ||
    clean.endsWith('.facebook.com') ||
    clean === 'fb.com' ||
    clean.endsWith('.fb.com') ||
    clean === 'tiktok.com' ||
    clean.endsWith('.tiktok.com');
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
]);

const SOCIAL_GENERIC_TOKENS = new Set([
  ...GENERIC_TOKENS,
  'evento',
  'eventos',
  'productora',
  'productoras',
  'produccion',
  'producciones',
  'agencia',
  'agencias',
  'promotora',
  'promotoras',
  'servicio',
  'servicios',
  'centro',
  'centros',
  'restaurant',
  'restaurante',
  'banqueteria',
  'banqueterias',
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

function identityTokensForLead(lead: VerifyLeadInput): string[] {
  const locationTokens = new Set(locationTermsForLead(lead).map(normalizeText));
  return meaningfulTokens(lead.empresa).filter(token => !locationTokens.has(normalizeText(token)));
}

function identityOverlapScore(lead: VerifyLeadInput, target: string): {
  score: number;
  matches: number;
  total: number;
} {
  const tokens = identityTokensForLead(lead);
  if (tokens.length === 0) return { score: 0, matches: 0, total: 0 };
  const targetText = normalizeText(target);
  const matches = tokens.filter(token => targetText.includes(token)).length;
  return { score: matches / tokens.length, matches, total: tokens.length };
}

function hostIdentityOverlapScore(host: string, lead: VerifyLeadInput): {
  score: number;
  matches: number;
  total: number;
} {
  const tokens = identityTokensForLead(lead);
  if (tokens.length === 0) return { score: 0, matches: 0, total: 0 };
  const hostText = normalizeText(hostFromUrlish(host)).replace(/\s+/g, '');
  const matches = tokens.filter(token => hostText.includes(normalizeText(token).replace(/\s+/g, ''))).length;
  return { score: matches / tokens.length, matches, total: tokens.length };
}

function emailDomainMatchesHost(email: string | null | undefined, host: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@').pop() || '';
  return sameHostName(domain, host);
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
  const identity = identityOverlapScore(lead, displayName);
  const locationExpected = locationTermsForLead(lead).length > 0;
  const locationMatches = hasLeadLocationSignal(candidateText, lead);
  const outsideLocation = hasOutsideLocationSignal(candidateText, lead);
  const websiteMatches = sameHost(lead.website || '', website);
  const score = Math.round((identity.score * 50) + (nameScore * 20) + (locationMatches ? 20 : 0) + (websiteMatches ? 10 : 0));

  if (outsideLocation && !locationMatches) {
    return { accepted: false, score, reason: 'resultado apunta a otra ciudad o pais' };
  }
  if (identity.total > 0 && identity.matches === 0 && !websiteMatches) {
    return { accepted: false, score, reason: 'resultado solo coincide por ubicacion' };
  }
  if (identity.total >= 3 && identity.matches < 2 && !websiteMatches) {
    return { accepted: false, score, reason: 'resultado no coincide con suficientes senales de identidad' };
  }
  if (locationExpected && !locationMatches && nameScore < 0.8) {
    return { accepted: false, score, reason: 'resultado no coincide con la zona solicitada' };
  }
  if (identity.score >= 0.45 && (locationMatches || !locationExpected)) {
    return { accepted: true, score, reason: 'nombre y zona coinciden' };
  }
  if ((nameScore >= 0.8 || identity.score >= 0.67) && websiteMatches && !outsideLocation) {
    return { accepted: true, score, reason: 'nombre y dominio coinciden' };
  }
  return { accepted: false, score, reason: 'nombre insuficientemente parecido' };
}

function isWebsiteRelevantToLead(host: string, html: string, lead: VerifyLeadInput): { accepted: boolean; reason: string } {
  const sample = `${host} ${html.slice(0, 120000)}`;
  const unavailable = detectUnavailableWebsite(host, html);
  if (unavailable) {
    return { accepted: false, reason: unavailable };
  }

  const nameScore = tokenOverlapScore(lead.empresa, sample);
  const identity = identityOverlapScore(lead, sample);
  const hostIdentity = hostIdentityOverlapScore(host, lead);
  const emailMatchesHost = emailDomainMatchesHost(lead.email, host);
  const locationExpected = locationTermsForLead(lead).length > 0;
  const locationMatches = hasLeadLocationSignal(sample, lead);
  const outsideLocation = hasOutsideLocationSignal(sample, lead);

  if (outsideLocation && !locationMatches) {
    return { accepted: false, reason: 'web apunta a otra ciudad o pais' };
  }
  if (identity.total > 0 && identity.matches === 0) {
    return { accepted: false, reason: 'web solo coincide por ubicacion' };
  }
  if (nameScore >= 0.67 && identity.score >= 0.34) {
    return { accepted: true, reason: 'nombre coincide en la web' };
  }
  if (nameScore >= 0.34 && identity.score >= 0.34 && (!locationExpected || locationMatches)) {
    return { accepted: true, reason: 'nombre y zona coinciden en la web' };
  }
  if (!outsideLocation && (emailMatchesHost || hostIdentity.matches >= 2 || (hostIdentity.total <= 2 && hostIdentity.matches >= 1))) {
    return { accepted: true, reason: 'dominio o email coinciden con la identidad del lead' };
  }
  if (locationExpected && !locationMatches) {
    return { accepted: false, reason: 'web no menciona la zona del lead' };
  }
  return { accepted: false, reason: 'web no contiene senales suficientes del lead' };
}

function isSocialHandleRelevant(handle: string, lead: VerifyLeadInput): boolean {
  if (!handle) return false;
  const text = normalizeText(handle).replace(/\s+/g, '');
  const tokens = meaningfulTokens(lead.empresa)
    .filter(token => !SOCIAL_GENERIC_TOKENS.has(token))
    .map(token => normalizeText(token).replace(/\s+/g, ''))
    .filter(token => token.length >= 4);
  const fallbackTokens = meaningfulTokens(lead.empresa)
    .map(token => normalizeText(token).replace(/\s+/g, ''))
    .filter(token => token.length >= 4);
  const identityTokens = tokens.length > 0 ? tokens : fallbackTokens;
  const websiteTokens = meaningfulTokens(hostFromUrlish(lead.website || '').replace(/\.[a-z.]+$/i, ''))
    .map(token => normalizeText(token).replace(/\s+/g, ''))
    .filter(token => token.length >= 4);
  const hasNameToken = identityTokens.some(token => text.includes(token));
  const hasWebsiteToken = websiteTokens.some(token => text.includes(token));
  const hasLocationToken = locationTermsForLead(lead).some(term => text.includes(normalizeText(term).replace(/\s+/g, '')));
  const hasOutsideToken = KNOWN_OUTSIDE_LOCATION_TERMS.some(term => text.includes(normalizeText(term).replace(/\s+/g, '')));
  if (hasOutsideToken && !hasLocationToken) return false;
  return hasNameToken || hasWebsiteToken;
}

function detectUnavailableWebsite(host: string, html: string): string {
  const text = normalizeText(`${host} ${html.slice(0, 80000)}`);
  const parkedSignals = [
    'domain for sale',
    'this domain is for sale',
    'buy this domain',
    'sedo domain parking',
    'parkingcrew',
    'afternic',
    'godaddy',
    'go daddy',
    'domain parked',
    'account suspended',
    'apache2 ubuntu default page',
    'index of',
    'coming soon',
    'under construction',
  ];
  const signal = parkedSignals.find(phrase => text.includes(normalizeText(phrase)));
  return signal ? `web parece inactiva o estacionada (${signal})` : '';
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
  if (!clean) return { data: null, rejected: false, health: { ok: false, reason: 'sin web valida' } };

  const urls = [`https://${clean}`, `http://${clean}`];
  let lastHealth: WebsiteHealth = { ok: false, host: clean, reason: 'web no responde' };
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        signal: timeoutSignal(7000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ParqueHipicoLeadVerifier/1.0)',
        },
      });
      const finalUrl = res.url || url;
      const finalHost = hostFromUrlish(finalUrl);
      const health: WebsiteHealth = {
        checked_url: url,
        final_url: finalUrl,
        host: clean,
        final_host: finalHost,
        status_code: res.status,
        ok: res.ok,
        redirected: !!finalHost && !sameHostName(clean, finalHost),
      };
      lastHealth = health;

      if (health.redirected && isKnownSocialHost(finalHost)) {
        const instagram = cleanSocialHandle(finalUrl, 'instagram');
        const facebook = cleanSocialHandle(finalUrl, 'facebook');
        const tiktok = cleanSocialHandle(finalUrl, 'tiktok');
        return {
          data: {
            source: finalUrl,
            email: '',
            telefono: '',
            instagram: instagram && isSocialHandleRelevant(instagram, lead) ? instagram : '',
            facebook: facebook && isSocialHandleRelevant(facebook, lead) ? facebook : '',
            tiktok: tiktok && isSocialHandleRelevant(tiktok, lead) ? tiktok : '',
          },
          rejected: true,
          reason: `web redirige a red social: ${finalHost}`,
          health: { ...health, ok: false, reason: `redirige a red social: ${finalHost}` },
        };
      }

      if (!res.ok) {
        lastHealth = { ...health, reason: `HTTP ${res.status}` };
        continue;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        lastHealth = { ...health, ok: false, reason: `contenido no HTML: ${contentType || 'desconocido'}` };
        continue;
      }
      const html = await res.text();
      const relevance = isWebsiteRelevantToLead(clean, html, lead);
      if (!relevance.accepted) {
        const parked = relevance.reason.includes('inactiva') || relevance.reason.includes('estacionada');
        return {
          data: null,
          rejected: true,
          reason: `${relevance.reason}: ${clean}`,
          health: { ...health, ok: false, parked, reason: relevance.reason },
        };
      }
      const emails = extractEmails(html);
      const phones = extractPhones(html);
      return {
        data: {
          source: finalUrl,
          email: emails[0] || '',
          telefono: phones.find(phone => phone.startsWith('+569')) || phones[0] || '',
          instagram: extractSocial(html, 'instagram'),
          facebook: extractSocial(html, 'facebook'),
          tiktok: extractSocial(html, 'tiktok'),
        },
        rejected: false,
        health,
      };
    } catch {
      lastHealth = { ok: false, host: clean, checked_url: url, reason: 'timeout o error de red' };
    }
  }
  return { data: null, rejected: false, health: lastHealth };
}

async function fetchGooglePlace(lead: VerifyLeadInput): Promise<GooglePlaceLookup> {
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_API_KEY;
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
  const parsed = parseLeadRawData(rawData);
  delete parsed.verification_attempt;
  return JSON.stringify({
    ...parsed,
    verification,
  });
}

export async function verifyLeadData(lead: VerifyLeadInput): Promise<VerifyLeadOutput> {
  const googleConfigured = !!(process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_API_KEY);
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
    notes.push('GOOGLE_MAPS_API_KEY o MAPS_API_KEY no configurada; se omitio verificacion Google.');
  }

  const websiteForCrawler = updates.website || google?.website || lead.website || '';
  const webLookup = await fetchOfficialWebsite(websiteForCrawler, lead);
  const web = webLookup.data;
  const clearedFields: string[] = [];
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
  }

  if (webLookup.rejected) {
    notes.push(`Web descartada: ${webLookup.reason || 'no coincide con el lead'}.`);
    const rejectReason = webLookup.reason || '';
    const clearConflictingWebsite = rejectReason.includes('otra ciudad o pais') ||
      rejectReason.includes('inactiva') ||
      rejectReason.includes('estacionada') ||
      rejectReason.includes('redirige a red social');
    const clearRejectedWebsite = clearConflictingWebsite;
    if (clearRejectedWebsite && lead.website && sameHost(lead.website, websiteForCrawler)) {
      updates.website = '';
      clearedFields.push('website');
    }
    const leadInstagram = cleanSocialHandle(lead.instagram, 'instagram');
    const leadFacebook = cleanSocialHandle(lead.facebook, 'facebook');
    const leadTiktok = cleanSocialHandle(lead.tiktok, 'tiktok');
    if (!fields.instagram && clearConflictingWebsite && leadInstagram && !isSocialHandleRelevant(leadInstagram, lead)) {
      updates.instagram = '';
      clearedFields.push('instagram');
    }
    if (!fields.facebook && clearConflictingWebsite && leadFacebook && !isSocialHandleRelevant(leadFacebook, lead)) {
      updates.facebook = '';
      clearedFields.push('facebook');
    }
    if (!fields.tiktok && clearConflictingWebsite && leadTiktok && !isSocialHandleRelevant(leadTiktok, lead)) {
      updates.tiktok = '';
      clearedFields.push('tiktok');
    }
  } else if (!web && websiteForCrawler) {
    notes.push(webLookup.health?.reason || 'No se pudo rastrear la web oficial o no expuso datos utiles.');
  }

  const cleanedInstagram = cleanSocialHandle(updates.instagram !== undefined ? updates.instagram : lead.instagram, 'instagram');
  const cleanedFacebook = cleanSocialHandle(updates.facebook !== undefined ? updates.facebook : lead.facebook, 'facebook');
  const cleanedTiktok = cleanSocialHandle(updates.tiktok !== undefined ? updates.tiktok : lead.tiktok, 'tiktok');
  if (!fields.instagram && cleanedInstagram && !isSocialHandleRelevant(cleanedInstagram, lead)) {
    updates.instagram = '';
    clearedFields.push('instagram');
    notes.push(`Instagram descartado: ${cleanedInstagram} no coincide con el lead.`);
  }
  if (!fields.facebook && cleanedFacebook && !isSocialHandleRelevant(cleanedFacebook, lead)) {
    updates.facebook = '';
    clearedFields.push('facebook');
    notes.push(`Facebook descartado: ${cleanedFacebook} no coincide con el lead.`);
  }
  if (!fields.tiktok && cleanedTiktok && !isSocialHandleRelevant(cleanedTiktok, lead)) {
    updates.tiktok = '';
    clearedFields.push('tiktok');
    notes.push(`TikTok descartado: ${cleanedTiktok} no coincide con el lead.`);
  }
  if (!fields.instagram && cleanedInstagram && updates.instagram !== '') setField(fields, 'instagram', cleanedInstagram, 'gemini_limpio', 'media');
  if (!fields.facebook && cleanedFacebook && updates.facebook !== '') setField(fields, 'facebook', cleanedFacebook, 'gemini_limpio', 'media');
  if (!fields.tiktok && cleanedTiktok && updates.tiktok !== '') setField(fields, 'tiktok', cleanedTiktok, 'gemini_limpio', 'media');

  const highConfidenceCount = Object.values(fields).filter(field => field?.confidence === 'alta').length;
  const status: VerificationStatus = clearedFields.length > 0 && highConfidenceCount === 0
    ? 'conflicto'
    : highConfidenceCount >= 2
    ? 'verificado'
    : highConfidenceCount === 1
    ? 'parcial'
    : Object.keys(fields).length > 0
    ? 'sin_verificar'
    : 'sin_verificar';

  const verification: VerificationResult = {
    version: LEAD_VERIFICATION_VERSION,
    status,
    checked_at: new Date().toISOString(),
    google_configured: googleConfigured,
    google_place_id: google?.place_id || undefined,
    google_place_name: google?.display_name || undefined,
    google_formatted_address: google?.formatted_address || undefined,
    google_match_score: google?.match_score || undefined,
    google_business_status: google?.business_status || undefined,
    website_health: webLookup.health,
    sources,
    fields,
    notes: clearedFields.length > 0 ? [...notes, `Campos limpiados: ${[...new Set(clearedFields)].join(', ')}.`] : notes,
  };

  updates.raw_data = mergeRawData(lead.raw_data, verification);
  updates.updated_at = new Date().toISOString();

  return { updates, verification };
}
