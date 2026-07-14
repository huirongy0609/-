import type {MetadataRoute} from 'next';
import {getCaseViews} from '@/lib/repositories/cases';
import {getFoundationKnowledgeObjects} from '@/lib/repositories/foundation';
import {getPlatformStandards} from '@/lib/repositories/standards';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const staticRoutes = [
  '/',
  '/books',
  '/cases',
  '/demo',
  '/demo/finish',
  '/galaxy',
  '/golden-steward-world',
  '/golden-steward-world/archive',
  '/golden-steward-world/certification',
  '/golden-steward-world/first-gate',
  '/golden-steward-world/map',
  '/golden-steward-world/plan',
  '/intelligence',
  '/knowledge',
  '/map',
  '/newbie-village',
  '/parking-conflict-demo',
  '/reports',
  '/research',
  '/standards',
  '/student',
  '/student/ai-copy',
  '/student/archive',
  '/student/certification',
  '/student/course',
  '/student/journey',
  '/student/plan',
  '/student/portfolio',
  '/student/tasks',
  '/submit',
  '/trust-world',
  '/village',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [knowledgeObjects, standards] = await Promise.all([
    getFoundationKnowledgeObjects(),
    getPlatformStandards(),
  ]);
  const routes = [
    ...staticRoutes,
    ...getCaseViews().map((item) => `/cases/${item.id}`),
    ...knowledgeObjects.map((item) => `/knowledge/${item.id.toLowerCase()}`),
    ...standards.map((item) => `/standards/${item.slug}`),
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
