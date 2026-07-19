import type {Metadata} from 'next';
import {TrustPmDemo} from '@/components/TrustPmDemo';

export const metadata: Metadata = {
  title: 'TrustPM AI — Evidence-based property governance',
  description: 'AI agents that help property managers make transparent, trustworthy, evidence-based decisions using expert knowledge, regulations, and operational standards.',
};

const proofPoints = [
  {label: 'Knowledge first', text: 'Structured JD, GT, regulation, and case objects before generation.'},
  {label: 'Traceable', text: 'Every brief exposes the evidence set and the status of each source.'},
  {label: 'Actionable', text: 'Assessment, recommendations, implementation path, and risk notes.'},
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-[var(--ink)]">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto w-[min(1120px,calc(100vw-32px))] pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary-dark)]">OpenAI Hackathon MVP</span>
              <span className="text-xs font-medium text-[var(--subtle)]">Property governance · Knowledge First AI</span>
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-7xl">TrustPM AI</h1>
            <p className="mt-5 max-w-3xl text-xl font-medium leading-8 text-[var(--ink)] md:text-2xl md:leading-9">AI agents that help property managers make transparent, trustworthy, evidence-based decisions.</p>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--muted)]">A focused prototype that retrieves structured governance knowledge before generating advice—so the reasoning path, evidence, and limitations stay visible.</p>
            <a className="mt-8 inline-flex rounded-lg bg-[var(--primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e665d]" href="#demo">Try the live demo →</a>
          </div>

          <div className="mt-12 grid gap-4 border-t border-[var(--line)] pt-6 md:grid-cols-3">
            {proofPoints.map((item) => (
              <div className="border-l-2 border-[var(--primary-soft)] pl-4" key={item.label}>
                <strong className="text-sm">{item.label}</strong>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100vw-32px))] py-14 md:py-20" id="demo">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">Single closed-loop demo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">From a difficult question to a traceable decision path</h2>
          <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">The prototype uses controlled local retrieval for stability. With an OpenAI API key, GPT-5.6 organizes the retrieved evidence into the same constrained answer structure. No unpublished capability is presented as complete.</p>
        </div>
        <TrustPmDemo />
      </section>
    </main>
  );
}
