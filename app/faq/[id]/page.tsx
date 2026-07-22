import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {GeoKnowledgeDetail} from '@/components/geo/GeoKnowledgeDetail';
import {buildGeoMetadata} from '@/lib/geo/metadata';
import {getPublishedGeoObject, getPublishedGeoObjects} from '@/lib/geo/publication';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
  const object = await getPublishedGeoObject('QA', params.id);
  return object ? buildGeoMetadata(object) : {title: '标准问答未找到', robots: {index: false, follow: false}};
}

export default async function FaqDetailPage({params}: {params: {id: string}}) {
  const [object, allObjects] = await Promise.all([
    getPublishedGeoObject('QA', params.id),
    getPublishedGeoObjects(),
  ]);
  if (!object) notFound();
  return <GeoKnowledgeDetail allObjects={allObjects} object={object} />;
}
