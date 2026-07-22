import {getPublishedGeoObjects, getGeoObjectPath} from '@/lib/geo/publication';
import {absoluteUrl, siteName} from '@/lib/geo/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const objects = (await getPublishedGeoObjects())
    .sort((left, right) => (right.updatedAt || '').localeCompare(left.updatedAt || ''));
  const items = objects.map((object) => `
    <item>
      <title>${xml(object.title)}</title>
      <link>${xml(absoluteUrl(getGeoObjectPath(object)))}</link>
      <guid isPermaLink="true">${xml(absoluteUrl(getGeoObjectPath(object)))}</guid>
      <description>${xml(object.summary)}</description>${rssDate(object.updatedAt)}
    </item>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xml(siteName)}</title>
    <link>${xml(absoluteUrl('/'))}</link>
    <description>已批准的信托制物业治理知识更新</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function rssDate(value: string | null): string {
  return value && !Number.isNaN(Date.parse(value)) ? `\n      <pubDate>${new Date(value).toUTCString()}</pubDate>` : '';
}

function xml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]!);
}
