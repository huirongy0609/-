import type {MetadataRoute} from 'next';
import {getSiteUrl} from '@/lib/geo/site';

const siteUrl = getSiteUrl();
const privatePaths = ['/api/', '/admin/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {userAgent: '*', allow: '/', disallow: privatePaths},
      {userAgent: 'Googlebot', allow: '/', disallow: privatePaths},
      {userAgent: 'Bingbot', allow: '/', disallow: privatePaths},
      {userAgent: 'OAI-SearchBot', allow: '/', disallow: privatePaths},
      {userAgent: 'ChatGPT-User', allow: '/', disallow: privatePaths},
      {userAgent: 'PerplexityBot', allow: '/', disallow: privatePaths},
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
