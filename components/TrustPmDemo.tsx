'use client';

import {FormEvent, useState} from 'react';
import Link from 'next/link';
import {demoScenarios, type GovernanceAnswer} from '@/lib/trustpm/demo-data';

const typeTone: Record<string, string> = {
  JD: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  GT: 'border-teal-200 bg-teal-50 text-teal-800',
  CASE: 'border-amber-200 bg-amber-50 text-amber-800',
  LAW: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function TrustPmDemo() {
  const [question, setQuestion] = useState(demoScenarios[0].question);
  const [answer, setAnswer] = useState<GovernanceAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runAgent(nextQuestion = question) {
    const cleanQuestion = nextQuestion.trim();
    if (!cleanQuestion) return;
    setQuestion(cleanQuestion);
    setLoading(true);
    setError('');
    setAnswer(null);

    try {
      const response = await fetch('/api/trustpm', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: cleanQuestion}),
      });
      const payload = await response.json() as GovernanceAnswer & {error?: string};
      if (!response.ok) throw new Error(payload.error || 'The agent could not complete this request.');
      setAnswer(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The agent could not complete this request.');
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void runAgent();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.45fr)]">
      <section className="h-fit rounded-lg border border-[var(--line)] bg-white p-5 md:p-7 lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">Ask the agent</p>
            <h2 className="mt-2 text-xl font-semibold">A real governance question</h2>
          </div>
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">Stable demo</span>
        </div>

        <form className="mt-6" onSubmit={submit}>
          <label className="sr-only" htmlFor="governance-question">Governance question</label>
          <textarea
            className="min-h-36 w-full resize-y rounded-lg border border-[var(--line-strong)] bg-[#fbfcfb] p-4 text-[15px] leading-7 text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            id="governance-question"
            maxLength={500}
            onChange={(event) => setQuestion(event.target.value)}
            value={question}
          />
          <button
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[var(--primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e665d] disabled:cursor-wait disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Retrieving evidence…' : 'Run TrustPM AI →'}
          </button>
        </form>

        <div className="mt-7 border-t border-[var(--line)] pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--subtle)]">Three reliable scenarios</p>
          <div className="mt-3 grid gap-2">
            {demoScenarios.map((scenario) => (
              <button
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-left text-sm font-medium leading-5 text-[var(--ink)] transition hover:-translate-y-px hover:border-[var(--primary)] hover:bg-[var(--surface-soft)]"
                key={scenario.scenarioId}
                onClick={() => void runAgent(scenario.question)}
                type="button"
              >
                {scenario.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-live="polite" className="min-h-[620px] rounded-lg border border-[var(--line)] bg-white p-5 md:p-8">
        {!answer && !loading && !error ? (
          <div className="flex min-h-[560px] flex-col items-center justify-center px-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--primary-soft)] text-xl text-[var(--primary-dark)]">◎</div>
            <h2 className="mt-5 text-2xl font-semibold">Evidence before advice</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--muted)]">Choose a scenario or ask a question. The demo retrieves a controlled set of knowledge objects, then returns a structured decision path with visible limitations.</p>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line-strong)] border-t-[var(--primary-dark)]" />
            <p className="mt-4 text-sm font-medium text-[var(--muted)]">Matching knowledge objects and organizing a decision path…</p>
          </div>
        ) : null}

        {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

        {answer ? (
          <article>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">Governance brief</p>
                <h2 className="mt-2 text-2xl font-semibold">Decision support, with evidence</h2>
              </div>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">{answer.mode === 'openai' ? 'OpenAI + controlled retrieval' : 'Controlled demo retrieval'}</span>
            </div>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--subtle)]">Problem assessment</h3>
              <p className="mt-3 text-[16px] leading-8 text-[var(--ink)]">{answer.assessment}</p>
            </section>

            <section className="mt-8">
              <h3 className="text-lg font-semibold">Governance recommendations</h3>
              <ul className="mt-4 grid gap-3">
                {answer.recommendations.map((item, index) => (
                  <li className="flex gap-3 rounded-lg border border-[var(--line)] bg-[#fbfcfb] p-4 text-sm leading-6" key={item}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-dark)]">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h3 className="text-lg font-semibold">Implementation path</h3>
              <ol className="mt-4 border-l border-[var(--line-strong)] pl-5">
                {answer.steps.map((step, index) => (
                  <li className="relative pb-5 last:pb-0" key={`${step.title}-${index}`}>
                    <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-[var(--primary)] ring-4 ring-white" />
                    <strong className="text-sm">{step.title}</strong>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
              <h3 className="text-sm font-semibold text-amber-950">Risk notes</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-amber-950/80">
                {answer.risks.map((risk) => <li key={risk}>• {risk}</li>)}
              </ul>
            </section>

            <section className="mt-8">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary-dark)]">Evidence / Sources</p>
                  <h3 className="mt-2 text-lg font-semibold">Retrieved knowledge objects</h3>
                </div>
                <span className="text-xs text-[var(--subtle)]">{answer.sources.length} objects</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {answer.sources.map((source) => {
                  const content = (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${typeTone[source.type]}`}>{source.type}</span>
                        <span className="text-[11px] font-semibold text-[var(--subtle)]">{source.id}</span>
                      </div>
                      <strong className="mt-3 block text-sm leading-6">{source.title}</strong>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{source.note}</p>
                      {source.demoOnly ? <p className="mt-3 text-[11px] font-semibold text-amber-700">DEMO-ONLY OBJECT</p> : null}
                    </>
                  );
                  return source.href ? (
                    <Link className="rounded-lg border border-[var(--line)] p-4 transition hover:-translate-y-px hover:border-[var(--primary)]" href={source.href} key={source.id}>{content}</Link>
                  ) : (
                    <div className="rounded-lg border border-[var(--line)] p-4" key={source.id}>{content}</div>
                  );
                })}
              </div>
            </section>

            <p className="mt-8 border-t border-[var(--line)] pt-5 text-xs leading-5 text-[var(--subtle)]">{answer.disclosure} This prototype provides governance decision support, not legal advice.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
