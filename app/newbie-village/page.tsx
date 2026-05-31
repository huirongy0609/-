import type {Metadata} from 'next';
import {NewbieVillageExperience} from '@/components/NewbieVillageExperience';

export const metadata: Metadata = {
  title: '信托制世界 · 新手村',
  description: '通过剧情探索理解信托制物业服务模式如何重新理顺社区治理结构。',
};

export default function NewbieVillagePage() {
  return <NewbieVillageExperience />;
}
