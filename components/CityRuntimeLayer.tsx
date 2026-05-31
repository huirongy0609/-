'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import {Activity, ArrowRight, BrainCircuit, CircleDot, Clock3, History, Orbit, RadioTower, ShieldAlert, Sparkles} from 'lucide-react';

type CityRuntimeView = {
  id: string;
  name: string;
  province: string;
  caseCount: number;
  policyCount: number;
  organizationCount: number;
  status: string;
  latestUpdate: string;
  tags: string[];
  x: number;
  y: number;
};

type CityRuntimeLayerProps = {
  cities: CityRuntimeView[];
  stats: {
    cityCount: number;
    caseCount: number;
    todayIntelligence: number;
    organizationCount: number;
    policyCount: number;
  };
};

const runtimeEvents = [
  {time: '09:44:12', city: '常州', state: 'AI正在识别公共收益透明度风险扩散路径'},
  {time: '09:44:29', city: '成都', state: '停车治理案例进入跨城复用队列'},
  {time: '09:44:46', city: '杭州', state: '物业沟通舆情完成摘要，等待协同研判'},
  {time: '09:45:08', city: '深圳', state: '社区事件标签完成归类，节点状态更新'},
];

const layerStates = ['深空背景层', '城市纹理层', '神经网络层', '实时运行层', 'AI扫描层', '前景交互层'];

const riskSignals = [
  {label: '公共收益争议', value: '中风险', city: '常州'},
  {label: '停车治理矛盾', value: '待研判', city: '成都'},
  {label: '舆情波动', value: '关注', city: '杭州'},
];

const temporalFlow = [
  {phase: 'Past', label: '历史治理轨迹', value: '72h', text: '案例、风险、协同记录正在形成城市记忆'},
  {phase: 'Present', label: '实时运行态', value: 'Live', text: 'AI扫描、风险扩散、城市节点正在运行'},
  {phase: 'Future', label: 'AI推演态', value: '24h', text: '风险路径、热区变化、协同结果正在模拟'},
];

const lifecycle = ['事件生成', '舆情扩散', '风险升级', 'AI识别', '协同介入', '政策匹配', '风险缓解', '案例沉淀', '城市记忆'];

const memorySignals = [
  {city: '常州', text: '信托制物业经验形成记忆节点'},
  {city: '成都', text: '停车治理路径进入复用网络'},
  {city: '广州', text: '财务公开协同记录完成沉淀'},
];

const metricCards = [
  {label: '在线城市节点', key: 'cityCount'},
  {label: '治理案例神经元', key: 'caseCount'},
  {label: '今日AI感知信号', key: 'todayIntelligence'},
  {label: '协同机构节点', key: 'organizationCount'},
] as const;

function RuntimeNeuralMap({cities}: {cities: CityRuntimeView[]}) {
  const activeCities = cities.filter((city) => city.status === 'active').slice(0, 10);
  const pendingCities = cities.filter((city) => city.status !== 'active').slice(0, 6);

  return (
    <div className="runtime-neural-space">
      <div className="runtime-orbit" />
      <div className="runtime-scan" />
      <svg className="runtime-network-svg" viewBox="0 0 1200 720" aria-label="全国城市治理运行态势神经网络" role="img">
        <defs>
          <linearGradient id="runtimeFlow" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(79,189,168,0)" />
            <stop offset="50%" stopColor="rgba(79,189,168,0.58)" />
            <stop offset="100%" stopColor="rgba(79,189,168,0)" />
          </linearGradient>
          <radialGradient id="runtimeRisk" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(184,137,69,0.28)" />
            <stop offset="62%" stopColor="rgba(184,137,69,0.10)" />
            <stop offset="100%" stopColor="rgba(184,137,69,0)" />
          </radialGradient>
        </defs>

        <path
          className="runtime-country-field"
          d="M149 305C241 133 496 76 710 141c153 47 282 178 309 344 20 126-88 205-244 229-179 27-419-31-553-141C98 471 94 408 149 305Z"
        />
        <path className="runtime-grid-line" d="M184 338 365 236 598 201 817 286 984 454 786 626 546 644 326 566 184 338Z" />
        <path className="runtime-grid-line faint" d="M250 470C386 352 514 342 678 382S872 522 984 454" />
        <path className="runtime-grid-line faint" d="M365 236 494 596 710 141 786 626" />
        <path className="runtime-grid-line faint" d="M226 388 598 201 930 508" />

        <motion.circle
          animate={{opacity: [0.12, 0.34, 0.12], r: [62, 112, 62]}}
          className="runtime-risk-field"
          cx="760"
          cy="330"
          r="62"
          transition={{duration: 8.5, repeat: Infinity, ease: 'easeInOut'}}
        />
        <motion.circle
          animate={{opacity: [0.1, 0.26, 0.1], r: [48, 86, 48]}}
          className="runtime-risk-field"
          cx="464"
          cy="492"
          r="48"
          transition={{duration: 9.8, delay: 1.4, repeat: Infinity, ease: 'easeInOut'}}
        />

        <path className="runtime-flow-path" d="M196 492C360 366 538 374 760 330S984 364 1064 252" />
        <path className="runtime-flow-path slow" d="M286 292C454 226 604 262 724 386S890 586 1030 540" />
        <path className="runtime-flow-path quiet" d="M340 592C476 456 600 468 720 496S888 556 980 462" />
        <path className="temporal-memory-path" d="M170 548C306 458 456 430 626 472S852 588 1032 500" />
        <path className="temporal-future-path" d="M418 210C568 172 706 214 822 306S960 414 1088 376" />

        <motion.circle
          animate={{cx: [196, 360, 538, 760, 1064], cy: [492, 392, 374, 330, 252], opacity: [0, 1, 0.82, 1, 0]}}
          className="runtime-travel-signal"
          r="4.4"
          transition={{duration: 10, repeat: Infinity, ease: 'easeInOut'}}
        />
        <motion.circle
          animate={{cx: [286, 454, 724, 890, 1030], cy: [292, 226, 386, 586, 540], opacity: [0, 0.76, 1, 0.7, 0]}}
          className="runtime-travel-signal amber"
          r="3.8"
          transition={{duration: 12.8, delay: 2, repeat: Infinity, ease: 'easeInOut'}}
        />
        <motion.circle
          animate={{cx: [418, 568, 822, 960, 1088], cy: [210, 172, 306, 414, 376], opacity: [0, 0.54, 0.84, 0.54, 0]}}
          className="runtime-travel-signal future"
          r="3.5"
          transition={{duration: 15.5, delay: 2.8, repeat: Infinity, ease: 'easeInOut'}}
        />

        {activeCities.map((city, index) => {
          const cx = 150 + city.x * 9;
          const cy = 78 + city.y * 6;
          return (
            <g key={city.id}>
              <motion.circle
                animate={{opacity: [0.12, 0.34, 0.12], r: [15, 29, 15]}}
                className="runtime-node-halo"
                cx={cx}
                cy={cy}
                r="15"
                transition={{duration: 6.8, delay: index * 0.42, repeat: Infinity, ease: 'easeInOut'}}
              />
              <circle className="runtime-city-node active" cx={cx} cy={cy} r={index % 4 === 0 ? 8 : 6} />
              {index < 6 && (
                <text className="runtime-city-label" x={cx + 14} y={cy - 12}>
                  {city.name}
                </text>
              )}
            </g>
          );
        })}

        {pendingCities.map((city) => (
          <circle className="runtime-city-node pending" cx={150 + city.x * 9} cy={78 + city.y * 6} key={city.id} r="4" />
        ))}
      </svg>

      <div className="runtime-layer-tags">
        {layerStates.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="runtime-system-status">
        <span>AI CIVIC SENSING</span>
        <strong>全国治理信号正在汇入城市神经网络</strong>
        <em>policy · case · risk · public sentiment · collaboration</em>
      </div>

      <div className="temporal-axis">
        {temporalFlow.map((item) => (
          <div className="temporal-node" key={item.phase}>
            <span>{item.phase}</span>
            <strong>{item.value}</strong>
            <em>{item.label}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CityRuntimeLayer({cities, stats}: CityRuntimeLayerProps) {
  return (
    <main className="runtime-page min-h-screen overflow-hidden bg-graphite text-data-white">
      <section className="runtime-shell relative overflow-hidden">
        <div className="runtime-deep-field" />
        <div className="runtime-city-texture" />

        <div className="relative z-10 mx-auto grid w-[min(1580px,calc(100vw-40px))] gap-5 py-8 lg:grid-cols-[310px_minmax(0,1fr)_340px]">
          <motion.aside
            animate={{opacity: 1, y: 0}}
            className="glass-panel strategic-panel order-2 rounded-panel p-5 lg:order-1"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.62, ease: [0.16, 1, 0.3, 1]}}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">Operational Layer 01</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-data-white">城市运行态势层</h1>
            <p className="mt-5 text-sm leading-7 text-data-soft">
              全国城市治理信号被持续感知、解析和连接。这里不是地图展示，而是城市治理神经网络的实时运行空间。
            </p>

            <div className="mt-7 grid gap-3">
              {metricCards.map((item) => (
                <div className="metric-glass rounded-card p-4" key={item.key}>
                  <span className="text-xs text-data-muted">{item.label}</span>
                  <strong className="mt-3 block font-mono text-5xl font-semibold text-data-white">{stats[item.key]}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link className="inline-flex min-h-11 items-center gap-2 rounded-card bg-civic px-4 text-sm font-semibold text-graphite" href="/intelligence">
                进入AI研判 <ArrowRight size={16} />
              </Link>
              <Link className="inline-flex min-h-11 items-center rounded-card border border-data-divider px-4 text-sm font-semibold text-data-soft" href="/submit">
                接入治理信号
              </Link>
            </div>
          </motion.aside>

          <motion.section
            animate={{opacity: 1, y: 0}}
            className="center-command-field order-1 rounded-panel p-4 lg:order-2"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.72, delay: 0.06, ease: [0.16, 1, 0.3, 1]}}
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-civic-muted">National Civic Runtime Network</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-data-white md:text-6xl">
                  全国城市治理网络正在运行
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-civic/25 bg-civic/10 px-3 py-2 text-xs font-semibold text-civic">
                <Activity size={14} />
                实时感知
              </div>
            </div>

            <RuntimeNeuralMap cities={cities} />
          </motion.section>

          <motion.aside
            animate={{opacity: 1, y: 0}}
            className="order-3 grid gap-5"
            initial={{opacity: 0, y: 18}}
            transition={{duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1]}}
          >
            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-civic" size={20} />
                <h2 className="text-2xl font-semibold">AI扫描路径</h2>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-data-soft">
                <p>AI 正在沿城市节点、风险热区、政策动态和案例神经元进行低频扫描。</p>
                <div className="flex items-center gap-2 text-civic">
                  <Sparkles size={16} />
                  <span>研判队列持续生成中</span>
                </div>
              </div>
            </section>

            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <Clock3 className="text-civic" size={20} />
                <h2 className="text-2xl font-semibold">城市治理时间流</h2>
              </div>
              <div className="temporal-flow-list mt-5">
                {temporalFlow.map((item, index) => (
                  <motion.div
                    animate={{opacity: [0.58, 1, 0.58]}}
                    className="temporal-flow-item"
                    key={item.phase}
                    transition={{duration: 6.5, delay: index * 0.9, repeat: Infinity, ease: 'easeInOut'}}
                  >
                    <span>{item.phase}</span>
                    <strong>{item.label}</strong>
                    <p>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-signal-amberSoft" size={20} />
                <h2 className="text-2xl font-semibold">风险扩散信号</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {riskSignals.map((item) => (
                  <div className="rounded-card border border-data-divider/40 bg-graphite/28 p-4" key={item.label}>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-data-white">{item.city}</strong>
                      <span className="rounded-full bg-signal-amber/10 px-2 py-1 text-[11px] font-semibold text-signal-amberSoft">{item.value}</span>
                    </div>
                    <p className="mt-2 text-sm text-data-soft">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <History className="text-civic" size={20} />
                <h2 className="text-2xl font-semibold">城市记忆层</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {memorySignals.map((item) => (
                  <div className="memory-item" key={`${item.city}-${item.text}`}>
                    <strong>{item.city}</strong>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel strategic-panel rounded-panel p-5">
              <div className="flex items-center gap-2">
                <RadioTower className="text-civic" size={20} />
                <h2 className="text-2xl font-semibold">实时治理信号</h2>
              </div>
              <div className="runtime-feed mt-5">
                {runtimeEvents.map((item, index) => (
                  <motion.div
                    animate={{opacity: [0.55, 1, 0.55]}}
                    className="runtime-item"
                    key={`${item.time}-${item.city}`}
                    transition={{duration: 5.8, delay: index * 0.7, repeat: Infinity, ease: 'easeInOut'}}
                  >
                    <span>{item.time}</span>
                    <strong>{item.city}</strong>
                    <p>{item.state}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.aside>
        </div>

        <section className="relative z-10 mx-auto grid w-[min(1580px,calc(100vw-40px))] gap-4 pb-10 md:grid-cols-4">
          {[
            {icon: Orbit, title: '城市运行脉冲', text: '在线城市节点以低频呼吸呈现系统运行状态。'},
            {icon: CircleDot, title: '风险路径迁移', text: '风险信号沿社区、街道、城市网络缓慢扩散。'},
            {icon: BrainCircuit, title: 'AI扫描推进', text: '政策、舆情、案例和事件持续进入AI研判队列。'},
            {icon: Activity, title: '协同数据流', text: '案例复用、政策同步和共建线索在城市之间迁移。'},
          ].map((item) => (
            <article className="glass-panel strategic-panel rounded-panel p-5" key={item.title}>
              <item.icon className="text-civic" size={20} />
              <h3 className="mt-4 text-lg font-semibold text-data-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-data-soft">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="relative z-10 mx-auto grid w-[min(1580px,calc(100vw-40px))] gap-5 pb-12 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="glass-panel strategic-panel rounded-panel p-5">
            <div className="flex items-center gap-2">
              <Clock3 className="text-civic" size={20} />
              <h2 className="text-2xl font-semibold text-data-white">治理事件生命周期</h2>
            </div>
            <div className="lifecycle-river mt-6">
              {lifecycle.map((item, index) => (
                <motion.span
                  animate={{opacity: [0.42, 0.92, 0.42]}}
                  key={item}
                  transition={{duration: 7.5, delay: index * 0.35, repeat: Infinity, ease: 'easeInOut'}}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </section>

          <section className="glass-panel strategic-panel rounded-panel p-5">
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-civic" size={20} />
              <h2 className="text-2xl font-semibold text-data-white">AI未来治理沙盘</h2>
            </div>
            <div className="future-simulation mt-6">
              <div>
                <span>未来 24 小时</span>
                <strong>公共收益争议可能向街道协调层扩散</strong>
              </div>
              <div>
                <span>AI 干预点</span>
                <strong>财务公开说明会 + 同类案例同步</strong>
              </div>
              <div>
                <span>预测结果</span>
                <strong>协同介入后扩散速度下降</strong>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
