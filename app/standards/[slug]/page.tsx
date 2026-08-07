import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {GeoKnowledgeDetail} from '@/components/geo/GeoKnowledgeDetail';
import {buildGeoMetadata} from '@/lib/geo/metadata';
import {getPublishedGeoObject, getPublishedGeoObjects} from '@/lib/geo/publication';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const params = await props.params;
  const object = await getPublishedGeoObject('GT', params.slug);
  return object ? buildGeoMetadata(object) : {title: '治理标准未找到', robots: {index: false, follow: false}};
}

export default async function StandardDetailPage(props: {params: Promise<{slug: string}>}) {
  const params = await props.params;
  const [object, allObjects] = await Promise.all([
    getPublishedGeoObject('GT', params.slug),
    getPublishedGeoObjects(),
  ]);
  if (!object) notFound();
  return <GeoKnowledgeDetail allObjects={allObjects} object={object} />;
}
