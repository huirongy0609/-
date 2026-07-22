export const siteName = '中国信托制物业发展平台';
export const defaultSiteUrl = 'https://dev.judao.club';

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, '');
}

export function absoluteUrl(pathname: string): string {
  return `${getSiteUrl()}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
