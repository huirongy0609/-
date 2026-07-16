import {StatusBadge} from '@/components/platform/StatusBadge';
import {Tag} from '@/components/platform/Tag';
import {
  websiteTypeLabels,
  type WebsiteFoundationObject,
} from '@/lib/website/foundation-view-model';

export function WebsiteObjectCard({item}: {item: WebsiteFoundationObject}) {
  return (
    <article className="knowledgeCard">
      <div className="knowledgeCardMeta">
        <Tag>{websiteTypeLabels[item.type]}</Tag>
        <StatusBadge status="approved" />
      </div>
      <h3>{item.title}</h3>
      <p>
        {item.version ? `版本 ${item.version}` : '版本未登记'}
        {' · '}
        {item.sources.length ? '来源已登记' : '来源待登记'}
      </p>
      <div className="knowledgeCardFooter">
        <span>{item.id}</span>
        <span>{item.relationshipCount} 条关系</span>
      </div>
      {item.type === 'GT_PACKAGE' && item.packageMemberCount > 0 ? (
        <div className="platformTagRow">
          <Tag>{item.packageMemberCount} 个 Package 成员</Tag>
        </div>
      ) : null}
    </article>
  );
}
