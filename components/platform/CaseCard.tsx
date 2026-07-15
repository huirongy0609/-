import {KnowledgeCard} from './KnowledgeCard';

type CaseCardProps = {
  href: string;
  title: string;
  summary: string;
  location: string;
  status: string;
  tags?: string[];
};

export function CaseCard({href, title, summary, location, status, tags = []}: CaseCardProps) {
  return <KnowledgeCard href={href} objectId={location} status={status} summary={summary} tags={tags} title={title} typeLabel="案例" />;
}
