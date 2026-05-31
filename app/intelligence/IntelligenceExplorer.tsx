'use client';

import {useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FileSearch,
  GitBranch,
  History,
  Network,
  Orbit,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import categories from '@/data/categories.json';

type IntelligenceItemView = {
  id: string;
  title: string;
  category: string;
  region: string;
  city: string;
  source: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  url: string;
  aiSummaryStatus: string;
};

const agents = [
  {name: '风险感知 Agent', role: '城市风险雷达', icon: Radar, tone: 'amber', task: '识别舆情、物业纠纷与公共收益风险'},
  {name: 'AI治理研判 Agent', role: 'AI战略参谋', icon: BrainCircuit, tone: 'teal', task: '生成摘要、判断等级、推演治理路径'},
  {name: '政策解析 Agent', role: '城市治理法则引擎', icon: FileSearch, tone: 'teal', task: '解析政策、匹配法规、提取治理规则'},
  {name: '社区协同 Agent', role: '多方协同助手', icon: Network, tone: 'teal', task: '连接物业、社区、街道、业委会与专家'},
  {name: '案例学习 Agent', role: '全国案例复用助手', icon: History, tone: 'teal', task: '学习历史案例、匹配城市问题'},
  {name: '未来推演 Agent', role: '风险趋势研判助手', icon: Orbit, tone: 'muted', task: '推演风险路径、预测协同效果'},
];

const collaborationFlow = [
  '治理信号进入',
  '风险感知',
  'AI研判',
  '政策解析',
  '社区协同',
  '案例学习',
  '未来推演',
  '案例沉淀',
];

export function IntelligenceExplorer({intelligence}: {intelligence: IntelligenceItemView[]}) {
  const [category, setCategory] = useState('全部');
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const key = keyword.trim();
    return intelligence.filter((item) => {
      const matchCategory = category === '全部' || item.category === category;
      const matchKeyword =
        !key ||
        [item.title, item.summary, item.city, item.region, item.source, item.tags.join(' ')].some((value) =>
          value.includes(key),
        );
      return matchCategory && matchKeyword;
    });
  }, [intelligence, category, keyword]);

  const featured = filtered[0] || intelligence[0];

  return (
    <main className="agent-runtime-page min-h-screen overflow-hidden bg-graphite text-data-white">
      <section className="agent-runtime-shell relative overflow-hidden">
        <div className="runtime-deep-field" />
        <div className="runtime-city-texture" />

        <div className="relative z-10 mx-auto grid w-[min(1580px,calc(100vw-40px))] gap-5 py-8 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
          <motion.aside
            animate={{opacity: 1, y: 0}}
            className="glass-panel strategic-panel order-2 rounded-panel p-5 lg:order-1"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.62, ease: [0.16, 1, 0.3, 1]}}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Governance Agent System</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-data-white">治理智能体运行空间</h1>
            <p className="mt-5 text-sm leading-7 text-data-soft">
              AI 不是聊天窗口，而是多个治理智能体构成的协同网络。它们正在感知风险、解析政策、学习案例并推演未来治理路径。
            </p>

            <div className="mt-6 grid gap-3">
              {[
                {label: '在线治理Agent', value: agents.length},
                {label: '今日治理信号', value: intelligence.length},
                {label: 'AI摘要完成', value: intelligence.filter((item) => item.aiSummaryStatus === 'generated').length},
              ].map((item) => (
                <div className="metric-glass rounded-card p-4" key={item.label}>
                  <span className="text-xs text-data-muted">{item.label}</span>
                  <strong className="mt-3 block font-mono text-5xl font-semibold text-data-white">{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="agent-search">
                <Search size={16} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索治理信号、城市、来源" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['全部', ...categories.intelligence].map((item) => (
                  <button className={category === item ? 'agent-filter active' : 'agent-filter'} key={item} onClick={() => setCategory(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          <motion.section
            animate={{opacity: 1, y: 0}}
            className="agent-core-field center-command-field order-1 rounded-panel p-4 lg:order-2"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.72, delay: 0.06, ease: [0.16, 1, 0.3, 1]}}
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Space × Time × Intelligence</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-data-white md:text-6xl">
                  治理智能体正在协同工作
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-civic/25 bg-civic/10 px-3 py-2 text-xs font-semibold text-civic">
                <Activity size={14} />
                Agent Runtime
              </div>
            </div>

            <div className="agent-network-space">
              <div className="agent-orbit-field" />
              <svg className="agent-network-svg" viewBox="0 0 1120 680" aria-label="治理智能体协同网络" role="img">
                <defs>
                  <linearGradient id="agentFlow" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(79,189,168,0)" />
                    <stop offset="50%" stopColor="rgba(79,189,168,0.56)" />
                    <stop offset="100%" stopColor="rgba(79,189,168,0)" />
                  </linearGradient>
                </defs>
                <path className="agent-orbit-line" d="M180 340C250 130 870 130 940 340S250 550 180 340Z" />
                <path className="agent-orbit-line faint" d="M282 220C426 322 690 322 838 220" />
                <path className="agent-orbit-line faint" d="M282 460C426 358 690 358 838 460" />
                <path className="agent-flow-line" d="M246 340C350 220 494 218 560 340S770 462 874 340" />
                <motion.circle
                  animate={{cx: [246, 350, 560, 770, 874], cy: [340, 220, 340, 462, 340], opacity: [0, 1, 0.8, 1, 0]}}
                  className="runtime-travel-signal"
                  r="4.2"
                  transition={{duration: 10.5, repeat: Infinity, ease: 'easeInOut'}}
                />
              </svg>

              <div className="agent-node-grid">
                {agents.map((agent, index) => (
                  <motion.div
                    animate={{opacity: [0.72, 1, 0.72], y: [0, -4, 0]}}
                    className={`agent-node ${agent.tone}`}
                    key={agent.name}
                    transition={{duration: 6.5, delay: index * 0.45, repeat: Infinity, ease: 'easeInOut'}}
                  >
                    <span>
                      <agent.icon size={18} />
                    </span>
                    <strong>{agent.name}</strong>
                    <em>{agent.role}</em>
                  </motion.div>
                ))}
              </div>

              <div className="agent-core-status">
                <span>GOVERNANCE INTELLIGENCE</span>
                <strong>{featured?.title}</strong>
                <em>{featured?.summary}</em>
              </div>
            </div>

            <div className="agent-flow-river mt-4">
              {collaborationFlow.map((item, index) => (
                <motion.span
                  animate={{opacity: [0.42, 0.92, 0.42]}}
                  key={item}
                  transition={{duration: 7.8, delay: index * 0.32, repeat: Infinity, ease: 'easeInOut'}}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.section>

          <motion.aside
            animate={{opacity: 1, y: 0}}
            className="order-3 grid gap-5"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1]}}
          >
            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-signal-amberSoft" size={20} />
                <h2 className="text-2xl font-semibold">智能体任务队列</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {agents.slice(0, 4).map((agent, index) => (
                  <motion.div
                    animate={{opacity: [0.54, 1, 0.54]}}
                    className="agent-task-item"
                    key={agent.name}
                    transition={{duration: 5.8, delay: index * 0.7, repeat: Infinity, ease: 'easeInOut'}}
                  >
                    <strong>{agent.name}</strong>
                    <p>{agent.task}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <GitBranch className="text-civic" size={20} />
                <h2 className="text-2xl font-semibold">Agent Memory</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {filtered.slice(0, 3).map((item) => (
                  <div className="memory-item" key={item.id}>
                    <strong>{item.city || item.region}</strong>
                    <p>{item.category} 已进入治理记忆：{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.aside>
        </div>

        <section className="relative z-10 mx-auto grid w-[min(1580px,calc(100vw-40px))] gap-4 pb-12 md:grid-cols-3">
          {filtered.slice(0, 3).map((item) => (
            <article className="glass-panel strategic-panel rounded-panel p-5" key={item.id}>
              <div className="flex items-center justify-between gap-3 text-xs text-data-muted">
                <span>{item.category}</span>
                <span>{item.city || item.region}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-7 text-data-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-data-soft">{item.summary}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-civic">
                <Sparkles size={14} />
                <span>{item.aiSummaryStatus === 'generated' ? 'Agent 已完成摘要' : '等待 Agent 处理'}</span>
                <a className="ml-auto inline-flex items-center gap-1" href={item.url}>
                  信号源 <ArrowRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
