export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok';

const SOCIAL_HOSTS = [
  'instagram.com',
  'facebook.com',
  'fb.com',
  'tiktok.com',
];

function stripProtocol(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');
}

function removeQueryAndHash(value: string): string {
  return value.split(/[?#]/)[0] || '';
}

function hostFromValue(value: string): string {
  const stripped = stripProtocol(value).toLowerCase();
  return stripped.split('/')[0] || '';
}

function isSocialHost(host: string): boolean {
  return SOCIAL_HOSTS.some(socialHost => host === socialHost || host.endsWith(`.${socialHost}`));
}

export function cleanWebsite(value: string | null | undefined): string {
  if (!value) return '';
  const raw = value.trim();
  const rawWithoutQuery = removeQueryAndHash(raw);
  if (!rawWithoutQuery || rawWithoutQuery.includes('@')) return '';

  const host = hostFromValue(rawWithoutQuery);
  if (!host || isSocialHost(host)) return '';

  const clean = stripProtocol(rawWithoutQuery)
    .replace(/\/+$/, '')
    .toLowerCase();

  if (!clean.includes('.') || clean.length < 4) return '';
  return clean;
}

function extractPathAfterHost(value: string, hosts: string[]): string {
  let text = value.trim().replace(/\\/g, '/');
  const lower = text.toLowerCase();
  let lastIndex = -1;
  let matchedHost = '';

  for (const host of hosts) {
    const index = lower.lastIndexOf(host);
    if (index > lastIndex) {
      lastIndex = index;
      matchedHost = host;
    }
  }

  if (lastIndex >= 0) {
    text = text.slice(lastIndex + matchedHost.length);
  }

  return text.replace(/^\/+/, '');
}

function cleanNestedUrlishHandle(value: string): string {
  return removeQueryAndHash(value)
    .replace(/^@+/, '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/^\/+/, '');
}

function firstPathSegment(value: string): string {
  return cleanNestedUrlishHandle(value).split('/')[0] || '';
}

export function cleanSocialHandle(
  value: string | null | undefined,
  network: SocialNetwork
): string {
  if (!value) return '';
  const raw = value.trim();
  if (!raw) return '';

  const networkHosts = {
    instagram: ['instagram.com'],
    facebook: ['facebook.com', 'fb.com'],
    tiktok: ['tiktok.com'],
  }[network];

  const lower = raw.toLowerCase();
  const hasNetworkHost = networkHosts.some(host => lower.includes(host));
  if (raw.includes('@') && !raw.startsWith('@') && !hasNetworkHost) return '';
  const hasOtherSocialHost = SOCIAL_HOSTS.some(host => lower.includes(host) && !networkHosts.includes(host));
  if (hasOtherSocialHost) return '';

  let candidate = hasNetworkHost ? extractPathAfterHost(raw, networkHosts) : raw;
  const candidatePath = candidate.trim().replace(/^\/+/, '');
  if (hasNetworkHost && (/^https?:\/\//i.test(candidatePath) || /^www\./i.test(candidatePath))) {
    return '';
  }

  candidate = cleanNestedUrlishHandle(candidate);

  if (!hasNetworkHost && candidate.includes('.')) return '';

  if (network === 'tiktok') {
    candidate = candidate.replace(/^@+/, '');
  }

  const segment = firstPathSegment(candidate);
  const reserved = new Set([
    'accounts',
    'explore',
    'p',
    'reel',
    'reels',
    'stories',
    'share',
    'watch',
    'events',
    'pages',
    'login',
    'profile.php',
    'http',
    'https',
  ]);
  if (!segment || reserved.has(segment.toLowerCase())) return '';

  const allowed = network === 'facebook' ? /[^a-zA-Z0-9._-]/g : /[^a-zA-Z0-9._]/g;
  return segment.replace(allowed, '');
}

export function buildWebsiteUrl(value: string | null | undefined): string {
  const website = cleanWebsite(value);
  return website ? `https://${website}` : '';
}

export function buildSocialUrl(
  network: SocialNetwork,
  value: string | null | undefined
): string {
  const handle = cleanSocialHandle(value, network);
  if (!handle) return '';
  if (network === 'instagram') return `https://www.instagram.com/${handle}/`;
  if (network === 'facebook') return `https://www.facebook.com/${handle}/`;
  return `https://www.tiktok.com/@${handle}`;
}
