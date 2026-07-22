import {KnowledgeCard} from '@/components/platform/KnowledgeCard';
import {foundationTypeLabels, lifecycleLabels, type FoundationKnowledgeObject} from '@/lib/domain/foundation';

export function FoundationObjectCard({item}: {item: FoundationKnowledgeObject}) {
  const status = item.lifecycleStatus ? lifecycleLabels[item.lifecycleStatus] : '状态未登记';

  return (
    <KnowledgeCard
      href={`/knowledge/${item.id.toLowerCase()}`}
      objectId={item.id}
      status={status}
      summary={item.summary}
      tags={[item.category, ...item.tags]}
      title={item.title}
      typeLabel={foundationTypeLabels[item.type]}
    />
  );
}
