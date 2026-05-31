type MatchedCase = {
  city: string;
  title: string;
  result: string;
  tags: string[];
};

type CaseMatchPanelProps = {
  cases: MatchedCase[];
};

export function CaseMatchPanel({cases}: CaseMatchPanelProps) {
  return (
    <section className="case-match-panel rounded-panel p-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">National Case Matching</p>
        <h2 className="mt-2 text-2xl font-semibold text-data-white">全国案例复用建议</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {cases.map((item) => (
          <article className="case-match-card" key={`${item.city}-${item.title}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{item.city}</span>
              <em>可复用</em>
            </div>
            <h3>{item.title}</h3>
            <p>{item.result}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
