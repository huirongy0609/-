import type {Metadata} from 'next';
import {absoluteUrl, siteName} from '@/lib/geo/site';
import {
  geoTypeLabels,
  getGeoObjectPath,
  type PublishedGeoObject,
} from '@/lib/geo/publication';

export function buildGeoMetadata(object: PublishedGeoObject): Metadata {
  const canonicalPath = getGeoObjectPath(object);
  const description = normalizeDescription(object.summary);
  return {
    title: {absolute: `${object.title}｜${siteName}`},
    description,
    alternates: {canonical: canonicalPath},
    keywords: object.tags,
    openGraph: {
      title: object.title,
      description,
      type: 'article',
      url: canonicalPath,
      siteName,
      locale: 'zh_CN',
      modifiedTime: validDate(object.updatedAt) || undefined,
      images: [{url: '/brand/judao-logo-seal.png', alt: siteName}],
    },
    twitter: {
      card: 'summary',
      title: object.title,
      description,
      images: ['/brand/judao-logo-seal.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function buildContentJsonLd(object: PublishedGeoObject): Record<string, unknown> {
  const url = absoluteUrl(getGeoObjectPath(object));
  const common = {
    '@context': 'https://schema.org',
    '@id': `${url}#content`,
    url,
    name: object.title,
    headline: object.title,
    description: normalizeDescription(object.summary),
    inLanguage: 'zh-CN',
    isPartOf: {'@id': `${absoluteUrl('/')}#website`},
    publisher: {'@id': `${absoluteUrl('/')}#organization`},
    mainEntityOfPage: {'@id': url},
    keywords: object.tags.join(', '),
    dateModified: validDate(object.updatedAt) || undefined,
    version: object.version || undefined,
  };

  if (object.type === 'JD') {
    return {...common, '@type': 'DefinedTerm', termCode: object.id, inDefinedTermSet: absoluteUrl('/knowledge')};
  }
  if (object.type === 'QA') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${url}#content`,
      url,
      inLanguage: 'zh-CN',
      mainEntity: [{
        '@type': 'Question',
        name: object.title,
        acceptedAnswer: {'@type': 'Answer', text: plainText(object.body || object.summary)},
      }],
    };
  }
  return {...common, '@type': object.type === 'GT' ? 'TechArticle' : 'Article', articleSection: geoTypeLabels[object.type]};
}

export const rootJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${absoluteUrl('/')}#organization`,
    name: '聚道',
    alternateName: '聚道研究院',
    url: absoluteUrl('/'),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: siteName,
    url: absoluteUrl('/'),
    inLanguage: 'zh-CN',
    publisher: {'@id': `${absoluteUrl('/')}#organization`},
  },
];

function normalizeDescription(value: string): string {
  const normalized = plainText(value);
  return normalized.length > 160 ? `${normalized.slice(0, 158)}…` : normalized;
}

function plainText(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/[*_`#>|\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
}

function validDate(value: string | null): string | null {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}
