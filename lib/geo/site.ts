export const siteName = '信托制物业';
export const siteDescription = '信托制物业的专业知识与实践平台，持续发布治理词典、标准、问答、案例与研究内容。';
export const productionSiteUrl = 'https://judao.club';
export const localSiteUrl = 'http://localhost:3000';

export function getSiteUrl(): string {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) return normalizeSiteUrl(configuredSiteUrl, 'NEXT_PUBLIC_SITE_URL');

  const vercelPreviewUrl = getVercelPreviewUrl();
  if (vercelPreviewUrl) return vercelPreviewUrl;

  return process.env.NODE_ENV === 'production' ? productionSiteUrl : localSiteUrl;
}

export function absoluteUrl(pathname: string): string {
  return `${getSiteUrl()}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function getVercelPreviewUrl(): string | null {
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (!vercelUrl || process.env.VERCEL_ENV === 'production') return null;
  return normalizeSiteUrl(vercelUrl, 'VERCEL_URL');
}

function normalizeSiteUrl(value: string, source: string): string {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('unsupported protocol');
    return url.toString().replace(/\/$/, '');
  } catch {
    throw new Error(`${source} must be a valid HTTP(S) URL.`);
  }
}
