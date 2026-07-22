import Link from 'next/link';
import {StatusBadge} from '@/components/platform/StatusBadge';
import {Tag} from '@/components/platform/Tag';
import {
  getWebsiteObjectHref,
  websiteTypeLabels,
  type WebsiteFoundationObject,
} from '@/lib/website/foundation-view-model';

export function WebsiteObjectCard({item}: {item: WebsiteFoundationObject}) {
  const detailHref = getWebsiteObjectHref(item);

  return (
    <article className="knowledgeCard">
      <div className="knowledgeCardMeta">
        <Tag>{websiteTypeLabels[item.type]}</Tag>
        <StatusBadge status="approved" />
      </div>
      <h3>
        <Link href={detailHref}>{item.title}</Link>
      </h3>
      <p>
        {item.version ? `版本 ${item.version}` : '版本未登记'}
        {' · '}
        {item.sources.length ? '来源已登记' : '来源待登记'}
      </p>
      <div className="knowledgeCardFooter">
        <span>{item.id}</span>
        <Link aria-label={`查看${item.title}详情`} className="platformTextLink" href={detailHref}>
          查看详情 →
        </Link>
      </div>
      <p className="sr-only">{item.relationshipCount} 条已登记关系</p>
      {item.type === 'GT_PACKAGE' && item.packageMemberCount > 0 ? (
        <div className="platformTagRow">
          <Tag>{item.packageMemberCount} 个 Package 成员</Tag>
        </div>
      ) : null}
    </article>
  );
}
