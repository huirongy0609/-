import {MarkdownView} from '@/components/MarkdownView';

type ArticleBodyProps = {
  source?: string;
  emptyText?: string;
};

export function ArticleBody({source, emptyText = '当前对象已经登记，但暂未提供可读取正文。'}: ArticleBodyProps) {
  if (!source) {
    return <section className="articleBody articleBodyEmpty">{emptyText}</section>;
  }

  return (
    <section className="articleBody">
      <MarkdownView source={source} />
    </section>
  );
}
