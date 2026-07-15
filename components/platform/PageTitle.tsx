import {StatusBadge} from './StatusBadge';
import {Tag} from './Tag';

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: string | null;
  meta?: string[];
  tags?: string[];
};

export function PageTitle({eyebrow, title, description, status, meta = [], tags = []}: PageTitleProps) {
  return (
    <header className="platformPageTitle">
      <div className="platformPageTitleMeta">
        {eyebrow ? <Tag>{eyebrow}</Tag> : null}
        {status ? <StatusBadge status={status} /> : null}
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {tags.length ? (
        <div className="platformTagRow">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}
    </header>
  );
}
