type TrustRule = {
  title: string;
  description: string;
};

type TrustRulePanelProps = {
  rules: TrustRule[];
};

export function TrustRulePanel({rules}: TrustRulePanelProps) {
  return (
    <section className="trust-rule-panel rounded-panel p-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Trust Governance Rules</p>
        <h2 className="mt-2 text-2xl font-semibold text-data-white">信托制规则提示</h2>
        <p className="mt-3 text-sm leading-7 text-data-soft">
          本事件不是普通停车纠纷，而是涉及公共收益透明、预算规则、权责边界、业主知情权和协同决策机制。
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {rules.map((rule, index) => (
          <article className="trust-rule-item" key={rule.title}>
            <span>0{index + 1}</span>
            <div>
              <h3>{rule.title}</h3>
              <p>{rule.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
