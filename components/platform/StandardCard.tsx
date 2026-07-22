import {KnowledgeCard} from './KnowledgeCard';

type StandardCardProps = {
  href: string;
  title: string;
  summary: string;
  version: string;
  status: string;
};

export function StandardCard({href, title, summary, version, status}: StandardCardProps) {
  return <KnowledgeCard href={href} objectId={version} status={status} summary={summary} title={title} typeLabel="标准" />;
}
