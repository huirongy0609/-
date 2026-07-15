import Link from 'next/link';
import {Tag} from './Tag';
import {StatusBadge} from './StatusBadge';

type KnowledgeCardProps = {
  href: string;
  title: string;
  summary: string;
  typeLabel?: string;
  objectId?: string;
  status?: string | null;
  tags?: string[];
  featured?: boolean;
};

export function KnowledgeCard({href, title, summary, typeLabel, objectId, status, tags = [], featured = false}: KnowledgeCardProps) {
  return (
    <Link className={featured ? 'knowledgeCard knowledgeCardFeatured' : 'knowledgeCard'} href={href}>
      <div className="knowledgeCardMeta">
        {typeLabel ? <Tag>{typeLabel}</Tag> : null}
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <div className="knowledgeCardFooter">
        <span>{objectId || '查看详情'}</span>
        <span aria-hidden="true">→</span>
      </div>
      {tags.length ? (
        <div className="platformTagRow">
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
