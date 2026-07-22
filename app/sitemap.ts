import type {MetadataRoute} from 'next';
import {getTopicProvider} from '@/lib/repositories/topics';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {getWebsiteObjectHref} from '@/lib/website/foundation-view-model';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const staticRoutes = [
  '/',
  '/about',
  '/knowledge',
  '/search',
  '/topics',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publicObjects, topics] = await Promise.all([
    getPublicWebsiteObjects(),
    getTopicProvider().getTopics(),
  ]);
  const routes = [
    ...staticRoutes,
    ...publicObjects.map(getWebsiteObjectHref),
    ...topics.map((topic) => `/topics/${topic.slug}`),
  ];
  const uniqueRoutes = [...new Set(routes)];
  const now = new Date();

  return uniqueRoutes.map((route) => ({
    url: `${siteUrl.replace(/\/$/, '')}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
