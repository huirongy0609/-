import Link from 'next/link';

type RelationItem = {
  label: string;
  href?: string;
  value?: string;
};

type KnowledgeRelationProps = {
  items: RelationItem[];
};

export function KnowledgeRelation({items}: KnowledgeRelationProps) {
  return (
    <section className="knowledgeRelation" aria-label="知识关系">
      {items.map((item) => {
        const content = (
          <>
            <span>{item.label}</span>
            <strong>{item.value || '待补充'}</strong>
          </>
        );
        return item.href ? (
          <Link className="knowledgeRelationItem" href={item.href} key={`${item.label}-${item.value}`}>
            {content}
          </Link>
        ) : (
          <div className="knowledgeRelationItem" key={`${item.label}-${item.value}`}>
            {content}
          </div>
        );
      })}
    </section>
  );
}
