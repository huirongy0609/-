export type EvidenceSource = {
  id: string;
  type: 'JD' | 'GT' | 'CASE' | 'LAW';
  title: string;
  note: string;
  href?: string;
  demoOnly?: boolean;
};

export type GovernanceAnswer = {
  scenarioId: string;
  question: string;
  assessment: string;
  recommendations: string[];
  steps: Array<{title: string; detail: string}>;
  risks: string[];
  sources: EvidenceSource[];
  mode: 'demo' | 'openai';
  disclosure: string;
};

export type DemoScenario = Omit<GovernanceAnswer, 'mode' | 'disclosure'> & {
  shortLabel: string;
  keywords: string[];
};

export const demoScenarios: DemoScenario[] = [
  {
    scenarioId: 'fee-collection',
    shortLabel: 'Improve fee collection',
    question: 'How can a residential community improve property fee collection without increasing conflict?',
    keywords: ['fee', 'collection', 'arrears', 'conflict', '物业费', '催缴', '欠费'],
    assessment: 'Treat low collection as a trust and governance signal before treating it as a debt-recovery problem. Residents need to see how fees connect to an agreed service scope, an open budget, and a traceable responsibility chain.',
    recommendations: [
      'Publish a plain-language budget-to-service map before launching a collection campaign.',
      'Separate genuine affordability cases, service disputes, and habitual arrears so each receives a proportionate response.',
      'Use a visible issue ledger with owners, deadlines, and closure evidence for recurring service complaints.',
    ],
    steps: [
      {title: 'Diagnose', detail: 'Review arrears by reason, building, time period, and unresolved service issue; do not begin with a one-size-fits-all notice.'},
      {title: 'Make the exchange visible', detail: 'Show the approved service scope, cost assumptions, monthly execution, and variance in one owner-readable view.'},
      {title: 'Close disputes', detail: 'Assign each disputed service issue to a responsible party and publish completion evidence before escalating collection.'},
      {title: 'Use graduated follow-up', detail: 'Move from explanation and reconciliation to formal notice only after the evidence and response path are clear.'},
    ],
    risks: [
      'Aggressive collection before service disputes are reconciled can deepen resistance.',
      'Publishing totals without scope, variance, and evidence may create more suspicion rather than transparency.',
      'Any formal recovery action requires review under the applicable contract and local law.',
    ],
    sources: [
      {id: 'JD009', type: 'JD', title: 'What is an open budget?', note: 'Defines a budget as a shared governance instrument rather than a closed internal estimate.', href: '/knowledge/jd009'},
      {id: 'JD004', type: 'JD', title: 'What is fiduciary duty?', note: 'Frames the manager\'s responsibility to act transparently and accountably.', href: '/knowledge/jd004'},
      {id: 'GT-DEMO-01', type: 'GT', title: 'Fee collection trust-repair checklist', note: 'Controlled demo checklist synthesized from the platform\'s governance workflow.', demoOnly: true},
      {id: 'CASE-DEMO-01', type: 'CASE', title: 'Budget-first collection intervention', note: 'Illustrative demo case; not presented as a verified public case.', demoOnly: true},
    ],
  },
  {
    scenarioId: 'budget-variance',
    shortLabel: 'Handle a budget overrun',
    question: 'What should a property manager do when the annual budget is likely to be exceeded?',
    keywords: ['budget', 'overrun', 'variance', 'cost', '超预算', '预算', '成本'],
    assessment: 'A forecast overrun is a governance decision point. The priority is to make the variance visible early, preserve the authorization chain, and present options before additional spending becomes irreversible.',
    recommendations: [
      'Freeze non-essential discretionary spending while validating the forecast.',
      'Explain each material variance by cause, responsibility, timing, and service impact.',
      'Present decision options with consequences rather than requesting a blank approval for more money.',
    ],
    steps: [
      {title: 'Reforecast', detail: 'Compare actuals, committed costs, and remaining obligations against the approved budget.'},
      {title: 'Build the evidence pack', detail: 'Attach contracts, quotations, work records, and the reason each variance could not be avoided.'},
      {title: 'Prepare options', detail: 'Show defer, reduce scope, reallocate, or seek additional authorization—with service and risk effects.'},
      {title: 'Record the decision', detail: 'Use the contractually required decision process and retain a traceable resolution and execution log.'},
    ],
    risks: [
      'Retrospective approval weakens accountability and may breach the agreed authorization process.',
      'Cutting essential safety or statutory work can transfer financial pressure into operational risk.',
      'Applicable contract, owner-resolution, and local legal requirements must be checked before reallocating funds.',
    ],
    sources: [
      {id: 'JD009', type: 'JD', title: 'What is an open budget?', note: 'Supports visible assumptions, execution, and variance handling.', href: '/knowledge/jd009'},
      {id: 'JD001', type: 'JD', title: 'What is trust?', note: 'Provides the underlying relationship and accountability frame.', href: '/knowledge/jd001'},
      {id: 'GT-DEMO-02', type: 'GT', title: 'Budget variance decision path', note: 'Controlled demo workflow synthesized from existing platform materials.', demoOnly: true},
      {id: 'LAW-NOTE', type: 'LAW', title: 'Applicable contract and local rules', note: 'Placeholder reminder to verify jurisdiction-specific authority; not a legal citation.', demoOnly: true},
    ],
  },
  {
    scenarioId: 'public-revenue',
    shortLabel: 'Make public revenue transparent',
    question: 'How should a community make shared-area public revenue transparent and accountable?',
    keywords: ['revenue', 'shared area', 'public income', 'disclosure', '公共收益', '公区', '透明'],
    assessment: 'Transparency requires a complete evidence chain, not a single income total. The community should be able to trace each revenue source from authorization and contract through collection, custody, use, and disclosure.',
    recommendations: [
      'Create a source register covering space, operator, contract, price basis, billing period, and payment status.',
      'Separate revenue custody and use records, with clear approval rules and reconciliations.',
      'Publish a compact recurring statement plus drill-down evidence for questions and audits.',
    ],
    steps: [
      {title: 'Inventory', detail: 'List every shared-area revenue source and identify missing contracts, expired authorizations, or collection gaps.'},
      {title: 'Reconcile', detail: 'Match contracts, invoices or receipts, bank entries, and the management ledger.'},
      {title: 'Disclose', detail: 'Publish opening balance, income, expenses, closing balance, material contracts, and unresolved exceptions.'},
      {title: 'Govern exceptions', detail: 'Assign discrepancies, set closure dates, and record how material uses of funds are authorized.'},
    ],
    risks: [
      'A summary without contract and cash evidence can conceal leakage or duplicate counting.',
      'Personal or commercially sensitive information must be redacted before public disclosure.',
      'Ownership, tax, custody, and decision requirements vary by jurisdiction and require local review.',
    ],
    sources: [
      {id: 'JD004', type: 'JD', title: 'What is fiduciary duty?', note: 'Supports accountable stewardship of shared interests.', href: '/knowledge/jd004'},
      {id: 'JD005', type: 'JD', title: 'What is a fiduciary relationship?', note: 'Clarifies the relationship between authority, entrusted assets, and accountability.', href: '/knowledge/jd005'},
      {id: 'GT-DEMO-03', type: 'GT', title: 'Public revenue evidence-chain checklist', note: 'Controlled demo checklist synthesized from platform governance materials.', demoOnly: true},
      {id: 'CASE-DEMO-03', type: 'CASE', title: 'Shared-area revenue reconciliation', note: 'Illustrative demo case; not presented as a verified public case.', demoOnly: true},
    ],
  },
];

export function findDemoScenario(question: string) {
  const normalized = question.toLowerCase();
  let best = demoScenarios[0];
  let bestScore = -1;

  for (const scenario of demoScenarios) {
    const score = scenario.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      best = scenario;
      bestScore = score;
    }
  }

  return best;
}

export function toDemoAnswer(scenario: DemoScenario, question = scenario.question): GovernanceAnswer {
  return {
    ...scenario,
    question,
    mode: 'demo',
    disclosure: 'Controlled Demo Mode: the system matched this question to a curated governance scenario and retrieved a fixed evidence set. Demo-only GT and CASE items are clearly labelled; they are not represented as published Foundation objects.',
  };
}
