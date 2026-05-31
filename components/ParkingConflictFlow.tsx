'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import {ArrowLeft, CheckCircle2, FileText, Network, ShieldAlert, Sparkles} from 'lucide-react';
import {CaseMatchPanel} from './CaseMatchPanel';
import {TrustRulePanel} from './TrustRulePanel';

type ParkingConflictDemo = {
  event: {
    title: string;
    location: string;
    communityType: string;
    riskLevel: string;
    status: string;
    summary: string;
    trigger: string;
    nextAction: string;
  };
  aiAssessment: {
    riskTypes: string[];
    riskLevel: string;
    conflicts: string[];
    recommendation: string;
  };
  trustRules: Array<{title: string; description: string}>;
  matchedCases: Array<{city: string; title: string; result: string; tags: string[]}>;
  collaboration: Array<{role: string; status: string; detail: string}>;
  timeline: Array<{time: string; title: string; description: string}>;
  outcomePreview: Array<{label: string; value: string; description: string}>;
};

type ParkingConflictFlowProps = {
  demo: ParkingConflictDemo;
};

const cardMotion = {
  hidden: {opacity: 0, y: 18},
  visible: {opacity: 1, y: 0},
};

export function ParkingConflictFlow({demo}: ParkingConflictFlowProps) {
  return (
    <main className="parking-demo-page min-h-screen bg-graphite text-data-white">
      <section className="parking-demo-hero border-b border-data-divider/70">
        <div className="command-grid" />
        <div className="deep-space-texture" />

        <motion.div
          animate="visible"
          className="relative z-10 mx-auto grid w-[min(1440px,calc(100vw-40px))] gap-5 py-8 lg:grid-cols-[1.08fr_0.92fr]"
          initial="hidden"
          transition={{staggerChildren: 0.08}}
        >
          <motion.section className="glass-panel strategic-panel rounded-panel p-6" variants={cardMotion}>
            <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-civic" href="/">
              <ArrowLeft size={16} />
              返回平台首页
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Parking Conflict Demo</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-data-white md:text-6xl">{demo.event.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-data-soft">{demo.event.summary}</p>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {[
                {label: '事件地点', value: demo.event.location},
                {label: '风险等级', value: demo.event.riskLevel},
                {label: '当前状态', value: demo.event.status},
              ].map((item) => (
                <div className="demo-fact-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.aside className="glass-panel strategic-panel rounded-panel p-6" variants={cardMotion}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">AI Risk Assessment</p>
                <h2 className="mt-2 text-2xl font-semibold text-data-white">AI研判摘要</h2>
              </div>
              <Sparkles className="text-civic" size={24} />
            </div>

            <div className="mt-5 grid gap-4">
              <div className="demo-ai-block">
                <span>风险类型</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {demo.aiAssessment.riskTypes.map((type) => (
                    <em key={type}>{type}</em>
                  ))}
                </div>
              </div>
              <div className="demo-ai-block">
                <span>主要矛盾</span>
                <ul>
                  {demo.aiAssessment.conflicts.map((conflict) => (
                    <li key={conflict}>{conflict}</li>
                  ))}
                </ul>
              </div>
              <div className="demo-ai-recommendation">
                <ShieldAlert size={17} />
                <p>{demo.aiAssessment.recommendation}</p>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </section>

      <section className="mx-auto grid w-[min(1440px,calc(100vw-40px))] gap-5 py-5 lg:grid-cols-[0.9fr_1.1fr]">
        <TrustRulePanel rules={demo.trustRules} />
        <CaseMatchPanel cases={demo.matchedCases} />
      </section>

      <section className="mx-auto grid w-[min(1440px,calc(100vw-40px))] gap-5 py-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="demo-collaboration-panel rounded-panel p-5">
          <div className="flex items-center gap-2 text-civic">
            <Network size={18} />
            <h2 className="text-2xl font-semibold text-data-white">多方协同状态</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {demo.collaboration.map((item) => (
              <article className="demo-collab-item" key={item.role}>
                <div>
                  <strong>{item.role}</strong>
                  <span>{item.status}</span>
                </div>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="demo-timeline-panel rounded-panel p-5">
          <div className="flex items-center gap-2 text-civic">
            <FileText size={18} />
            <h2 className="text-2xl font-semibold text-data-white">治理推进时间流</h2>
          </div>
          <div className="demo-timeline mt-5">
            {demo.timeline.map((item, index) => (
              <motion.article
                animate={{opacity: [0.7, 1, 0.7]}}
                key={`${item.time}-${item.title}`}
                transition={{duration: 7, delay: index * 0.45, repeat: Infinity, ease: 'easeInOut'}}
              >
                <span>{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto w-[min(1440px,calc(100vw-40px))] pb-14 pt-5">
        <section className="demo-outcome-panel rounded-panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Governance Outcome Preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-data-white">治理结果预览</h2>
            </div>
            <span className="rounded-full border border-civic/20 bg-civic/10 px-3 py-1.5 text-xs font-semibold text-civic">
              进入全国经验网络
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {demo.outcomePreview.map((item) => (
              <article className="demo-outcome-card" key={item.label}>
                <CheckCircle2 size={18} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
