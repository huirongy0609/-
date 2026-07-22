import type {MetadataRoute} from 'next';
import {getTopicProvider} from '@/lib/repositories/topics';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {getWebsiteObjectHref} from '@/lib/website/foundation-view-model';
import {getSiteUrl} from '@/lib/geo/site';

const siteUrl = getSiteUrl();

const staticRoutes = [
  '/',
  '/about',
  '/knowledge',
  '/search',
  '/topics',
  '/articles',
  '/faq',
  '/standards',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publicObjects, topics] = await Promise.all([
    getPublicWebsiteObjects(),
    getTopicProvider().getTopics(),
  ]);
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const route of staticRoutes) {
    entries.set(route, {
      url: `${siteUrl}${route}`,
      changeFrequency: 'weekly',
      priority: route === '/' ? 1 : 0.7,
    });
  }
  for (const object of publicObjects) {
    const route = getWebsiteObjectHref(object);
    entries.set(route, {
      url: `${siteUrl}${route}`,
      ...(isValidDate(object.updatedAt) ? {lastModified: object.updatedAt!} : {}),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }
  for (const topic of topics) {
    const route = `/topics/${topic.slug}`;
    entries.set(route, {url: `${siteUrl}${route}`, changeFrequency: 'weekly', priority: 0.7});
  }
  return [...entries.values()];
}

function isValidDate(value: string | null): boolean {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
}
